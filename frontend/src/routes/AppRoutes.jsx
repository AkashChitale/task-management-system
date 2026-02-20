import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TodosPage from '../pages/TodosPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/todos" element={<TodosPage />} />
        <Route path="/" element={<h1>Hello</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;