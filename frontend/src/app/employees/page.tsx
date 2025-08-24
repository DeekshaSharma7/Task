"use client";

import { useEffect, useState } from "react";
import API, { setAuthToken } from "../../lib/api";
import { Employee, User } from "../../types";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import DataTable from "../../components/DataTable";
import Button from "../../components/Button";

export default function EmployeesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj: User = JSON.parse(storedUser);
      setUser(userObj);
      setAuthToken(userObj.token);

      API.get("/employees")
        .then((res) => setEmployees(res.data))
        .catch((err) => console.log(err));
    }
  }, []);

  if (!user) return null;

  // filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      roleFilter === "All Roles" ? true : emp.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns = ["Name", "Email", "Role", "Status"];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header title="Employee Management" />

        <div className="p-6 space-y-4">
          {/* Search + Filter + Add */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search employees..."
                className="border p-2 rounded w-60"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="border p-2 rounded"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option>All Roles</option>
                <option>Admin</option>
                <option>Manager</option>
                <option>Employee</option>
              </select>
            </div>

            <Button className="bg-blue-600 text-white px-4 py-2 rounded">
              + Add New User
            </Button>
          </div>

          {/* Employee Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredEmployees.map((e) => ({
                _id: e._id,
                name: e.name,
                email: e.email,
                role: (
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      e.role === "Manager"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {e.role}
                  </span>
                ),
                status: (
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      e.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {e.status}
                  </span>
                ),
              }))}
              actions={(row) => (
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:underline">✏️</button>
                  <button className="text-red-600 hover:underline">🗑️</button>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
