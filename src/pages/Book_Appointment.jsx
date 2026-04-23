import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setDoctors } from "../features/doctorSlice.js";
import { bookAppointment as bookAppointmentAction } from "../features/appointmentSlice.js";
import { loadInitialApppointments } from "../features/appointmentSlice.js";

function Book_Appointment() {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    skill: "",
    language: "",
    location: "",
  });
  const [selectedSlots, setSelectedSlots] = useState({});

  const doctors = useSelector((state) => state.doctors?.doctors ?? []);
  const appointments = useSelector(
    (state) => state.appointments?.appointments ?? [],
  );
  const role = localStorage.getItem("role") || "user";

  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  const toggleDateTimePicker = (doctorId) => {
    setShowDateTimePicker((prev) => (prev === doctorId ? false : doctorId));
  };

  const handleSetTime = (doctorId) => {
    const selectedDateTime = new Date(selectedSlots[doctorId]?.dateTime);

    const scheduledTime = selectedDateTime?.getTime();

    if (Number.isNaN(scheduledTime)) {
      return;
    }

    handleBookAppointment(doctorId, scheduledTime);
  };

  const handleBookAppointment = async (doctorId, scheduledTime) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_SERVER_URL + "/user/appointment/create",
        { doctorId, scheduledTime },
        { withCredentials: true },
      );
      dispatch(
        bookAppointmentAction({
          appointmentId: res.data.body._id,
          doctorId: res.data.body.doctorId,
          status: res.data.body.status,
        }),
      );
      setShowDateTimePicker(false);
    } catch (error) {
      console.error("Failed to book appointment:", error.message);
    }
  };

  const getDoctors = useCallback(async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/getAllDoctors",
        {
          withCredentials: true,
        },
      );
      dispatch(setDoctors(res.data.body));
    } catch (error) {
      console.log(error.message);
    }
  }, [dispatch]);

  const handleAppointments = useCallback(async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_URL + `/${role}/appointment/view`,
        {
          withCredentials: true,
        },
      );

      const appointments = res.data.body;
      dispatch(loadInitialApppointments(appointments));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, role]);

  useEffect(() => {
    getDoctors();
    handleAppointments();
  }, [getDoctors, handleAppointments]);

  const formatList = (value) => {
    if (Array.isArray(value)) {
      return value.length ? value.join(", ") : "Not specified";
    }
    return value || "Not specified";
  };

  const toArray = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value.trim()) return [value.trim()];
    return [];
  };

  const filterOptions = useMemo(() => {
    const skillSet = new Set();
    const languageSet = new Set();
    const locationSet = new Set();

    doctors.forEach((doctor) => {
      toArray(doctor?.skills).forEach((skill) => skillSet.add(skill));
      toArray(doctor?.languages || doctor?.language).forEach((language) =>
        languageSet.add(language),
      );
      if (doctor?.location) {
        locationSet.add(doctor.location);
      }
    });

    return {
      skills: [...skillSet].sort((a, b) => a.localeCompare(b)),
      languages: [...languageSet].sort((a, b) => a.localeCompare(b)),
      locations: [...locationSet].sort((a, b) => a.localeCompare(b)),
    };
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const doctorSkills = toArray(doctor?.skills).map((item) =>
        item.toLowerCase(),
      );
      const doctorLanguages = toArray(doctor?.languages).map((item) =>
        item.toLowerCase(),
      );
      const doctorLocation = (doctor?.location || "").toLowerCase();

      const skillMatch =
        !filters.skill || doctorSkills.includes(filters.skill.toLowerCase());
      const languageMatch =
        !filters.language ||
        doctorLanguages.includes(filters.language.toLowerCase());
      const locationMatch =
        !filters.location || doctorLocation === filters.location.toLowerCase();

      return skillMatch && languageMatch && locationMatch;
    });
  }, [doctors, filters]);

  const bookedDoctorIds = useMemo(() => {
    return new Set(
      appointments
        .filter(
          (appointment) =>
            appointment?.doctorId &&
            appointment?.status &&
            String(appointment.status).toLowerCase() === "pending",
        )
        .map((appointment) => appointment.doctorId),
    );
  }, [appointments]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      skill: "",
      language: "",
      location: "",
    });
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-sky-50 via-white to-cyan-100 py-10">
      <div className="pointer-events-none absolute -left-24 top-6 h-64 w-64 rounded-full bg-sky-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-6 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-sky-100 backdrop-blur-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Book an Appointment
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Filter doctors by specialty, language, and city.
              </p>
            </div>

            <div className="text-sm font-medium text-sky-700">
              {filteredDoctors.length} result
              {filteredDoctors.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <select
              name="skill"
              id="skill"
              value={filters.skill}
              onChange={(e) => handleFilterChange("skill", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            >
              <option value="">All Specialties</option>
              {filterOptions.skills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>

            <select
              name="language"
              id="language"
              value={filters.language}
              onChange={(e) => handleFilterChange("language", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            >
              <option value="">All Languages</option>
              {filterOptions.languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>

            <select
              name="location"
              id="location"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            >
              <option value="">All Locations</option>
              {filterOptions.locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Reset Filters
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <article
              key={doctor?._id}
              className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-sky-200"
            >
              <div className="flex items-start gap-4">
                <img
                  src={
                    doctor?.profileUrl ||
                    "https://ui-avatars.com/api/?name=Doctor&background=e0f2fe&color=075985&size=256"
                  }
                  alt={doctor?.firstName || "Doctor"}
                  className="h-20 w-20 shrink-0 rounded-full border-2 border-sky-200 object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-bold text-slate-900">
                    Dr. {doctor?.firstName || ""} {doctor?.lastName || ""}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatList(doctor?.skills)}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-800">
                    Location:
                  </span>{" "}
                  {doctor?.location || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">
                    Languages:
                  </span>{" "}
                  {formatList(doctor?.languages || doctor?.language)}
                </p>
                <p className="rounded-lg bg-slate-50 p-3 text-slate-700">
                  {doctor?.about || "About details will be updated soon."}
                </p>
              </div>

              <button
                onClick={() => toggleDateTimePicker(doctor._id)}
                disabled={bookedDoctorIds.has(doctor?._id)}
                className="mt-5 w-full rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {bookedDoctorIds.has(doctor?._id)
                  ? "Already Booked"
                  : "Book Appointment"}
              </button>
              {showDateTimePicker === doctor?._id && (
                <div className="mt-4 rounded-lg border border-sky-100 bg-sky-50/60 p-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`dateTime-${doctor?._id}`}>
                        Select DateTime
                      </label>
                      <input
                        type="datetime-local"
                        id={`dateTime-${doctor?._id}`}
                        name={`dateTime-${doctor?._id}`}
                        min={new Date(Date.now() + 1000 * 60 * 60 * 24)
                          .toISOString()
                          .slice(0, 16)}
                        onChange={(e) => {
                          setSelectedSlots((prev) => ({
                            ...prev,
                            [doctor?._id]: {
                              ...prev[doctor?._id],
                              dateTime: e.target.value,
                            },
                          }));
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSetTime(doctor?._id)}
                    disabled={!selectedSlots[doctor?._id]?.dateTime}
                    className="mt-3 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    Confirm Date & Time
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="rounded-2xl border border-dashed border-sky-300 bg-white/70 p-8 text-center text-slate-600">
            No doctors match your selected filters.
          </div>
        )}
      </div>
    </section>
  );
}

export default Book_Appointment;
