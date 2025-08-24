"use client";

import { useEffect, useState } from "react";
import API, { setAuthToken } from "../../lib/api";
import Sidebar from "../../components/Sidebar";
import Button from "../../components/Button";
import { User, Todo } from "../../types";

export default function TodoPage() {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const userObj: User = JSON.parse(storedUser);
    setUser(userObj);
    setAuthToken(userObj.token);

    API.get("/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => console.log(err));
  }, []);

  const addTodo = async () => {
    if (!task) return;
    const res = await API.post("/todos", { task });
    setTodos([...todos, res.data]);
    setTask("");
  };

  const toggleStatus = async (id: string) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;
    const res = await API.put(`/todos/${id}`, {
      status: todo.status === "Pending" ? "Completed" : "Pending",
    });
    setTodos(todos.map((t) => (t._id === id ? res.data : t)));
  };

  const deleteTodo = async (id: string) => {
    await API.delete(`/todos/${id}`);
    setTodos(todos.filter((t) => t._id !== id));
  };

  if (!user) return null;

  return (
    <div className="flex">
      <Sidebar user={user} />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">My To-Do</h2>
        <div className="flex mb-4 gap-2">
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="New Task"
            className="border p-2 flex-1 rounded"
          />
          <Button onClick={addTodo}>Add</Button>
        </div>
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex justify-between items-center border p-2 rounded hover:bg-gray-50"
            >
              <span
                className={
                  todo.status === "Completed"
                    ? "line-through text-gray-500"
                    : ""
                }
              >
                {todo.task}
              </span>
              <div className="flex gap-2">
                <Button onClick={() => toggleStatus(todo._id)}>
                  {todo.status === "Pending" ? "Complete" : "Undo"}
                </Button>
                <Button onClick={() => deleteTodo(todo._id)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
