import Queue from "bull";
// import { redis } from "../config/redis";

export const reminderQueue = new Queue("todo-reminder", {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
});
