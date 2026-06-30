import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, CheckSquare, BarChart3, Trophy } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: <CheckSquare size={20} />,
    },

    {
      name: "Analytics",
      path: "/analytics",
      icon: <BarChart3 size={20} />,
    },
    {
      name: "Rewards",
      path: "/rewards",
      icon: <Trophy size={20} />,
    },
  ];

  return (
    <div
      className={`w-64 min-h-screen p-6 border-r transition-all duration-300 ${
        theme === "dark"
          ? "bg-slate-900 text-white border-slate-800"
          : "bg-white text-slate-900 border-gray-300"
      }`}
    >
      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-cyan-400">FocusFlow AI 🚀</h1>

        <p className="text-sm text-slate-400 mt-1">Productivity Companion</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${
                location.pathname === item.path
                  ? "bg-cyan-500 text-white"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* AI Status Box */}
      <div className="mt-12 bg-slate-800 rounded-xl p-4">
        <h3 className="font-semibold text-cyan-400">AI Status</h3>

        <p className="text-sm text-slate-300 mt-2">
          Monitoring deadlines and attention patterns.
        </p>

        <div className="mt-3">
          <span className="bg-green-500 text-black px-2 py-1 rounded text-xs font-semibold">
            Active
          </span>
        </div>
      </div>
      {/* Theme Toggle */}

      <div className="mt-8">
        <button
          onClick={toggleTheme}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
        >
          {theme === "dark"
            ? "☀️ Switch to Light Mode"
            : "🌙 Switch to Dark Mode"}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
