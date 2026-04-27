import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [adding, setAdding] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  // Load dark mode from storage
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") setDarkMode(true);
  }, []);

  // Save dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get("tasks/");
      setTasks(res.data);
    } catch {
      setMessage("Error fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      fetchTasks();
    }
  }, [navigate]);

  // Auto hide message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Add task
  const addTask = async () => {
    if (!title.trim()) return;

    try {
      setAdding(true);
      await API.post("tasks/", { title });
      setTitle("");
      setMessage("Task added successfully");
      fetchTasks();
    } catch {
      setMessage("Error adding task");
    } finally {
      setAdding(false);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await API.delete(`tasks/${id}/`);
      setMessage("Task deleted");
      fetchTasks();
    } catch {
      setMessage("Error deleting task");
    }
  };

  // Toggle complete
  const toggleComplete = async (task) => {
    try {
      await API.put(`tasks/${task.id}/`, {
        ...task,
        completed: !task.completed,
      });
      setMessage("Task updated");
      fetchTasks();
    } catch {
      setMessage("Error updating task");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Filter logic
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 transition">

        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-3xl font-bold dark:text-white">
                Task Manager
              </h2>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                Stay organized and boost your productivity 🚀
              </p>
            </div>

            <div className="flex gap-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-3 py-2 rounded bg-gray-800 text-white dark:bg-gray-200 dark:text-black"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>

              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="mb-3 px-3 py-2 bg-green-100 text-green-700 rounded text-sm">
              {message}
            </div>
          )}

          {/* Task Count */}
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {pendingCount} pending task{pendingCount !== 1 && "s"}
          </p>

          {/* Add Task */}
          <div className="flex gap-2 mb-4">
            <input
              className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTask();
              }}
              placeholder="Enter task..."
            />

            <button
              onClick={addTask}
              disabled={!title.trim() || adding}
              className={`px-4 rounded text-white ${
                title.trim()
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {adding ? "Adding..." : "Add"}
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            {["all", "pending", "completed"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1 rounded ${
                  filter === type
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center text-gray-400 mt-6">
              <p className="text-lg">No tasks yet</p>
              <p className="text-sm">Start by adding your first task 🚀</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex justify-between items-center bg-white dark:bg-gray-700 p-3 rounded-lg shadow hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task)}
                    />

                    <span
                      className={`text-sm ${
                        task.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800 dark:text-white"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;