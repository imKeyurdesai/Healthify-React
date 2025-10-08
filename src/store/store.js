import { configureStore } from "@reduxjs/toolkit";
import appointmentReducer from '../features/appointmentSlice'

const store = configureStore({
  reducer: {
    appointments: appointmentReducer
  }
});

export default store;
