import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    appointments: [{}]
}

const appointmentSlice = createSlice({
    name: "appointments",
    initialState,
    reducers: {
        bookAppointment: (state, action) => {
            const appointmentId = nanoid();
            const doctorId = action.payload.doctorId;
            const booked = action.payload.booked;
            state.appointments.push({ appointmentId: appointmentId, doctorId: doctorId, booked: booked });
        },
        cancelAppointment: (state, action) => {
            const appointmentId = action.payload.appointmentId;
            state.appointments = state.appointments.filter(appointment => appointment.appointmentId !== appointmentId);
        }
    }
})

export const { bookAppointment, cancelAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;
