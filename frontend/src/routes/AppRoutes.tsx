import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TodosPage from '../pages/TodosPage';
import LoginPage from '../pages/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import ErrorBoundary from '../components/ErrorBoundary';

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/todos" element={<ProtectedRoute><TodosPage /></ProtectedRoute>} />
          <Route path="/" element={<h1>Hello</h1>} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default AppRoutes;