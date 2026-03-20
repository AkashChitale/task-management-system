import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

import "./App.css";
import { AuthProvider } from "./auth/AuthContext";
import { Toaster } from "sonner";
import { useAuth } from "./hooks/useAuth";

// axiosInstance.get("/").then(res => console.log("Hello from the backend!", res.data)).catch(console.error );

// Layout component to access the context
const AppLayout = () => {
  const { isAuthenticated } = useAuth(); // Get state from your context

  return (
    <div className="app-shell">
      {isAuthenticated && <Navbar />}

      <main className={`app-content ${!isAuthenticated ? "full-width" : ""}`}>
        <AppRoutes />
      </main>
    </div>
  );
};

// App component stays clean
function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <AppLayout /> 
    </AuthProvider>
  );
}

export default App
