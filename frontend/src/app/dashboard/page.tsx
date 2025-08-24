"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API, { setAuthToken } from "../../lib/api";
import Sidebar from "../../components/Sidebar";
import Button from "../../components/Button";
import { User, Employee } from "../../types";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
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

    if (userObj.role === "Admin" || userObj.role === "Manager") {
      API.get("/employees")
        .then((res) => setEmployees(res.data))
        .catch((err) => console.log(err));
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Dashboard */}
      <div className="flex-1 p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.name}</span>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
              {user.role}
            </span>
          </div>
        </header>

        {/* Metrics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 shadow rounded-xl">
            <h3 className="text-gray-500 text-sm">Total Employees</h3>
            <p className="text-2xl font-bold">{employees.length}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-xl">
            <h3 className="text-gray-500 text-sm">Active Users</h3>
            <p className="text-2xl font-bold">
              {employees.filter((e) => e.role !== "Inactive").length}
            </p>
          </div>
          <div className="bg-white p-4 shadow rounded-xl">
            <h3 className="text-gray-500 text-sm">Pending Tasks</h3>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="bg-white p-4 shadow rounded-xl">
            <h3 className="text-gray-500 text-sm">Productivity</h3>
            <p className="text-2xl font-bold text-green-600">89%</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="col-span-2 bg-white shadow rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-4">
              Recent Activities
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-blue-500">🔵</span>
                New employee added: Sarah Johnson
                <span className="ml-auto text-xs text-gray-400">2h ago</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                Task completed by Mike Davis
                <span className="ml-auto text-xs text-gray-400">4h ago</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-500">🟡</span>
                Employee role updated: Lisa Chen
                <span className="ml-auto text-xs text-gray-400">1d ago</span>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                + Add New Employee
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
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
