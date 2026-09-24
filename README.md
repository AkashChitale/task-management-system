# Task Manager

A full-stack task management app. React and TypeScript on the front end, Express and MongoDB on the back end, with JWT access/refresh authentication and a Redis-backed job queue for scheduled reminders.

- Live app: https://mytasks.akashchitale.tech
- API: https://api.mytasks.akashchitale.tech/api

I built this to work through the parts of a web app that tutorials usually skip: refresh token rotation, request cancellation, optimistic updates, and background job processing. The sections below cover what each piece does and where the rough edges still are.

## Features

**Accounts.** Register and log in with email and password. Passwords are hashed with bcrypt (cost 10) in a pre-save hook, so plaintext never reaches the database. Sessions use a short-lived access token plus a refresh token in an httpOnly cookie, which means an expired access token is renewed silently instead of dumping the user back on the login screen.

**Tasks.** Create, edit, complete, and delete tasks, each with an optional description and due date. The list is sorted by due date and loads ten at a time as you scroll. Filters cover all, active, completed, due today, and overdue.

**Interaction details.** Toggling and deleting apply to the UI immediately and roll back if the request fails. In-flight requests are aborted on navigation so a slow response can't overwrite newer state. Failures show a readable message rather than a status code, and a render crash lands on an error boundary instead of a blank page.

## Tech stack

| Layer    | Tools                                                                    |
| -------- | ------------------------------------------------------------------------ |
| Frontend | React 19, TypeScript, Vite 7, React Router 7, Axios, Sonner, hand-written CSS |
| Backend  | Node.js, Express 5, TypeScript (ESM), Mongoose 9, MongoDB, Zod 4, JWT, bcrypt |
| Jobs     | Bull and Redis (queue plus a separate worker process)                     |
| Hosting  | Vercel for the frontend, environment-driven API base URL                   |

## Project structure

```
backend/
  src/
    config/        Redis client
    controllers/   Route handlers for users and todos
    middlewares/   Auth, Zod validation, error handler, async wrapper
    models/        Mongoose schemas
    queues/        Bull queue definition
    routes/        Express routers
    services/      Email transport
    utils/         Access and refresh token signing
    validators/    Zod schemas per route
    workers/       Queue worker process
frontend/
  src/
    api/           Axios instance and endpoint wrappers
    auth/          Auth context and provider
    components/    Task list, filters, forms, skeletons, error boundary
    hooks/         useAuth, useTodos
    pages/         Routed pages
    routes/        Route table and protected route wrapper
    utils/         Date formatting, error message mapping
```

## How it's built

### Authentication

Two tokens with different jobs. The access token is signed for a short window and sent as `Authorization: Bearer` from `localStorage`. The refresh token is set as an httpOnly cookie and also stored on the user document, which makes it revocable: clearing that field invalidates the session server-side rather than waiting for the token to expire.

When a request returns 401, the Axios response interceptor refreshes once and replays the original request. Concurrent failures wait on a shared promise instead of each firing their own refresh, so a page issuing several parallel requests doesn't trigger a refresh storm. If the refresh itself fails, local auth state is cleared and the user is redirected to `/login`.

The access token TTL is currently set to 15 seconds in `utils/token.ts`. That value is deliberately short so the refresh path gets exercised constantly during development; it should be raised before this handles real traffic.

### Validation and errors

Each route declares a Zod schema, and a `validate` middleware parses `body`, `query`, or `params` before the controller runs, replacing the raw input with the parsed result. Controllers stay free of defensive checks and throw `AppError` for expected failures (not found, conflict, unauthorized). They're wrapped in an `asyncHandler`, so no controller needs a `try/catch`.

A single error handler maps `ZodError` to a 400 with the first issue's message, `AppError` to its own status code, and anything else to a 500 with the detail logged server-side. Clients get a consistent shape:

```json
{ "success": false, "message": "Todo not found" }
```

### Pagination and optimistic updates

`GET /todos` uses offset pagination. The controller fetches `limit + 1` documents: if it gets the extra row, there's another page, and it pops it before responding. That avoids a separate existence query for the `hasMore` flag, though a `countDocuments` call still runs for the total.

