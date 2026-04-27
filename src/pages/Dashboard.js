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

  const navigate = useNavigate();

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

  useEffect(() => {
    if (message) {
        const timer = setTimeout(() => {
            setMessage("");
        }, 3000); // 3 seconds
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

  // Logout
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-bold">Task Manager</h2>
            <p className="text-gray-500 text-sm">
              Stay organized and boost your productivity 🚀
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-3 px-3 py-2 bg-green-100 text-green-700 rounded text-sm">
            {message}
          </div>
        )}

        {/* Task Count */}
        <p className="text-sm text-gray-600 mb-4">
          {pendingCount} pending task{pendingCount !== 1 && "s"}
        </p>

        {/* Add Task */}
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 p-2 border rounded"
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
                  : "bg-gray-200"
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
            <p className="text-sm">
              Start by adding your first task 🚀
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center bg-white p-3 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task)}
                    className="w-4 h-4"
                  />

                  <span
                    className={`text-sm ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
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
  );
}

export default Dashboard;