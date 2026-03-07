import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

import "./App.css";
import { AuthProvider } from "./auth/AuthContext";

// axiosInstance.get("/").then(res => console.log("Hello from the backend!", res.data)).catch(console.error );

function App() {

  return (
    <AuthProvider>
      <Navbar />
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
