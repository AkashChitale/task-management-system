import "./App.css"
import axiosInstance from "./api/client"

axiosInstance.get("/").then(res => console.log("Hello from the backend!", res.data)).catch(console.error );

function App() {

  return (
    <>
      <h1>To Do Manager</h1>
    </>
  )
}

export default App
