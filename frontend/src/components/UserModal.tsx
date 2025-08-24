"use client";

import { useEffect, useState } from "react";
import Button from "./Button";
import { User } from "../types";
import API from "../lib/api";
import toast, { Toaster } from "react-hot-toast"; // ✅ import toast

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: User;
  onUserAdded?: (user: User) => void; // callback to update table
}

export default function UserModal({
  isOpen,
  onClose,
  initialData,
  onUserAdded,
}: UserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
    status: "Active",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        password: "",
        role: initialData.role,
        status: initialData.status || "Active",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "User",
        status: "Active",
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dataToSend: Partial<typeof formData> = { ...formData };

      if (initialData && !formData.password) {
        delete dataToSend.password;
      }

      let res;
      if (initialData) {
        res = await API.put(`/users/${initialData._id}`, dataToSend);
        toast.success("User updated successfully!"); // ✅ toast success
      } else {
        res = await API.post("/auth/register", dataToSend);
        toast.success("User added successfully!"); // ✅ toast success
      }

      if (onUserAdded) onUserAdded(res.data);
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      console.error(error.response?.data || error);
      toast.error(error.response?.data?.message || "Operation failed"); // ✅ toast error
    }
  };

  return (
    <>
      <Toaster position="top-right" /> {/* ✅ add Toaster somewhere in JSX */}
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ backgroundColor: "rgb(44 41 41 / 72%)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            {initialData ? "Edit User" : "Add New User"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 border rounded-md"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-2 border rounded-md"
              required
            />
            {!initialData && (
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-2 border rounded-md"
                required
              />
            )}
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
            </select>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {initialData ? "Save Changes" : "Add User"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
