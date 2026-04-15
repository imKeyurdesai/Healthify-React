import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../features/userSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  localStorage.setItem("role", role);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        import.meta.env.VITE_SERVER_URL + `/${role}/login`,
        {
          emailId: email,
          password: password,
        },
        {
          withCredentials: true,
        },
      );
      dispatch(setUser(res.data.body));
    } catch (error) {
      setError(
        error.response.data.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.isLoggedin) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <section className="flex flex-col items-center justify-center my-5 mx-2 p-3">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Welcome to{" "}
          <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
            Healthify
          </span>
        </h1>
        <p className="text-center text-gray-600">
          Your health journey starts here.
        </p>
      </section>
      <section className="flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          <form onSubmit={submitForm}>
            <div className="mb-4">
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="role"
              >
                Role
              </label>
              <div className="mt-1 mb-3">
                <select
                  name="role"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="p-1 h-10 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="user">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <p className="m-3 text-center text-gray-600">
                Don't have an account?{" "}
                <Link to={"/signup"} className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;
