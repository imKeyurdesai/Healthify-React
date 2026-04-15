import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    appointments: []
}

const normalizeAppointment = (appointment) => ({
    appointmentId: appointment?.appointmentId || appointment?._id,
    doctorId: appointment?.doctorId?._id || appointment?.doctorId,
    status: appointment?.status
});

const appointmentSlice = createSlice({
    name: "appointments",
    initialState,
    reducers: {
        loadInitialApppointments: (state, action) => {
            const appointments = action.payload;
            state.appointments = appointments.map((appointment) => normalizeAppointment(appointment));
        },
        bookAppointment: (state, action) => {
            const normalizedAppointment = normalizeAppointment(action.payload);
            const appointmentId = normalizedAppointment.appointmentId || nanoid();
            const doctorId = normalizedAppointment.doctorId;
            const status = normalizedAppointment.status;
            state.appointments.push({ appointmentId: appointmentId, doctorId: doctorId, status: status });
        },
        cancelAppointment: (state, action) => {
            const appointmentId = action.payload.appointmentId;
            state.appointments = state.appointments.filter(appointment => appointment.appointmentId !== appointmentId);
        }
    }
})

export const { bookAppointment, cancelAppointment, loadInitialApppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;
