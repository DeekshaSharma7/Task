"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API, { setAuthToken } from "../../lib/api";
import Sidebar from "../../components/Sidebar";
import Button from "../../components/Button";
import { User, Employee, Todo } from "../../types";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }

    const userObj: User = JSON.parse(storedUser);
    setUser(userObj);
    setAuthToken(userObj.token);

    // Employees fetch for Admin/Manager
    if (userObj.role === "Admin" || userObj.role === "Manager") {
      API.get("/users")
        .then((res) => setEmployees(res.data))
        .catch((err) => console.log(err));
    }

    // Todos fetch for all users
    API.get("/todos")
      .then((res) => setTodos(res.data))
      .catch((err) => console.log(err));
  }, [router]);

  if (!user) return null;

  // ✅ Fix calculations
  const totalUsers = employees.length;
  const activeTasks = todos.filter((t) => t.status === "Pending").length;
  const completedTasks = todos.filter((t) => t.status === "Completed").length;
  const pendingTasks = completedTasks; // based on your description
  const completedPercent =
    todos.length > 0 ? Math.round((completedTasks / todos.length) * 100) : 0;

  // ✅ Last 5 tasks as "Recent Activities"
  const recentTasks = [...todos].slice(-5).reverse();

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Dashboard */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.name}</span>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm capitalize">
              {user.role}
            </span>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6 flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl">
              👥
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xl">
              ✅
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Tasks</p>
              <p className="text-2xl font-bold">{activeTasks}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 text-xl">
              ⏰
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold">{pendingTasks}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-xl">
              📊
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-purple-700">
                {completedPercent}%
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Activities
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <li
                    key={task._id}
                    className="flex items-center gap-2 border-b pb-2 last:border-none"
                  >
                    <span>{task.status === "Completed" ? "✅" : "⏳"}</span>
                    {task.task}
                    <span className="ml-auto text-xs text-gray-400">
                      {task.status}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No recent tasks</li>
              )}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.push("/employees")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                + Add New Employee
              </Button>
              <Button
                onClick={() => router.push("/todo")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                + Add New Task
              </Button>
              <Button className="bg-gray-200 hover:bg-gray-300 text-gray-700">
                ⬇ Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
