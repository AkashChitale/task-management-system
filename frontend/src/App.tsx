import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";

import "./App.css";

// axiosInstance.get("/").then(res => console.log("Hello from the backend!", res.data)).catch(console.error );

function App() {

  return (
    <>
      <Navbar />
      <AppRoutes />
    </>
  )
}

export default App
