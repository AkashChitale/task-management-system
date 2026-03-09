import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import TodosPage from "../pages/TodosPage";
import LoginPage from "../pages/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import ErrorBoundary from "../components/ErrorBoundary";
import { useAuth } from "../hooks/useAuth";
import RegisterPage from "../pages/RegisterPage";

const HomeRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <Navigate to={isAuthenticated ? "/todos" : "/login"} replace />;
};

const NotFound = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>404</h1>
    <p>Page not found.</p>
  </div>
);

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <TodosPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default AppRoutes;