import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { setUser } from "../features/userSlice";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector( state => state.user);

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        import.meta.env.VITE_SERVER_URL + "/signup",
        {
          firstName: username,
          emailId: email,
          password: password,
        },
        {
          withCredentials: true,
        },
      );
      dispatch(setUser(res.data.body))
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Signup failed.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      if (user.isLoggedin) {
        navigate("/profile");
      }
    }, [user,navigate]);

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
          <h1 className="text-2xl font-bold mb-6 text-center">Signup</h1>
          <form onSubmit={submitForm}>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Firstname
              </label>
              <input
                type="text"
                autoComplete="username"
                name="firstname"
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your firstname"
                required
                className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            {error && (
              <div className="mb-3 px-2 py-1 rounded-xl bg-gray-200">
                <section className="font-medium text-red-400">{error}</section>
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />

                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 font-semibold"
            >
              Login here
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Signup;
