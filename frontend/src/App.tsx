import "./App.css"
import axiosInstance from "./api/client"
import TodoList  from "./components/TodoList";

axiosInstance.get("/").then(res => console.log("Hello from the backend!", res.data)).catch(console.error );

function App() {

  return (
    <>
      <h1>To Do Manager</h1>
      <TodoList />
    </>
  )
}

export default App
