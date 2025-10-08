import { useState, useEffect } from "react";
import DOCTORS from "../features/doctors.js";
import { useDispatch , useSelector} from "react-redux";
import { bookAppointment } from "../features/appointmentSlice.js";

function Book_Appointment() {
  const dispatch = useDispatch();
  const appointments = useSelector(state => state.appointments.appointments)
  const languages = [...new Set(DOCTORS.flatMap((e) => e.languages))];
  const specialty = [...new Set(DOCTORS.map((e) => e.specialty))];
  const location = [...new Set(DOCTORS.map((e) => e.location))];
  const [filtered, setFiltered] = useState(DOCTORS);
  const [filters, setFilters] = useState({
    specialty: "",
    location: "",
    language: "",
  });
  
  
  const handleBook = (id) => {
    dispatch(bookAppointment({doctorId: id, booked: true}));
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  useEffect(() => {
    let filteredData = DOCTORS.filter((doc) => {
      const matchSpecialty = filters.specialty
        ? doc.specialty === filters.specialty
        : true;
      const matchLocation = filters.location
        ? doc.location === filters.location
        : true;
      const matchLanguage = filters.language
        ? doc.languages.includes(filters.language)
        : true;
      return matchSpecialty && matchLocation && matchLanguage;
    });
    setFiltered(filteredData);
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8 text-blue-700">
        Book an Appointment
      </h1>
      <section className="sort-doctors flex flex-wrap justify-center gap-4 mb-8">
        <select
          name="specialty"
          id="specialty"
          value={filters.specialty}
          onChange={(e) => handleFilterChange("specialty", e.target.value)}
          className="border border-gray-300 rounded-md p-2 m-2 cursor-pointer shadow-sm focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Specialty</option>
          {specialty.map((ele) => (
            <option key={ele} value={ele}>
              {ele}
            </option>
          ))}
        </select>
        <select
          name="location"
          id="location"
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="border border-gray-300 rounded-md p-2 m-2 cursor-pointer shadow-sm focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Location</option>
          {location.map((ele) => (
            <option key={ele} value={ele}>
              {ele}
            </option>
          ))}
        </select>
        <select
          name="language"
          id="language"
          value={filters.language}
          onChange={(e) => handleFilterChange("language", e.target.value)}
          className="border border-gray-300 rounded-md p-2 m-2 cursor-pointer shadow-sm focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Language</option>
          {languages.map((ele) => (
            <option key={ele} value={ele}>
              {ele}
            </option>
          ))}
        </select>
      </section>
      <section className="my-10 p-6 bg-neutral-100 rounded-xl shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filtered.length === 0 && (
            <div className="col-span-3 text-center text-gray-500">
              No doctors found.
            </div>
          )}
          {filtered.map((doctor, i) => (
            <div
              key={doctor.id || i}
              className="rounded-2xl max-h-100 w-full border p-4 flex flex-col items-center bg-gray-50 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">
                <img
                  src={doctor.photo}
                  alt={doctor.name || "Doctor"}
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-300"
                />
              </div>
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-blue-800 md:text-2xl">
                  {doctor.name || "Doctor"}
                </h2>
                <h2 className="text-sm text-gray-600 md:text-lg">
                  <span className="font-bold">Speciality :</span>{" "}
                  {doctor.specialty || "Specialty"}
                </h2>
                <h2 className="text-sm text-gray-600 md:text-lg">
                  <span className="font-bold">Location :</span>{" "}
                  {doctor.location || "Location"}
                </h2>
                <h2 className="text-sm text-gray-600 md:text-lg">
                  <span className="font-bold">Languages :</span>{" "}
                  {doctor.languages.join(", ") || "Languages"}
                </h2>
              </div>
              <button
                onClick={() => handleBook(doctor.id)}
                className="w-30 bg-blue-600 text-white px-4 py-2 rounded-lg hover:scale-110 duration-200 transition-all cursor-pointer"
                disabled={appointments.some(appointment => appointment.doctorId === doctor.id && appointment.booked)}
              >
                {appointments.some(appointment => appointment.doctorId === doctor.id && appointment.booked) ? "Booked" : "Book Now"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Book_Appointment;
