import { useEffect, useState } from "react";
import "./App.css";
import TodoApp from "./components/TodoApp";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function getTodos() {
      try {
        const res = await axios.get("http://localhost:5000/todos/all");
        setTodos(res.data?.alltodos);
      } catch (err) {
        console.log("something went wrong getting todos ");
      }
    }
    getTodos();
  }, []);

  const onAddTodo = (todo) => {
    setTodos((prevTodos) => [todo, ...prevTodos]);
  };

  const handleDeleteTodo = async (id) => {
    try {
      const { data } = await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.log("somethng went wrong while delete the todo");
    }
  };

  return (
    <>
      <TodoApp
        todos={todos}
        onAddTodo={onAddTodo}
        handleDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}

export default App;
