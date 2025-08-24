import Link from "next/link";
import { User } from "../types";

interface SidebarProps {
  user: User;
}

const Sidebar = ({ user }: SidebarProps) => (
  <aside className="w-64 bg-white shadow-md h-screen flex flex-col">
    <div className="px-6 py-4 border-b">
      <h1 className="text-xl font-bold text-blue-600">AdminHub</h1>
      <p className="text-sm text-gray-500">{user.role}</p>
    </div>
    <nav className="flex-1 p-4">
      <ul className="space-y-4">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            📊 Dashboard
          </Link>
        </li>
        {(user.role === "Admin" || user.role === "Manager") && (
          <li>
            <Link
              href="/employees"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              👥 Employees
            </Link>
          </li>
        )}
        <li>
          <Link
            href="/todo"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            ✅ To-Do
          </Link>
        </li>
      </ul>
    </nav>
    <div className="px-6 py-4 border-t">
      <button className="text-red-600 flex items-center gap-2">
        🚪 Logout
      </button>
    </div>
  </aside>
);

export default Sidebar;
