import React, { useCallback, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "./components/index";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser, clearUser } from "./features/userSlice";

function App() {
  const dispatch = useDispatch();

  const handleLogin = useCallback(async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_URL + `/profile/view`,
        {
          withCredentials: true,
        },
      );
      dispatch(setUser(res.data.body));
    } catch {
      dispatch(clearUser());
    }
  }, [dispatch]);

  useEffect(() => {
    handleLogin();
  }, [handleLogin]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