On the client, toggling and deleting update local state first and restore the previous array if the request fails. Loading is cancelled with an `AbortController` on unmount, and aborted requests are filtered out so they never set error state.

## API

Base path is `/api`. Every `/todos` route requires a bearer token.

| Method | Endpoint                 | Auth   | Description                                     |
| ------ | ------------------------ | ------ | ----------------------------------------------- |
| POST   | `/users/register`        | No     | Create an account                               |
| POST   | `/users/login`           | No     | Returns an access token, sets the refresh cookie |
| POST   | `/users/refresh-token`   | Cookie | Issues a new access token                       |
| GET    | `/users/me`              | Bearer | Current user                                    |
| GET    | `/todos`                 | Bearer | Paginated list, sorted by due date              |
| POST   | `/todos/create`          | Bearer | Create a task                                   |
| PUT    | `/todos/:id`             | Bearer | Update title, description, or due date          |
| PATCH  | `/todos/:id/toggle`      | Bearer | Flip the completed flag                         |
| DELETE | `/todos/:id`             | Bearer | Delete a task                                   |

`GET /todos` accepts `page` and `limit`. The page size defaults to 10 when `limit` is omitted, and a client-supplied `limit` is rejected above 5:

```json
{
  "pages": 1,
  "limit": 10,
  "total": 3,
  "todos": [],
  "hasMore": false
}
```

`pages` is the current page number. Validation rules worth knowing: titles can't be empty, passwords need at least 6 characters, usernames at least 3, and due dates must be valid and in the future.

## Running locally

You'll need Node 20 or newer and a MongoDB instance. Redis is only required if you want to run the queue worker.

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
PORT=3300
MONGO_URI=mongodb://localhost:27017/task-manager
ACCESS_TOKEN_SECRET=replace-with-a-random-string
REFRESH_TOKEN_SECRET=replace-with-a-different-random-string
REDIS_HOST=localhost
REDIS_PORT=6379
```

```bash
npm run dev      # API on http://localhost:3300
npm run worker   # optional, separate process for queued jobs
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.development`:

```
VITE_API_BASE_URL=/api
```

```bash
npm run dev      # http://localhost:5173
```

The dev server proxies `/api` to `http://localhost:3300` (see `vite.config.ts`). That's why the backend should run on 3300 locally and the frontend points at a relative path: requests stay same-origin in development, so no CORS configuration is needed.

### Production

The frontend builds with `npm run build` and deploys to Vercel, where `vercel.json` rewrites every path to `index.html` so client-side routes survive a refresh. The production API base URL lives in `frontend/.env.production`. The backend compiles with `npm run build` and starts with `npm start`.

## Environment variables

**Backend**

| Variable               | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| `PORT`                 | API port. Defaults to 3000; the dev proxy expects 3300 |
| `MONGO_URI`            | MongoDB connection string                        |
| `ACCESS_TOKEN_SECRET`  | Signs access tokens                              |
| `REFRESH_TOKEN_SECRET` | Signs refresh tokens                             |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` | Queue connection; only needed by the worker |

**Frontend**

| Variable            | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `VITE_API_BASE_URL` | API base including the `/api` prefix            |

## Where it stands

Things that are built but not finished, and things I'd fix next:

- **Reminders don't send yet.** The Bull queue and worker are wired up and process jobs from Redis, but the email service is a stub that logs to the console, and scheduling is disabled in the todo controller. Swapping in a real transport and re-enabling the scheduler is the remaining work.
- **No automated tests.** The backend test script is still a placeholder. API tests with Jest and Supertest are the next thing I want to add, followed by a few component tests around the auth flow.
- **`search`, `sortBy`, and `sortOrder`** are accepted by the todos query validator but not applied in the controller. The list is always sorted by due date.
- **CORS is pinned to the production origin** in `app.ts`. It should come from an environment variable so the API can be reached from other hosts.
- **No rate limiting** on the auth routes, and no account lockout after repeated failed logins.

## Author

Akash Chitale

- GitHub: https://github.com/AkashChitale
- Live app: https://mytasks.akashchitale.tech
