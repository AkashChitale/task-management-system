import AppRoutes from "./routes/AppRoutes";

import "./App.css";

// axiosInstance.get("/").then(res => console.log("Hello from the backend!", res.data)).catch(console.error );

function App() {

  return (
    <>
      <h1 style={{textAlign: "center"}}>To Do Manager</h1>
      <AppRoutes />
    </>
  )
}

export default App
