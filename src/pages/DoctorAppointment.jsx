import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

const resolveAppointmentId = (appointment) => {
  return appointment?._id || appointment?.appointmentId || "";
};

const resolveUser = (appointment) => {
  const rawUser = appointment?.patientId;
  if (!rawUser) {
    return { firstName: "Patient", lastName: "", emailId: "", profileUrl: "" };
  }

  if (typeof rawUser === "string") {
    return {
      firstName: "Patient",
      lastName: "",
      emailId: "",
      profileUrl: "",
      _id: rawUser,
    };
  }

  return {
    _id: rawUser?._id || "",
    firstName: rawUser?.firstName || "Patient",
    lastName: rawUser?.lastName || "",
    emailId: rawUser?.emailId || rawUser?.email || "",
    profileUrl: rawUser?.profileUrl || "",
  };
};

const resolveScheduledTime = (appointment) => {
  return (
    appointment?.scheduledTime ||
    appointment?.time ||
    appointment?.appointmentTime ||
    null
  );
};

const toDateTimeLocalValue = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  const offset = parsed.getTimezoneOffset() * 60000;
  return new Date(parsed.getTime() - offset).toISOString().slice(0, 16);
};

function DoctorAppointment() {
  const [appointments, setAppointments] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [reviewForm, setReviewForm] = useState({});
  const [actionLoading, setActionLoading] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/doctor/appointment/view",
        {
          withCredentials: true,
        },
      );

      const incomingAppointments = Array.isArray(res?.data?.body)
        ? res.data.body
        : [];
      setAppointments(incomingAppointments);
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message ||
          "Unable to load doctor appointments.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const normalizedAppointments = useMemo(() => {
    return appointments.map((appointment) => {
      const appointmentId = appointment._id;

      return {
        appointmentId,
        status: appointment?.status || "pending",
        scheduledTime: resolveScheduledTime(appointment),
      };
    });
  }, [appointments]);

  const updateOneAppointment = (appointmentId, patch) => {
    setAppointments((prev) =>
      prev.map((appointment) => {
        const currentId = resolveAppointmentId(appointment);
        if (currentId !== appointmentId) {
          return appointment;
        }
        return { ...appointment, ...patch };
      }),
    );
  };

  const withActionLoading = (appointmentId, value) => {
    setActionLoading((prev) => ({ ...prev, [appointmentId]: value }));
  };

  const handleReviewSubmit = async (appointmentId) => {
    const currentReview = reviewForm[appointmentId] || {};
    const status = currentReview?.status || "reviewed";
    // const appointedTime

    withActionLoading(appointmentId, true);
    setError("");

    try {
      const payload = {
        status,
        // appointedTime
      };

      await axios.patch(
        import.meta.env.VITE_SERVER_URL +
          `/doctor/appointment/review/${appointmentId}`,
        payload,
        { withCredentials: true },
      );

      updateOneAppointment(appointmentId, {
        status,
        review: note,
        doctorReview: note,
      });
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message ||
          "Unable to save appointment review.",
      );
    } finally {
      withActionLoading(appointmentId, false);
    }
  };

  const handleReschedule = async (appointmentId) => {
    const dateTimeValue = selectedSlots[appointmentId]?.dateTime;
    const selectedDate = new Date(dateTimeValue);
    const scheduledTime = selectedDate.getTime();

    if (!dateTimeValue || Number.isNaN(scheduledTime)) {
      setError("Please pick a valid reschedule date and time.");
      return;
    }

    withActionLoading(appointmentId, true);
    setError("");

    try {
      await axios.patch(
        import.meta.env.VITE_SERVER_URL +
          `/doctor/appointment/reschedule/${appointmentId}`,
        { scheduledTime },
        { withCredentials: true },
      );

      updateOneAppointment(appointmentId, { scheduledTime });
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message ||
          "Unable to reschedule appointment.",
      );
    } finally {
      withActionLoading(appointmentId, false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8 text-blue-700">
        Doctor Appointments
      </h1>

      {error ? (
        <div className="mx-4 mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="h-[70vh] bg-gray-300 p-3 py-5 m-4 rounded-lg overflow-auto flex flex-col gap-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-600">
            Loading appointments...
          </div>
        ) : normalizedAppointments.length > 0 ? (
          normalizedAppointments.map((appointment) => {
            const fullName = [
              appointment.user.firstName,
              appointment.user.lastName,
            ]
              .filter(Boolean)
              .join(" ")
              .trim();
            const displayName = fullName || "Patient";
            const displayTime = appointment.scheduledTime
              ? new Date(appointment.scheduledTime).toLocaleString()
              : "Not scheduled";
            const avatar =
              appointment.user.profileUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=e0f2fe&color=075985&size=256`;
            const isSubmitting = Boolean(
              actionLoading[appointment.appointmentId],
            );

            return (
              <article
                key={appointment.appointmentId}
                className="card p-4 bg-white rounded shadow-md border-l-4 border-blue-500"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                  <img
                    src={avatar}
                    alt={displayName}
                    className="w-16 h-16 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <h2 className="font-bold text-lg text-gray-800">
                      {displayName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {appointment.user.emailId || "Email not provided"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-semibold text-gray-700">
                        Scheduled:
                      </span>{" "}
                      {displayTime}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full capitalize">
                      {appointment.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      ID: {appointment.appointmentId}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-3 justify-start">
                  <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                    <p className="text-sm font-semibold text-blue-900">
                      Review/Reschedule Appointment
                    </p>
                    <div className="mt-2 space-y-2">
                      <input
                        type="datetime-local"
                        min={new Date(Date.now() + 1000 * 60 * 30)
                          .toISOString()
                          .slice(0, 16)}
                        value={
                          selectedSlots[appointment.appointmentId]?.dateTime ||
                          toDateTimeLocalValue(appointment.scheduledTime)
                        }
                        onChange={(e) =>
                          setSelectedSlots((prev) => ({
                            ...prev,
                            [appointment.appointmentId]: {
                              dateTime: e.target.value,
                            },
                          }))
                        }
                        className="w-full rounded border border-amber-200 px-2 py-1.5 text-sm"
                      />
                      <button
                        type="button"
                        // onClick={() => handleReviewSubmit(appointment.appointmentId)}
                        className="rounded bg-green-600 px-4 py-2 mx-3 text-sm font-medium text-white hover:bg-green-700"
                      >
                        Accept
                      </button>

                      <button
                        type="button"
                        // onClick={() => handleReviewSubmit(appointment.appointmentId)}
                        className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              No appointments assigned yet.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              New bookings for your profile will be listed here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default DoctorAppointment;
