import { useTasks } from "../context/TaskContext";
import { useScreenTime } from "../context/ScreenTimeContext";
import { useTheme } from "../context/ThemeContext";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
} from "recharts";
function Analytics() {
  const { tasks } = useTasks();
  const { screenTime } = useScreenTime();
  const { theme } = useTheme();
  const instagram = screenTime.Instagram;
  const youtube = screenTime.YouTube;
  const whatsapp = screenTime.WhatsApp;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "Completed",
  ).length;

  const lowRisk = tasks.filter(
    (task) => task.status !== "Completed" && task.risk < 40,
  ).length;

  const mediumRisk = tasks.filter(
    (task) => task.status !== "Completed" && task.risk >= 40 && task.risk < 80,
  ).length;

  const highRisk = tasks.filter(
    (task) => task.status !== "Completed" && task.risk >= 80,
  ).length;
  const pieData = [
    {
      name: "Completed",
      value: completedTasks,
    },
    {
      name: "Pending",
      value: pendingTasks,
    },
  ];

  const riskData = [
    {
      name: "Low",
      value: lowRisk,
    },
    {
      name: "Medium",
      value: mediumRisk,
    },
    {
      name: "High",
      value: highRisk,
    },
  ];

  const screenData = [
    {
      app: "Instagram",
      minutes: instagram,
    },
    {
      app: "YouTube",
      minutes: youtube,
    },
    {
      app: "WhatsApp",
      minutes: whatsapp,
    },
  ];
  const productivity =
    tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

  return (
    <div
      className={`min-h-screen p-8 transition-all duration-300 ${
        theme === "dark" ? "bg-slate-950 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h1 className="text-4xl font-bold mb-8">📊 Analytics Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Pie Chart */}

        <div
          className={`rounded-xl p-6 shadow-lg transition-all ${
            theme === "dark" ? "bg-slate-800 text-white" : "bg-white text-black"
          }`}
        >
          <h2 className="text-2xl font-bold mb-6">✅ Tasks Completed</h2>

          <PieChart width={280} height={280}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              <Cell fill="#22c55e" />

              <Cell fill="#ef4444" />
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </div>
        {/* Risk Distribution */}

        <div
          className={`rounded-xl p-6 shadow-lg transition-all ${
            theme === "dark" ? "bg-slate-800 text-white" : "bg-white text-black"
          }`}
        >
          <h2 className="text-2xl font-bold mb-6">⚠ Risk Distribution</h2>

          <BarChart width={320} height={280} data={riskData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar dataKey="value" fill="#38bdf8" radius={[8, 8, 0, 0]} />
          </BarChart>
        </div>
        {/* ==========================
    Screen Time Analysis
========================== */}

        <div
          className={`rounded-xl p-6 shadow-lg transition-all ${
            theme === "dark" ? "bg-slate-800 text-white" : "bg-white text-black"
          }`}
        >
          <h2 className="text-2xl font-bold mb-6">📱 Screen Time Analysis</h2>

          <BarChart width={320} height={280} data={screenData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="app" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar dataKey="minutes" fill="#a855f7" radius={[8, 8, 0, 0]} />
          </BarChart>
        </div>
        {/* ==========================
    Productivity Score
========================== */}

        <div
          className={`rounded-xl p-6 shadow-lg transition-all ${
            theme === "dark" ? "bg-slate-800 text-white" : "bg-white text-black"
          }`}
        >
          <h2 className="text-2xl font-bold mb-6">🚀 Productivity Score</h2>

          <RadialBarChart
            width={320}
            height={300}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            barSize={18}
            data={[
              {
                name: "Productivity",
                value: productivity,
                fill: "#22c55e",
              },
            ]}
          >
            <RadialBar dataKey="value" cornerRadius={12} />

            <Legend />

            <Tooltip />
          </RadialBarChart>

          <div className="text-center mt-4">
            <p className="text-4xl font-bold text-green-400">
              {productivity.toFixed(0)}%
            </p>

            <p
              className={`${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Overall Productivity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Analytics;
