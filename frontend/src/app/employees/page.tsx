"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API, { setAuthToken } from "../../lib/api";
import { User } from "../../types";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import DataTable, { Column } from "../../components/DataTable";
import Button from "../../components/Button";
import UserModal from "../../components/UserModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

export default function UsersPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

 useEffect(() => {
   const storedUser = localStorage.getItem("user");
   if (!storedUser) {
     router.push("/login");
     return;
   }
   const userObj: User = JSON.parse(storedUser);
   setUser(userObj);
   setAuthToken(userObj.token);

   if (userObj.role !== "Admin" && userObj.role !== "Manager") {
     router.push("/dashboard");
     return;
   }

   fetchUsers().finally(() => setLoading(false));
 }, [router]);

 const fetchUsers = async () => {
   try {
     const res = await API.get("/users");
     setUsers(res.data);
   } catch (err) {
     console.error("Failed to fetch users:", err);
   }
 };

 if (loading) return <div className="p-6">Loading...</div>;
 if (!user) return null;

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      roleFilter === "All Roles" ? true : u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns: Column<User>[] = [
    { key: "name", header: "Name", render: (u) => u.name },
    { key: "email", header: "Email", render: (u) => u.email },
    {
      key: "role",
      header: "Role",
      render: (u) => (
        <span
          className={`px-2 py-1 rounded text-sm ${
            u.role === "Manager"
              ? "bg-purple-100 text-purple-600"
              : u.role === "Admin"
              ? "bg-red-100 text-red-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {u.role}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (u) => (
        <div className="flex gap-2">
          {/* Edit button is available for everyone */}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => {
              setEditingUser(u);
              setIsModalOpen(true);
            }}
          >
            ✏️
          </button>

          {/* Delete button only for Admin */}
          {user.role === "Admin" && (
            <button
              className="text-red-600 hover:underline"
              onClick={() => {
                setUserToDelete(u);
                setIsDeleteModalOpen(true);
              }}
            >
              🗑️
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col">
        <Header title="User Management" user={user} />

        <div className="p-6 space-y-4">
          {/* Search + Filter + Add */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded w-60"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border p-2 rounded"
              >
                <option>All Roles</option>
                <option>Admin</option>
                <option>Manager</option>
                <option>User</option>
              </select>
            </div>

            <Button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => {
                setEditingUser(null);
                setIsModalOpen(true);
              }}
            >
              + Add New User
            </Button>
          </div>

          {/* User Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <DataTable data={filteredUsers} columns={columns} />
          </div>
        </div>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        initialData={editingUser ?? undefined}
        onUserAdded={(newUser: User) => {
          if (editingUser) {
            setUsers(
              users.map((usr) => (usr._id === newUser._id ? newUser : usr))
            );
          } else {
            setUsers([...users, newUser]);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={async () => {
          if (!userToDelete) return;
          try {
            await API.delete(`/users/${userToDelete._id}`);
            setUsers(users.filter((usr) => usr._id !== userToDelete._id));
          } catch (err) {
            console.error("Delete failed:", err);
          } finally {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
          }
        }}
        message={`Are you sure you want to delete ${userToDelete?.name}?`}
      />
    </div>
  );
}
