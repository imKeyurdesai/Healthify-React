import React, { useState, useMemo } from "react";
import DOCTORS from "../features/doctors";

const PAGE_SIZE = 5;

function Find_Doctor() {
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");

  const filteredDoctors = useMemo(() => {
    const q = query.toLowerCase().trim();
    return DOCTORS.filter((doctor) =>
      [doctor.name, doctor.specialty, doctor.location, doctor.gender]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [query]);

  const pageCount = Math.ceil(filteredDoctors.length / PAGE_SIZE);
  const currentDoctors = filteredDoctors.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  const handlePrev = () => setPage((p) => Math.max(p - 1, 0));
  const handleNext = () =>
    setPage((p) => Math.min(p + 1, pageCount - 1));

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8 text-blue-700">
        Find a Doctor
      </h1>

      <section className="flex mb-8 p-4 items-center justify-end">
        <label htmlFor="search" className="mr-2">Search:</label>
        <input
          id="search"
          type="search"
          placeholder="name, specialty, location, gender"
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-1/2 md:w-1/4"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
        />
      </section>

      <section className="my-10 p-6 bg-neutral-100 rounded-xl shadow">
        {currentDoctors.length === 0 ? (
          <p className="text-center text-gray-500">No doctors found.</p>
        ) : (
          currentDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white shadow-md rounded-lg p-6 mb-6 flex items-center space-x-6"
            >
              <img
                src={doctor.photo}
                alt={doctor.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-blue-300"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-blue-800">
                  {doctor.name}
                </h2>
                <p className="text-sm text-gray-600">{doctor.specialty}</p>
                <p className="text-sm text-gray-600">{doctor.location}</p>
                <p className="text-sm text-gray-600">{doctor.gender}</p>
              </div>
            </div>
          ))
        )}
      </section>

      <div className="flex justify-center my-6">
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mr-4"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={page >= pageCount - 1}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Find_Doctor;
