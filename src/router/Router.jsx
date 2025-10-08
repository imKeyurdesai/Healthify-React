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
        element: <Book_Appointment />,
      },
      {
        path: "/find-doctors",
        element: <Find_Doctor />,
      },
      {
        path: "/appointments",
        element: <Appointment />,
      },
      {
        path: "/profile",
        element: <Profile />,
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
