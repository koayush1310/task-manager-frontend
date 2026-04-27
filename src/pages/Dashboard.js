import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get("tasks/");
      setTasks(res.data);
    } catch {
      alert("Error fetching tasks");
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

  // Add task
  const addTask = async () => {
    if (!title.trim()) return;

    try {
      await API.post("tasks/", { title });
      setTitle("");
      fetchTasks();
    } catch {
      alert("Error adding task");
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await API.delete(`tasks/${id}/`);
      fetchTasks();
    } catch {
      alert("Error deleting task");
    }
  };

  // Toggle complete
  const toggleComplete = async (task) => {
    try {
      await API.put(`tasks/${task.id}/`, {
        ...task,
        completed: !task.completed,
      });
      fetchTasks();
    } catch {
      alert("Error updating task");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">

        {/* Navbar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Task Manager</h2>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Add Task */}
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task"
          />
          <button
            onClick={addTask}
            className="bg-green-500 text-white px-4 rounded hover:bg-green-600"
          >
            Add
          </button>
        </div>

        {/* Loading / Empty / List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks yet</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center border-b py-2"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task)}
                  />
                  <span
                    className={
                      task.completed
                        ? "line-through text-gray-400"
                        : ""
                    }
                  >
                    {task.title}
                  </span>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
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