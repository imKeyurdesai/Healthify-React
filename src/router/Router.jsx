import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import {
  Home,
  Appointment,
  Book_Appointment,
  Profile,
  // Find_Doctor,
  Login,
  Signup,
  DoctorAppointment,
  Feed
} from "../pages/index";
import ProtectedRoute from "./ProtectedRoute";

const role = localStorage.getItem("role") || "user";
const AccesibleRoutes = [];

if (role === "doctor") {
  AccesibleRoutes.push(
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "/feed",
          element: (
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          ),
        },
        {
          path: "/appointments",
          element: (
            <ProtectedRoute>
              <DoctorAppointment />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  );
} else {
  AccesibleRoutes.push(
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "/book-appointment",
          element: (
            <ProtectedRoute>
              <Book_Appointment />
            </ProtectedRoute>
          ),
        },
        {
          path: "/feed",
          element: (
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          ),
        },
        {
          path: "/appointments",
          element: (
            <ProtectedRoute>
              <Appointment />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  );
}

const Router = createBrowserRouter(AccesibleRoutes);

export default Router;
