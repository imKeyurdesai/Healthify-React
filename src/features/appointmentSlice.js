import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    appointments: []
}

const normalizeAppointment = (appointment) => ({
    appointmentId: appointment?._id,
    doctorId: appointment?.doctorId?._id || appointment?.doctorId,
    status: appointment?.status,
    appointedTime: appointment?.appointmentTime,
    doctor: appointment?.doctor || null,
    patient: appointment?.patient || null,
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
            const appointmentId = normalizedAppointment.appointmentId;
            const doctorId = normalizedAppointment.doctorId;
            const status = normalizedAppointment.status;
            state.appointments.push({ appointmentId: appointmentId, doctorId: doctorId, status: status, doctor: normalizedAppointment.doctor, patient: normalizedAppointment.patient });
        },
        cancelAppointment: (state, action) => {
            const appointmentId = action.payload;
            state.appointments = state.appointments.map((appointment) => {
                if (appointment.appointmentId === appointmentId) {
                    return { ...appointment, status: "cancelled" };
                }
                return appointment;
            });

        }
    }
})

export const { bookAppointment, cancelAppointment, loadInitialApppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;
