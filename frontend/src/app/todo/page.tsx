"use client";

import { useEffect, useState } from "react";
import API, { setAuthToken } from "../../lib/api";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Button from "../../components/Button";
import TodoModal from "../../components/TodoModal";
import { User, Todo } from "../../types";
import DataTable, { Column } from "../../components/DataTable";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

// Tooltip wrapper
const Tooltip = ({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) => (
  <div className="relative group inline-block">
    {children}
    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      {text}
    </span>
  </div>
);

export default function TodoPage() {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const userObj: User = JSON.parse(storedUser);
    setUser(userObj);
    setAuthToken(userObj.token);
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await API.get("/todos");
      setTodos(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const addTodo = async (data: { task: string; dueDate: string }) => {
    try {
      const res = await API.post("/todos", data);
      setTodos([...todos, res.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const updateTodo = async (
    id: string,
    data: { task: string; dueDate: string }
  ) => {
    try {
      const res = await API.put(`/todos/${id}`, data);
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
    } catch (err) {
      console.log(err);
    }
  };

  const toggleStatus = async (id: string) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;
    try {
      const res = await API.put(`/todos/${id}`, {
        status: todo.status === "Pending" ? "Completed" : "Pending",
      });
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTodo = async () => {
    if (!todoToDelete) return;
    try {
      await API.delete(`/todos/${todoToDelete._id}`);
      setTodos(todos.filter((todo) => todo._id !== todoToDelete._id));
    } catch (err) {
      console.log(err);
    } finally {
      setIsDeleteModalOpen(false);
      setTodoToDelete(null);
    }
  };

  const columns: Column<Todo>[] = [
    {
      key: "task",
      header: "Task",
      render: (todo) => (
        <span
          className={
            todo.status === "Completed" ? "text-gray-400 line-through" : ""
          }
        >
          {todo.task}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (todo) =>
        todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "-",
    },
    {
      key: "status",
      header: "Status",
      render: (todo) => (
        <span
          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
            todo.status === "Completed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {todo.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (todo) => (
        <div className="flex gap-3">
          <Tooltip
            text={todo.status === "Pending" ? "Mark as Complete" : "Undo Task"}
          >
            <button
              onClick={() => toggleStatus(todo._id)}
              className="text-blue-600 hover:underline"
            >
              {todo.status === "Pending" ? "✅" : "↩️"}
            </button>
          </Tooltip>

          <Tooltip text="Edit Task">
            <button
              onClick={() => {
                setEditingTodo(todo);
                setIsModalOpen(true);
              }}
              className="text-indigo-600 hover:underline"
            >
              ✏️
            </button>
          </Tooltip>

          <Tooltip text="Delete Task">
            <button
              onClick={() => {
                setTodoToDelete(todo);
                setIsDeleteModalOpen(true);
              }}
              className="text-red-600 hover:underline"
            >
              🗑️
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col">
        <Header title="To-Do List" user={user} />

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-500">
              Manage your tasks and stay organized
            </p>
            <Button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setIsModalOpen(true)}
            >
              + Add New Task
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <DataTable data={todos} columns={columns} />
          </div>
        </div>
      </div>

      {/* Todo Modal */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={(data) => {
          if (editingTodo) updateTodo(editingTodo._id, data);
          else addTodo(data);
        }}
        initialData={
          editingTodo
            ? { task: editingTodo.task, dueDate: editingTodo.dueDate || "" }
            : undefined
        }
        mode={editingTodo ? "edit" : "add"}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTodoToDelete(null);
        }}
        onConfirm={deleteTodo}
        message={`Are you sure you want to delete "${todoToDelete?.task}"?`}
      />
    </div>
  );
}
