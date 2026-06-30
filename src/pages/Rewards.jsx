import { useTasks } from "../context/TaskContext";
import { useScreenTime } from "../context/ScreenTimeContext";
import { useTheme } from "../context/ThemeContext";
function Rewards() {
  const { tasks } = useTasks();
  const { screenTime } = useScreenTime();
  const { theme } = useTheme();
  const completedTasks = tasks.filter((task) => task.status === "Completed");

  const completedCount = completedTasks.length;
  const highRisk = tasks.filter(
    (task) => task.risk >= 80 && task.status !== "Completed",
  ).length;

  const xp = completedCount * 50;
  const level = Math.floor(xp / 100) + 1;
  const nextLevelXP = level * 100;

  const progress = xp % 100;
  // ---------------------
  // Daily Streak
  // ---------------------

  const currentStreak = 5;

  const bestStreak = 12;

  const todayCompleted = completedCount > 0;

  // ---------------------
  // Productivity Rank
  // ---------------------

  const productivity =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  let rank = "Bronze";
  let nextRank = "Silver";

  if (productivity >= 90) {
    rank = "Gold";
    nextRank = "Platinum";
  } else if (productivity >= 75) {
    rank = "Silver";
    nextRank = "Gold";
  }

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
      unlocked: completedCount >= 5,
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
      className={`min-h-screen p-10 transition-all duration-300 ${
        theme === "dark" ? "bg-slate-950 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h1 className="text-5xl font-bold mb-10">🏆 Rewards & Gamification</h1>

      <div
        className={`rounded-xl p-8 shadow-lg ${
          theme === "dark" ? "bg-slate-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-3xl font-bold mb-6">XP Summary</h2>
        <p className="text-2xl mb-4">
          Current Level :
          <span className="text-cyan-400 font-bold"> {level}</span>
        </p>

        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Level Progress</span>

            <span>
              {xp} / {nextLevelXP} XP
            </span>
          </div>

          <div
            className={`w-full rounded-full h-5 overflow-hidden ${
              theme === "dark" ? "bg-slate-700" : "bg-gray-300"
            }`}
          >
            <div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-5 transition-all duration-700"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <p className="text-2xl">
          Completed Tasks :
          <span className="text-green-400 font-bold"> {completedCount}</span>
        </p>

        <p className="text-2xl mt-8">
          Total XP :<span className="text-yellow-400 font-bold"> {xp}</span>
        </p>
      </div>
      <div
        className={`rounded-xl p-8 mt-8 shadow-lg ${
          theme === "dark" ? "bg-slate-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-3xl font-bold mb-8">🏅 Achievement Badges</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className={`rounded-xl p-5 border transition-all duration-300 ${
                badge.unlocked
                  ? theme === "dark"
                    ? "bg-green-900 border-green-400 text-white"
                    : "bg-green-100 border-green-500 text-black"
                  : theme === "dark"
                    ? "bg-slate-700 border-slate-600 text-white opacity-60"
                    : "bg-gray-100 border-gray-300 text-black opacity-70"
              }`}
            >
              <h3 className="text-xl font-bold">{badge.name}</h3>

              <p className="mt-3">
                {badge.unlocked ? "✅ Unlocked" : "🔒 Locked"}
              </p>
            </div>
          ))}
        </div>
        {/* Daily Streak */}

        <div
          className={`rounded-xl p-8 mt-8 shadow-lg ${
            theme === "dark" ? "bg-slate-800 text-white" : "bg-white text-black"
          }`}
        >
          <h2 className="text-3xl font-bold mb-8">🔥 Daily Streak</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div
              className={`rounded-xl p-6 text-center ${
                theme === "dark"
                  ? "bg-slate-700"
                  : "bg-gray-100 border border-gray-300"
              }`}
            >
              <h3 className="text-xl font-semibold">Current Streak</h3>

              <p className="text-5xl font-bold text-orange-400 mt-4">
                {currentStreak}
              </p>

              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Days
              </p>
            </div>

            <div
              className={`rounded-xl p-6 text-center ${
                theme === "dark"
                  ? "bg-slate-700"
                  : "bg-gray-100 border border-gray-300"
              }`}
            >
              <h3 className="text-xl font-semibold">Best Streak</h3>

              <p className="text-5xl font-bold text-yellow-400 mt-4">
                {bestStreak}
              </p>

              <p
                className={`${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Days
              </p>
            </div>

            <div
              className={`rounded-xl p-6 text-center ${
                theme === "dark"
                  ? "bg-slate-700"
                  : "bg-gray-100 border border-gray-300"
              }`}
            >
              <h3 className="text-xl font-semibold">Today's Status</h3>

              <p
                className={`text-3xl font-bold mt-4 ${
                  todayCompleted ? "text-green-400" : "text-red-400"
                }`}
              >
                {todayCompleted ? "✅ Active" : "❌ Missed"}
              </p>
            </div>
          </div>
        </div>

        {/* Productivity Rank */}

        <div
          className={`rounded-xl p-8 mt-8 shadow-lg ${
            theme === "dark" ? "bg-slate-800 text-white" : "bg-white text-black"
          }`}
        >
          <h2 className="text-3xl font-bold mb-8">🏆 Productivity Rank</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div
              className={`rounded-xl p-6 text-center ${
                theme === "dark"
                  ? "bg-slate-700"
                  : "bg-gray-100 border border-gray-300"
              }`}
            >
              <h3 className="text-xl">Current Rank</h3>

              <p className="text-4xl mt-4 font-bold text-yellow-400">{rank}</p>
            </div>

            <div
              className={`rounded-xl p-6 text-center ${
                theme === "dark"
                  ? "bg-slate-700"
                  : "bg-gray-100 border border-gray-300"
              }`}
            >
              <h3 className="text-xl">Productivity</h3>

              <p className="text-4xl mt-4 font-bold text-green-400">
                {Math.max(0, Math.round(productivity))}%
              </p>
            </div>

            <div
              className={`rounded-xl p-6 text-center ${
                theme === "dark"
                  ? "bg-slate-700"
                  : "bg-gray-100 border border-gray-300"
              }`}
            >
              <h3 className="text-xl">Global Rank</h3>

              <p className="text-3xl mt-4 font-bold text-cyan-400">Top 10%</p>
            </div>

            <div
              className={`rounded-xl p-6 text-center ${
                theme === "dark"
                  ? "bg-slate-700"
                  : "bg-gray-100 border border-gray-300"
              }`}
            >
              <h3 className="text-xl">Next Target</h3>

              <p className="text-3xl mt-4 font-bold text-orange-400">
                {nextRank}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rewards;
