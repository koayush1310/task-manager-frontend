import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
      <div className="text-center text-white">

        <h1 className="text-4xl font-bold mb-4">
          Task Manager
        </h1>

        <p className="mb-6 text-lg">
          Organize your tasks. Stay productive. Stay focused.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-200"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="bg-transparent border border-white px-6 py-2 rounded font-semibold hover:bg-white hover:text-blue-600"
          >
            Signup
          </button>
        </div>

      </div>
    </div>
  );
}

export default Home;