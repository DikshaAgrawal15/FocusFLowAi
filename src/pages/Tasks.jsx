import { useState } from "react";

import { calculatePriority } from "../utils/priorityEngine";
import { calculateRisk } from "../utils/riskEngine";
import { getRiskStatus } from "../utils/riskStatus";
import { useTasks } from "../context/TaskContext";
import { generateTaskBreakdown } from "../utils/gemini";
import { calculateDecision } from "../utils/decisionEngine";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
function Tasks() {
  // ----------------------------
  // Form States
  // ----------------------------
  const { tasks, setTasks } = useTasks();
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("Assignment");
  const { theme } = useTheme();

  // ----------------------------
  // AI Breakdown
  // ----------------------------

  const [subtasks, setSubtasks] = useState([]);
  // ----------------------------
  // Edit Task
  // ----------------------------

  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // ----------------------------
  // Store Tasks
  // ----------------------------

  // ----------------------------
  // Generate AI Breakdown
  // ----------------------------
  const generateBreakdown = async () => {
    if (taskName === "") {
      toast.warning("Please enter task name first!");
      return;
    }

    try {
      const response = await generateTaskBreakdown(
        taskName,
        description,
        category,
      );

      const steps = response.split("\n").filter((step) => step.trim() !== "");

      setSubtasks(steps);
      toast.success("🤖 AI Breakdown Generated!");
    } catch (error) {
      console.error(error);

      if (error.message.includes("429")) {
        alert(
          "Gemini request limit reached. Please wait a minute and try again.",
        );
      } else {
        toast.error("Failed to generate AI breakdown.");
      }
    }
  };

  const completeTask = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          status: "Completed",
          completedAt: new Date().toISOString(),
        };
      }

      return task;
    });

    setTasks(updatedTasks);

    toast.success("🎉 Task Completed!");
  };
  // ----------------------------
  // Add Task
  // ----------------------------

  const addTask = () => {
    if (taskName === "" || description === "" || deadline === "") {
      toast.error("Please fill all fields!");
      return;
    }

    const aiPriority = calculatePriority(deadline, category, description);

    const riskScore = calculateRisk(
      aiPriority,
      deadline,
      category,
      description,
    );

    const decision = calculateDecision(aiPriority, deadline, category, 165);

    const newTask = {
      id: Date.now(),
      taskName,
      description,
      deadline,
      priority: aiPriority,
      risk: riskScore,
      decision,
      category,

      // -----------------
      // NEW FIELDS
      // -----------------

      status: "Pending",

      createdAt: new Date().toISOString(),

      completedAt: null,

      pinned: false,

      aiBreakdown: subtasks,
    };

    setTasks([...tasks, newTask]);
    toast.success("✅ Task Added Successfully!");

    // Clear Form

    setTaskName("");
    setDescription("");
    setDeadline("");
    setCategory("Assignment");
    setSubtasks([]);
  };
  // ----------------------------
  // Edit Task
  // ----------------------------

  const editTask = (task) => {
    console.log(task);
    setEditingTask({ ...task });
    setShowEditModal(true);
  };
  const saveTask = () => {
    const priority = calculatePriority(
      editingTask.deadline,
      editingTask.category,
      editingTask.description,
    );

    const risk = calculateRisk(
      priority,
      editingTask.deadline,
      editingTask.category,
      editingTask.description,
    );

    const decision = calculateDecision(
      priority,
      editingTask.deadline,
      editingTask.category,
      165,
    );

    const updatedTasks = tasks.map((task) =>
      task.id === editingTask.id
        ? {
            ...editingTask,
            priority,
            risk,
            decision,
          }
        : task,
    );

    setTasks(updatedTasks);

    setShowEditModal(false);

    toast.success("✅ Task Updated Successfully!");
  };
  const deleteTask = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmDelete) return;

    const updatedTasks = tasks.filter((task) => task.id !== id);

    setTasks(updatedTasks);

    toast.success("🗑 Task Deleted Successfully!");
  };

  const pendingTasks = tasks.filter((task) => task.status !== "Completed");

  const completedTasks = tasks.filter((task) => task.status === "Completed");

  return (
    <div
      className={`min-h-screen p-8 transition-all duration-300 ${
        theme === "dark" ? "bg-slate-950 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h1 className="text-4xl font-bold mb-8">Task Manager</h1>

      {/* ===========================
          Task Form
      =========================== */}

      <div
        className={`p-6 rounded-xl max-w-3xl transition-all duration-300 ${
          theme === "dark"
            ? "bg-slate-800 text-white"
            : "bg-white text-black shadow-lg"
        }`}
      >
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className={`w-full p-3 rounded mb-4 ${
            theme === "dark"
              ? "bg-slate-700 text-white"
              : "bg-gray-100 text-black border border-gray-300"
          }`}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full p-3 rounded mb-4 ${
            theme === "dark"
              ? "bg-slate-700 text-white"
              : "bg-gray-100 text-black border border-gray-300"
          }`}
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className={`w-full p-3 rounded mb-4 ${
            theme === "dark"
              ? "bg-slate-700 text-white"
              : "bg-gray-100 text-black border border-gray-300"
          }`}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`w-full p-3 rounded mb-6 ${
            theme === "dark"
              ? "bg-slate-700 text-white"
              : "bg-gray-100 text-black border border-gray-300"
          }`}
        >
          <option>Assignment</option>
          <option>Interview</option>
          <option>Meeting</option>
          <option>Bill Payment</option>
          <option>Personal</option>
        </select>

        <div className="flex gap-4">
          <button
            onClick={addTask}
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg font-semibold"
          >
            Add Task
          </button>

          <button
            onClick={generateBreakdown}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold"
          >
            Generate AI Breakdown
          </button>
        </div>
      </div>

      {/* ===========================
          AI Breakdown
      =========================== */}

      {subtasks.length > 0 && (
        <div
          className={`rounded-xl p-6 mt-8 ${
            theme === "dark"
              ? "bg-slate-800 text-white"
              : "bg-white text-black shadow-lg"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">🤖 AI Generated Breakdown</h2>

          <ul className="space-y-3">
            {subtasks.map((step, index) => (
              <li
                key={index}
                className={`p-3 rounded-lg ${
                  theme === "dark"
                    ? "bg-slate-700"
                    : "bg-gray-100 border border-gray-300"
                }`}
              >
                {index + 1}. {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ===========================
          Task Cards
      =========================== */}

      <div className="mt-10">
        <h2 className="text-3xl font-bold mb-6">📋 Pending Tasks</h2>

        {pendingTasks.length === 0 ? (
          <div
            className={`rounded-xl p-6 ${
              theme === "dark"
                ? "bg-slate-800 text-gray-400"
                : "bg-white text-gray-600 shadow-lg"
            }`}
          >
            🎉 No Pending Tasks
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {pendingTasks.map((task) => {
              const riskStatus = getRiskStatus(task.risk);

              return (
                <div
                  key={task.id}
                  className={`rounded-xl p-6 shadow-lg border transition-all ${
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-gray-300 text-black"
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-2">{task.taskName}</h3>

                  <p
                    className={`mb-4 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {task.description}
                  </p>

                  <div className="space-y-2">
                    <p>
                      📅 <strong>Deadline:</strong> {task.deadline}
                    </p>

                    <p>
                      🔥 <strong>Priority:</strong> {task.priority}
                    </p>

                    <p>
                      ⚠ <strong>Risk:</strong> {task.risk}%
                    </p>

                    <p className={`font-bold ${riskStatus.color}`}>
                      🚨 <strong>Status:</strong> {riskStatus.label}
                    </p>

                    <p>
                      📂 <strong>Category:</strong> {task.category}
                    </p>
                    <p>
                      📌 <strong>Status:</strong>{" "}
                      <span
                        className={
                          task.status === "Completed"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }
                      >
                        {task.status}
                      </span>
                    </p>

                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Created : {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-6 flex gap-3 flex-wrap">
                    {task.status === "Pending" && (
                      <button
                        onClick={() => completeTask(task.id)}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
                      >
                        ✔ Complete
                      </button>
                    )}

                    <button
                      onClick={() => editTask(task)}
                      className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
                    >
                      ✏ Edit
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* ===========================
    Completed Tasks
=========================== */}

      <div className="mt-14">
        <h2 className="text-3xl font-bold mb-6 text-green-400">
          ✅ Completed Tasks
        </h2>

        {completedTasks.length === 0 ? (
          <div
            className={`rounded-xl p-6 ${
              theme === "dark"
                ? "bg-slate-800 text-gray-400"
                : "bg-white text-gray-600 shadow-lg"
            }`}
          >
            No Completed Tasks Yet
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className={`rounded-xl p-6 shadow-lg border ${
                  theme === "dark"
                    ? "bg-green-900/20 border-green-500 text-white"
                    : "bg-green-50 border-green-400 text-black"
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{task.taskName}</h3>

                <p className="text-gray-300 mb-4">{task.description}</p>

                <p>
                  📅 <strong>Deadline:</strong> {task.deadline}
                </p>

                <p>
                  📂 <strong>Category:</strong> {task.category}
                </p>

                <p className="text-green-400 font-bold mt-3">✅ Completed</p>

                <p
                  className={`text-sm mt-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Completed : {new Date(task.completedAt).toLocaleDateString()}
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div
            className={`p-8 rounded-xl w-[500px] ${
              theme === "dark"
                ? "bg-slate-800 text-white"
                : "bg-white text-black"
            }`}
          >
            <h2 className="text-3xl font-bold mb-6">✏ Edit Task</h2>

            <input
              className={`w-full p-3 rounded mb-4 ${
                theme === "dark"
                  ? "bg-slate-700 text-white"
                  : "bg-gray-100 text-black border border-gray-300"
              }`}
              value={editingTask.taskName}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  taskName: e.target.value,
                })
              }
            />

            <textarea
              className={`w-full p-3 rounded mb-4 ${
                theme === "dark"
                  ? "bg-slate-700 text-white"
                  : "bg-gray-100 text-black border border-gray-300"
              }`}
              value={editingTask.description}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  description: e.target.value,
                })
              }
            />

            <input
              type="date"
              className={`w-full p-3 rounded mb-4 ${
                theme === "dark"
                  ? "bg-slate-700 text-white"
                  : "bg-gray-100 text-black border border-gray-300"
              }`}
              value={editingTask.deadline}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  deadline: e.target.value,
                })
              }
            />

            <select
              className={`w-full p-3 rounded mb-6 ${
                theme === "dark"
                  ? "bg-slate-700 text-white"
                  : "bg-gray-100 text-black border border-gray-300"
              }`}
              value={editingTask.category}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  category: e.target.value,
                })
              }
            >
              <option>Assignment</option>
              <option>Interview</option>
              <option>Meeting</option>
              <option>Bill Payment</option>
              <option>Personal</option>
            </select>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-600 px-5 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveTask}
                className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
