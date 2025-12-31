import { useEffect, useState } from "react";
import axios from "axios";
export default function TodoApp({ todos, onAddTodo, handleDeleteTodo }) {
  const [todo, setTodo] = useState({
    title: "",
    completed: false,
  });

  const handleTodoAdd = async (e) => {
    e.preventDefault();
    if (!todo.title) return;
    try {
      const res = await axios.post("http://localhost:5000/todos/create", todo);
      onAddTodo(res.data);
    } catch (err) {
      console.log("something went wrong while adding new todo ");
    }
  };

  return (
    <>
      <input
        placeholder="Add todo"
        value={todo.title}
        onChange={(e) => {
          setTodo((prevTodo) => ({
            ...prevTodo,
            title: e.target.value,
          }));
        }}
      />
      <button onClick={handleTodoAdd}>Add Button</button>

      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          gap: ".5rem",
          padding: "10px 5px",
        }}
      >
        {todos &&
          todos.map((todo) => {
            return (
              <div
                key={todo._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "20%",
                  justifyContent: "space-between",
                }}
              >
                <span>{todo.title}</span>
                <button onClick={() => handleDeleteTodo(todo._id)}>
                  Delete{" "}
                </button>
              </div>
            );
          })}
      </ul>
    </>
  );
}
