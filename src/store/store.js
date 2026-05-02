import { configureStore } from "@reduxjs/toolkit";
import appointmentReducer from '../features/appointmentSlice'
import userReducer from "../features/userSlice";
import doctorReducer from "../features/doctorSlice";
import notificationReducer from "../features/notificationSlice";

const store = configureStore({
  reducer: {
    appointments: appointmentReducer,
    user: userReducer,
    doctors: doctorReducer,
    notifications: notificationReducer
  }
});

export default store;
