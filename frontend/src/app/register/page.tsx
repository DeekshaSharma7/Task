"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "../../lib/api";
import Button from "../../components/Button";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"User" | "Manager" | "Admin">("User");

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", { name, email, password, role });
      toast.success("Registered successfully!"); 
      router.push("/"); 
    } catch (err: unknown) {
      // ✅ type-safe error handling
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Toaster position="top-right" /> {/* ✅ toast container */}
      <div className="w-96 p-6 shadow-lg rounded bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "User" | "Manager" | "Admin")
          }
          className="w-full p-2 mb-6 border rounded"
        >
          <option value="User">User</option>
          <option value="Manager">Manager</option>
          <option value="Admin">Admin</option>
        </select>
        <Button onClick={handleRegister} className="w-full">
          Register
        </Button>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
