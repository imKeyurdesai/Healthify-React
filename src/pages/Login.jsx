import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div>
        <section className="flex flex-col items-center justify-center my-5 mx-2 p-3">
        <h1 className="text-4xl font-bold mb-8 text-center">Welcome to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">Healthify</span></h1>
        <p className="text-center text-gray-600">Your health journey starts here.</p>
        </section>
        <section  className="flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="username"
            >
              Username
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                required
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
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
            <p className="m-3 text-center text-gray-600">Don't have an account? <Link to={"/signup"} className="text-blue-600 hover:underline">Sign up</Link></p>
          </div>
        </form>
      </div>
      </section>
    </div>
  );
}

export default Login;
