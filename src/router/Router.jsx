import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import App from "../App";
import {
  Home,
  Appointment,
  Book_Appointment,
  Profile,
  Login,
  Signup,
  DoctorAppointment,
  Feed,
  Notifications,
} from "../pages/index";
import ProtectedRoute from "./ProtectedRoute";

function buildRoutes(role) {
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
            path: "/feed/explore",
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
            path: "/feed/explore",
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
          {
            path: "/notifications",
            element: (
              <ProtectedRoute>
                <Notifications />
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

  return createBrowserRouter(AccesibleRoutes);
}

export function AppRouter() {
  const role = useSelector((state) => state.user?.userdata?.role || "patient");
  const router = buildRoutes(role);
  return <RouterProvider router={router} />;
}
