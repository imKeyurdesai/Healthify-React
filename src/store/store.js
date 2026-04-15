import { configureStore } from "@reduxjs/toolkit";
import appointmentReducer from '../features/appointmentSlice'
import userReducer from "../features/userSlice";
import doctorReducer from "../features/doctorSlice";

const store = configureStore({
  reducer: {
    appointments: appointmentReducer,
    user: userReducer,
    doctors: doctorReducer
  }
});

export default store;
