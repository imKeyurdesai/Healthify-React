import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {Navbar , Footer} from './components/index'
import { useSelector , useDispatch } from 'react-redux'
import axios from 'axios'
import { setUser } from "../src/features/userSlice";

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate() 

  const handleLogin = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/profile/view",
        {
          withCredentials: true
        }
      );
      dispatch(setUser(res.data.body));
      navigate('/')

    } catch (error) {
      console.log(error);
      navigate('/login')
    }
  }

  useEffect(() => {
    handleLogin()
  }, [])
  
  return (
    <>
        <Navbar />
        <Outlet />
        <Footer />
    </>
  )
}

export default App
