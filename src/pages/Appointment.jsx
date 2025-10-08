import React from "react";
import { useSelector , useDispatch } from "react-redux";
import DOCTORS from "../features/doctors.js";
import { cancelAppointment } from "../features/appointmentSlice.js";

function Appointment() {
  const appointments = useSelector((state) => state.appointments.appointments);
  const bookedAppointments = appointments.filter(
    (appointment) => appointment.booked
  );

  const dispatch = useDispatch();
  const getDoctorById = (doctorId) => {
    return DOCTORS.find((doctor) => doctor.id === doctorId);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8 text-blue-700">
        Your Appointments
      </h1>
      <section className="h-[60vh] bg-gray-300 p-3 py-5 m-4 rounded-lg overflow-auto flex flex-col gap-y-2">
        {bookedAppointments.length > 0 ? (
          bookedAppointments.map((appointment) => {
            const doctor = getDoctorById(appointment.doctorId);
            return (
              <div
                key={appointment.appointmentId}
                className="card p-4 bg-white rounded shadow-md border-l-4 border-blue-500"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={doctor?.photo}
                    alt={doctor?.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="font-bold text-lg text-gray-800">
                      {doctor?.name}
                    </h2>
                    <p className="text-blue-600 font-medium">
                      {doctor?.specialty}
                    </p>
                    <p className="text-gray-600">{doctor?.location}</p>
                    <p className="text-sm text-gray-500">
                      Languages: {doctor?.languages?.join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                      Booked
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      ID: {appointment.appointmentId}
                    </p>
                    <div className="cancelbtn">
                      <button
                      onClick={() => dispatch(cancelAppointment({appointmentId: appointment.appointmentId}))}
                      className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">{doctor?.about}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              No booked appointments found.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Book an appointment to see it here!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Appointment;
