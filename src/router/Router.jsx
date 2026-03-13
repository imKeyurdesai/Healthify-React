import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import {
  Home,
  Appointment,
  Book_Appointment,
  Profile,
  Find_Doctor,
  Login,
  Signup,
} from "../pages/index";
import ProtectedRoute from "./ProtectedRoute";

const Router = createBrowserRouter([
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
        element: 
        <ProtectedRoute>
          <Book_Appointment />
        </ProtectedRoute>,
      },
      {
        path: "/find-doctors",
        element: 
        <ProtectedRoute>
          <Find_Doctor />
        </ProtectedRoute>,
      },
      {
        path: "/appointments",
        element: 
        <ProtectedRoute>
          <Appointment />
        </ProtectedRoute>,
      },
      {
        path: "/profile",
        element: 
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>,
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
]);

export default Router;
