import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "./components/index";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser, setAuthChecked } from "./features/userSlice";

function App() {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role") || "user";

  const handleLogin = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_URL + `/${role}/profile/view`,
        {
          withCredentials: true,
        },
      );
      dispatch(setUser(res.data.body));
    } catch (error) {
      console.log(error);
      dispatch(setAuthChecked());
    }
  };

  useEffect(() => {
    handleLogin();
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
