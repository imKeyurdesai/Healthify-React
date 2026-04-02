import React, { useState, useEffect } from "react";
import { Logo, Profile, Button } from "./index";
import { List } from "../assets/index";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { clearUser } from "../features/userSlice";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const isLoggedin = useSelector(state => state.user.isLoggedin) || false;

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_SERVER_URL + "/logout",
        {},
        {
          withCredentials: true,
        }
      )
      console.log(res.data?.message || 'logout')
      dispatch(clearUser())
      navigate('/login')
    } catch (error) {
      console.error(error);
    }
}
  return (
    <nav>
      <div className="w-full p-3 h-20 bg-blue-500 flex items-center">
        <div className="nav-logo-container flex items-center w-auto sm:w-1/6 md:w-1/6 lg:w-1/4">
          <NavLink to="/">
            <Logo props="w-8 h-8 sm:w-10 sm:h-10 md:w-10 lg:w-12 md:h-10 lg:h-12" />
          </NavLink>
        </div>

        <div className="nav-list-container hidden md:flex md:w-1/2">
          <ul className="flex w-full gap-x-2 lg:gap-x-5 text-sm lg:text-lg text-white items-center justify-evenly p-3 px-5">
            <NavLink
              to="/book-appointment"
              className={({ isActive }) =>
                `cursor-pointer hover:text-neutral-300 whitespace-nowrap transition-colors ${
                  isActive ? "text-yellow-300 " : ""
                }`
              }
            >
              Book an Appointment
            </NavLink>

            <NavLink
              to="/find-doctors"
              className={({ isActive }) =>
                `cursor-pointer hover:text-neutral-300 transition-colors ${
                  isActive ? "text-yellow-300 " : ""
                }`
              }
            >
              Find Doctors
            </NavLink>
            <NavLink
              to="/appointments"
              className={({ isActive }) =>
                `cursor-pointer hover:text-neutral-300 transition-colors ${
                  isActive ? "text-yellow-300 " : ""
                }`
              }
            >
              Appointments
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `cursor-pointer hover:text-neutral-300 transition-colors ${
                  isActive ? "text-yellow-300 " : ""
                }`
              }
            >
              Profile
            </NavLink>
          </ul>
        </div>

        <div className="nav-profile-container flex-1 md:w-1/4 flex items-center justify-end md:justify-center">
          {isLoggedin ? (
            <Button
              label="Log out"
              className="text-red-400  text-xs sm:text-sm md:text-base px-2 py-1 md:px-4 md:py-2"
              onClick={() => handleLogout()}
            />
          ) : (
            <Button
              label="Login / Signup"
              className="text-xs sm:text-sm md:text-base px-2 py-1 md:px-4 md:py-2"
              onClick={() => {
                navigate("/login");
              }}
            />
          )}
        </div>

        <div className="md:hidden ml-3">
          <button
            className="text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <List props="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-600 border-t border-blue-400 transition-all duration-200">
          <ul className="flex flex-col text-white">
            <li className="cursor-pointer hover:bg-blue-700 px-4 py-3 border-b border-blue-500 transition-colors">
              <NavLink
                to="/book-appointment"
                className={({ isActive }) =>
                  `${isActive ? "text-yellow-300 " : ""}`
                }
              >
                Book an Appointment
              </NavLink>
            </li>
            <li className="cursor-pointer hover:bg-blue-700 px-4 py-3 border-b border-blue-500 transition-colors">
              <NavLink
                to="/find-doctors"
                className={({ isActive }) =>
                  `${isActive ? "text-yellow-300 " : ""}`
                }
              >
                Find Doctors
              </NavLink>
            </li>
            <li className="cursor-pointer hover:bg-blue-700 px-4 py-3 border-b border-blue-500 transition-colors">
              <NavLink
                to="/appointments"
                className={({ isActive }) =>
                  `${isActive ? "text-yellow-300 " : ""}`
                }
              >
                Appointments
              </NavLink>
            </li>
            <li className="cursor-pointer hover:bg-blue-700 px-4 py-3 transition-colors">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${isActive ? "text-yellow-300 " : ""}`
                }
              >
                Profile
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
