import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import { useTasks } from "../context/TaskContext";
import { useScreenTime } from "../context/ScreenTimeContext";
import { calculateDecision } from "../utils/decisionEngine";
import { getReminderPlan } from "../utils/reminderEngine";
import { useTheme } from "../context/ThemeContext";

function Dashboard() {
  const { tasks } = useTasks();
  const { theme, toggleTheme } = useTheme();

  const { screenTime, setScreenTime } = useScreenTime();

  const highRiskTask = [...tasks]
    .filter((task) => task.status !== "Completed")
    .sort((a, b) => {
      let scoreA = a.risk;
      let scoreB = b.risk;
      // Interview gets highest importance
      if (a.category === "Interview") scoreA += 20;
      if (b.category === "Interview") scoreB += 20;

      // Meeting
      if (a.category === "Meeting") scoreA += 15;
      if (b.category === "Meeting") scoreB += 15;

      // Bill Payment
      if (a.category === "Bill Payment") scoreA += 10;
      if (b.category === "Bill Payment") scoreB += 10;

      if (scoreB !== scoreA) return scoreB - scoreA;

      return new Date(a.deadline) - new Date(b.deadline);
    })[0];

  const decision = highRiskTask
    ? calculateDecision(
        highRiskTask.priority,
        highRiskTask.deadline,
        highRiskTask.category,
        screenTime.Instagram,
      )
    : null;

  const reminderPlan = highRiskTask
    ? getReminderPlan(highRiskTask.deadline)
    : null;

  // ---------------------
  // Rewards Calculation
  // ---------------------

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  const xp = completedTasks * 50;

  const level = Math.floor(xp / 100) + 1;

  const highRisk = tasks.filter(
    (task) => task.risk >= 80 && task.status !== "Completed",
  ).length;

  const productivity = Math.max(
    20,
    100 - highRisk * 15 - screenTime.Instagram / 20 + completedTasks * 5,
  );

  const badges = [
    {
      name: "🔥 Focus Warrior",
      unlocked: screenTime.Instagram < 180,
    },
    {
      name: "🏆 Deadline Master",
      unlocked: highRisk === 0,
    },
    {
      name: "⚡ Consistency King",
      unlocked: completedTasks >= 5,
    },
    {
      name: "🧠 AI Expert",
      unlocked: level >= 5,
    },
    {
      name: "⭐ Productivity Pro",
      unlocked: productivity >= 90,
    },
  ];
  return (
    <div
      className={`min-h-screen flex transition-all duration-300 ${
        theme === "dark" ? "bg-slate-950 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={`flex-1 p-8 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        {/* Greeting */}
        <h1 className="text-4xl font-bold mb-8">Hello Diksha 👋</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Pending Tasks"
            value={tasks.filter((task) => task.status !== "Completed").length}
          />

          <StatsCard
            title="High Risk"
            value={
              tasks.filter(
                (task) => task.risk >= 80 && task.status !== "Completed",
              ).length
            }
          />

          <StatsCard title="XP Points" value={completedTasks * 50} />
          <StatsCard title="Streak" value="5 Days" />
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-slate-800 p-6 rounded-xl mb-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">📅 Upcoming Tasks</h2>

          {tasks.filter((task) => task.status !== "Completed").length === 0 ? (
            <p className="text-gray-400">No upcoming tasks</p>
          ) : (
            <ul className="space-y-3">
              {[...tasks.filter((task) => task.status !== "Completed")]
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .slice(0, 5)
                .map((task) => (
                  <li
                    key={task.id}
                    className="flex justify-between items-center bg-slate-700 p-3 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{task.taskName}</h3>

                      <p className="text-sm text-gray-300">{task.category}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-cyan-400 font-semibold">
                        {task.deadline}
                      </p>

                      <p
                        className={`text-sm ${
                          task.priority === "High"
                            ? "text-red-400"
                            : task.priority === "Medium"
                              ? "text-yellow-400"
                              : "text-green-400"
                        }`}
                      >
                        {task.priority}
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* AI Recommendation */}
        {/* ===========================
    AI Recommendation
=========================== */}

        <div className="bg-slate-800 p-6 rounded-xl mb-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">🤖 AI Recommendation</h2>

          {highRiskTask ? (
            <div className="space-y-3">
              <p className="text-lg">
                🚨 Your highest priority task is
                <span className="font-bold text-red-400">
                  {" "}
                  {highRiskTask.taskName}
                </span>
              </p>

              <p>
                Risk Score :
                <span className="text-red-400 font-bold">
                  {" "}
                  {highRiskTask.risk}%
                </span>
              </p>

              <p>
                Deadline :
                <span className="text-cyan-400 font-semibold">
                  {" "}
                  {highRiskTask.deadline}
                </span>
              </p>
              <hr className="border-slate-600 my-4" />

              <h3 className="text-xl font-bold text-cyan-400">
                🧠 AI Decision Engine
              </h3>

              <p>
                Decision Score :
                <span className="text-yellow-400 font-bold">
                  {" "}
                  {decision?.score}
                </span>
              </p>

              <p>
                Best Notification :
                <span className="text-cyan-400 font-bold">
                  {" "}
                  {decision?.channel}
                </span>
              </p>

              <p>
                Reminder Frequency :
                <span className="text-green-400 font-bold">
                  {" "}
                  {decision?.reminder}
                </span>
              </p>

              <p>
                Escalation Level :
                <span className="text-red-400 font-bold">
                  {" "}
                  {decision?.escalation}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-green-400 text-lg">
              🎉 Great! You have no high-risk tasks.
            </p>
          )}
        </div>

        <div className="bg-slate-800 p-6 rounded-xl mb-6 shadow-lg">
          <h2 className="text-3xl font-bold mb-6">
            ⏰ Escalating Reminder Engine
          </h2>

          {reminderPlan && (
            <>
              <div className="bg-slate-700 rounded-xl p-5 mb-8 border-l-4 border-cyan-400">
                <h3 className="text-xl font-bold text-cyan-400">
                  Current Reminder Stage
                </h3>

                <p className="mt-3">
                  📢 Notification :
                  <span className="text-white font-bold">
                    {" "}
                    {reminderPlan.channel}
                  </span>
                </p>

                <p>
                  ⏱ Frequency :
                  <span className="text-green-400 font-bold">
                    {" "}
                    {reminderPlan.frequency}
                  </span>
                </p>

                <p>
                  🚨 Escalation :
                  <span className={reminderPlan.color}>
                    {" "}
                    {reminderPlan.level}
                  </span>
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">📧</div>

                  <div>
                    <h3 className="font-bold">7+ Days Left</h3>

                    <p>Email Reminder</p>
                  </div>

                  <span className="ml-auto text-green-400">✓ Completed</span>
                </div>

                <div className="ml-6 text-gray-500 text-xl">↓</div>

                <div className="flex items-center gap-4">
                  <div className="text-3xl">📱</div>

                  <div>
                    <h3 className="font-bold">3 Days Left</h3>

                    <p>Push Notification</p>
                  </div>

                  <span className="ml-auto text-green-400">✓ Completed</span>
                </div>

                <div className="ml-6 text-gray-500 text-xl">↓</div>

                <div
                  className={`flex items-center gap-4 ${
                    reminderPlan.channel.includes("Instagram")
                      ? "bg-slate-700 rounded-lg p-3"
                      : ""
                  }`}
                >
                  <div className="text-3xl">📸</div>

                  <div>
                    <h3 className="font-bold">1 Day Left</h3>

                    <p>Instagram Overlay</p>
                  </div>

                  {reminderPlan.channel.includes("Instagram") && (
                    <span className="ml-auto bg-green-500 px-3 py-1 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="ml-6 text-gray-500 text-xl">↓</div>

                <div
                  className={`flex items-center gap-4 ${
                    reminderPlan.channel.includes("WhatsApp")
                      ? "bg-slate-700 rounded-lg p-3"
                      : ""
                  }`}
                >
                  <div className="text-3xl">💬</div>

                  <div>
                    <h3 className="font-bold">6 Hours Left</h3>

                    <p>WhatsApp Reminder</p>
                  </div>

                  {reminderPlan.channel.includes("WhatsApp") && (
                    <span className="ml-auto bg-green-500 px-3 py-1 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="ml-6 text-gray-500 text-xl">↓</div>

                <div
                  className={`flex items-center gap-4 ${
                    reminderPlan.channel.includes("Full")
                      ? "bg-slate-700 rounded-lg p-3"
                      : ""
                  }`}
                >
                  <div className="text-3xl">🚨</div>

                  <div>
                    <h3 className="font-bold">1 Hour Left</h3>

                    <p>Full Screen Alert</p>
                  </div>

                  {reminderPlan.channel.includes("Full") && (
                    <span className="ml-auto bg-red-500 px-3 py-1 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ===========================
    Screen Time Analysis
=========================== */}

        <div className="bg-slate-800 p-6 rounded-xl mb-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            📱 Screen Time Analysis
          </h2>

          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <span>📸 Instagram</span>

              <input
                type="number"
                value={screenTime.Instagram}
                onChange={(e) =>
                  setScreenTime({
                    ...screenTime,
                    Instagram: Number(e.target.value),
                  })
                }
                className="bg-slate-700 rounded px-3 py-1 w-24 text-right"
              />
            </li>

            <li className="flex justify-between items-center">
              <span>🎥 YouTube</span>

              <input
                type="number"
                value={screenTime.YouTube}
                onChange={(e) =>
                  setScreenTime({
                    ...screenTime,
                    YouTube: Number(e.target.value),
                  })
                }
                className="bg-slate-700 rounded px-3 py-1 w-24 text-right"
              />
            </li>

            <li className="flex justify-between items-center">
              <span>💬 WhatsApp</span>

              <input
                type="number"
                value={screenTime.WhatsApp}
                onChange={(e) =>
                  setScreenTime({
                    ...screenTime,
                    WhatsApp: Number(e.target.value),
                  })
                }
                className="bg-slate-700 rounded px-3 py-1 w-24 text-right"
              />
            </li>
          </ul>
        </div>

        {/* ===========================
    High Risk Tasks
=========================== */}

        <div className="bg-red-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">⚠ High Risk Tasks</h2>

          {tasks.filter((task) => task.risk >= 80).length === 0 ? (
            <p className="text-green-300">No Critical Tasks 🎉</p>
          ) : (
            tasks
              .filter((task) => task.risk >= 80)
              .map((task) => (
                <div key={task.id} className="bg-red-800 rounded-lg p-4 mb-4">
                  <h3 className="text-xl font-bold">{task.taskName}</h3>

                  <p className="mt-2">
                    Risk Score :<span className="font-bold"> {task.risk}%</span>
                  </p>

                  <p>
                    Deadline :
                    <span className="text-yellow-300"> {task.deadline}</span>
                  </p>

                  <p>
                    Priority :
                    <span className="text-cyan-300"> {task.priority}</span>
                  </p>

                  <p>
                    Category :
                    <span className="text-green-300"> {task.category}</span>
                  </p>
                </div>
              ))
          )}
        </div>

        {/* Rewards Section */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg mt-6">
          <h2 className="text-2xl font-semibold mb-6">
            🏆 Rewards & Gamification
          </h2>

          {/* Level */}
          <div className="mb-4">
            <p className="text-lg">
              <strong>Level:</strong>
              <span className="text-cyan-400 font-bold"> {level}</span>
            </p>
          </div>

          {/* XP */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">XP Progress</span>

              <span className="text-yellow-400">{xp} XP</span>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-4 transition-all duration-700"
                style={{
                  width: `${Math.min(xp % 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Completed Tasks */}
          <p className="mb-3">
            <strong>Completed Tasks:</strong>

            <span className="text-green-400 font-bold"> {completedTasks}</span>
          </p>

          {/* Productivity */}
          <p className="mb-5">
            <strong>Productivity:</strong>

            <span
              className={`font-bold ${
                productivity >= 90
                  ? "text-green-400"
                  : productivity >= 70
                    ? "text-yellow-400"
                    : "text-red-400"
              }`}
            >
              {" "}
              {Math.round(productivity)}%
            </span>
          </p>

          {/* Badges */}

          <h3 className="text-lg font-semibold mb-3">🏅 Unlocked Badges</h3>

          <div className="flex gap-3 flex-wrap">
            {badges.filter((badge) => badge.unlocked).length === 0 ? (
              <span className="text-gray-400">No badges unlocked yet</span>
            ) : (
              badges
                .filter((badge) => badge.unlocked)
                .map((badge) => (
                  <span
                    key={badge.name}
                    className="bg-green-600 px-3 py-2 rounded-lg font-semibold"
                  >
                    {badge.name}
                  </span>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
