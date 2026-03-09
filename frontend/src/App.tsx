import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

import "./App.css";
import { AuthProvider } from "./auth/AuthContext";
import { Toaster } from "sonner";

// axiosInstance.get("/").then(res => console.log("Hello from the backend!", res.data)).catch(console.error );

function App() {

  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />

      <div className="app-shell">
        <Navbar />

        <main className="app-content">
          <AppRoutes />
        </main>

      </div>
    </AuthProvider>
  )
}

export default App
