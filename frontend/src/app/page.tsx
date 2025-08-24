"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import API, { setAuthToken } from "../lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      setAuthToken(res.data.token);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">AH</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to your account to continue
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              📧
            </span>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔒
            </span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-4 h-4 rounded border-gray-300"
            />
            Remember me
          </label>
          <Link href="/" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* Sign In button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Sign In
        </button>

        {/* Or continue with */}
        <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
          <span>────────</span>
          <span>Or continue with</span>
          <span>────────</span>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition">
            <Image
              src="/google.png"
              alt="Google"
              width={20} // required
              height={20} // required
              className="w-5 h-5" // optional styling
            />
            Google
          </button>
          <button className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition">
            <Image
              src="/facebook.jpg"
              alt="Facebook"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            Facebook
          </button>
        </div>

        {/* Sign up */}
        <p className="text-center text-sm text-gray-500">
          Do not have an account?{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 space-x-2">
          <span>Privacy Policy</span>·<span>Terms of Service</span>·
          <span>Help</span>
        </div>
      </div>
    </div>
  );
}
