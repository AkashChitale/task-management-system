import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TodosPage from '../pages/TodosPage';
import LoginPage from '../pages/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/todos" element={<ProtectedRoute><TodosPage /></ProtectedRoute>} />
        <Route path="/" element={<h1>Hello</h1>} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;