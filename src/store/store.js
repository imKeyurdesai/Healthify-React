import { configureStore } from "@reduxjs/toolkit";
import appointmentReducer from '../features/appointmentSlice'
import  userReducer  from "../features/userSlice";

const store = configureStore({
  reducer: {
    appointments: appointmentReducer,
    user: userReducer
  }
});

export default store;
