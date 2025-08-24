"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User } from "../types";

interface SidebarProps {
  user: User;
}

const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    ...(user.role === "Admin" || user.role === "Manager"
      ? [{ name: "Employees", href: "/employees", icon: "👥" }]
      : []),
    { name: "To-Do", href: "/todo", icon: "✅" },
  ];

  const handleLogout = () => {
    // Remove user info and token from localStorage
    localStorage.removeItem("user");
    // Optional: remove auth token from API helper if you set it globally
    router.push("/"); // redirect to login page
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Brand */}
      <div className="p-6 flex items-center mb-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold">AH</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">AdminHub</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Role & Logout */}
      <div className="mt-6 p-4 border-t border-gray-200">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900">Your Role</h3>
          <p className="text-xs text-gray-600 capitalize">{user.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:text-red-800 transition"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
