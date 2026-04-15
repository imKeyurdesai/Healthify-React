import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/userSlice";
import { useNavigate } from "react-router-dom";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userdata = useSelector((state) => state.user.userdata) || {};
  const userRole = userdata.role || "user";
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [conformDoctorPopup, setConformDoctorPopup] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    profileUrl: "",
    skills: "",
    location: "",
    languages: "",
    about: "",
  });

  const firstName = userdata.firstName?.trim() || "User";
  const email = userdata.emailId?.trim() || "Not available";
  const age = userdata.age || "Not specified";
  const gender = userdata.gender || "Not specified";
  const about = userdata.about?.trim() || "Not specified";
  const photoUrl =
    userdata.profileUrl?.trim() ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=2563eb&color=fff&size=256`;

  const fullName =
    [userdata.firstName, userdata.lastName].filter(Boolean).join(" ").trim() ||
    firstName;

  const openEditor = () => {
    setError("");
    setFormData({
      firstName: userdata.firstName || "",
      lastName: userdata.lastName || "",
      age: userdata.age || "",
      gender: userdata.gender || "",
      profileUrl: userdata.profileUrl || "",
      skills: Array.isArray(userdata.skills)
        ? userdata.skills.join(", ")
        : userdata.skills || "",
      location: userdata.location || "",
      languages: Array.isArray(userdata.languages)
        ? userdata.languages.join(", ")
        : userdata.languages || "",
      about: userdata.about || "",
    });
    setIsEditing(true);
  };

  const closeEditor = () => {
    setError("");
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    const payload = {};

    if (formData.firstName.trim() !== "") {
      payload.firstName = formData.firstName.trim();
    }

    if (formData.profileUrl.trim() !== "") {
      payload.profileUrl = formData.profileUrl.trim();
    }

    if (formData.lastName.trim() !== "") {
      payload.lastName = formData.lastName.trim();
    }

    if (formData.gender.trim() !== "") {
      payload.gender = formData.gender.trim();
    }

    if (formData.age !== "") {
      payload.age = Number(formData.age);
    }

    if (userRole === "doctor") {
      if (formData.skills) {
        payload.skills = formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
      }
      if (formData.location) {
        payload.location = formData.location.trim();
      }
      if (formData.languages) {
        payload.languages = formData.languages
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
      if (formData.about.trim() !== "") {
        payload.about = formData.about.trim();
      }
    }

    try {
      const res = await axios.patch(
        import.meta.env.VITE_SERVER_URL + `/${userRole}/profile/update`,
        payload,
        { withCredentials: true },
      );

      const updatedUser = res.data?.body || { ...userdata, ...payload };
      dispatch(setUser(updatedUser));
      setIsEditing(false);
    } catch (apiError) {
      setError(
        apiError?.response?.data?.message || "Failed to update profile.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyDoctor = async () => {
   try {
    await axios.post(
      import.meta.env.VITE_SERVER_URL + `/doctor/register`,
      {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      },
      { withCredentials: true },
    );
    navigate("/login");
   } catch (error) {
    setError(
      error?.response?.data?.message || "Failed to apply for doctor role.",
    );
   }
    
  };

  const Patient_infoCards = [
    {
      label: "First Name",
      value: firstName,
    },
    {
      label: "Email Address",
      value: email,
    },
    {
      label: "role",
      value: userdata.role || "Not specified",
    },
    {
      label: "Gender",
      value: gender,
    },
    {
      label: "Age",
      value: age,
    },
  ];

  const Doctor_infoCards = [
    {
      label: "First Name",
      value: firstName,
    },
    {
      label: "Email Address",
      value: email,
    },
    {
      label: "role",
      value: userdata.role || "Doctor",
    },
    {
      label: "Specialty",
      value: Array.isArray(userdata.skills)
        ? userdata.skills.join(", ")
        : userdata.skills || "Not specified",
    },
    {
      label: "Gender",
      value: gender,
    },
    {
      label: "Age",
      value: age,
    },
    {
      label: "Location",
      value: userdata.location || "Not specified",
    },
    {
      label: "Languages Spoken",
      value: Array.isArray(userdata.languages)
        ? userdata.languages.join(", ")
        : userdata.languages || "Not specified",
    },
    {
      label: "About",
      value: about,
    },
  ];

  const infoCards =
    userRole === "doctor" ? Doctor_infoCards : Patient_infoCards;

  return (
    <section className="relative min-h-screen overflow-hidden bg-linear-to-br from-blue-50 via-white to-cyan-100 py-10 sm:py-14">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-cyan-300/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-2xl bg-white/75 p-6 shadow-md ring-1 ring-blue-100 backdrop-blur-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
            Personal Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl">
            Profile Overview
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-blue-100 sm:p-8">
            <div className="mx-auto mb-5 h-32 w-32 overflow-hidden rounded-full ring-4 ring-blue-100 sm:h-36 sm:w-36">
              <img
                src={photoUrl}
                alt={`${fullName} profile`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <h2 className="text-center text-2xl font-bold text-gray-800">
              {fullName}
            </h2>
            <p className="mt-1 text-center text-sm text-gray-500">{email}</p>

            {userRole === "doctor" && (
              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                  About
                </p>
                <p className="mt-1 leading-relaxed">{about}</p>
              </div>
            )}
            <div className="mt-6 rounded-xl bg-blue-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Account Status
              </p>
              <p className="mt-2 text-sm text-blue-900">
                Your profile is active and ready for appointment bookings.
              </p>
            </div>
            {userRole === "patient" && (
              <div className="mt-6 rounded-xl bg-blue-50 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  Want to Become a Doctor?
                </p>
                <button
                  onClick={() => setConformDoctorPopup(true)}
                  className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Apply to Become a Doctor
                </button>
              </div>
            )}
          </article>

          {conformDoctorPopup ? (
            <article className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-blue-100 sm:p-8 lg:col-span-2">
              <form>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Confirm Doctor Application
          </h2>
          {error && (
            <p className="text-sm text-red-500 mb-6">
              {error}
            </p>
          )}
          <p className="text-gray-600 mb-2">
            Are you sure you want to apply for doctor?
          </p>
          <p className="text-sm text-red-500 mb-6">
            Once you switch, there is no going back.
          </p>

          <input type="text" autoComplete="username" hidden={true} />

          <div className="space-y-4">
            <div>
              <label
                htmlFor="old-password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Old password
              </label>
              <input
                id="old-password"
                type="password"
                onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                autoComplete="current-password"
                placeholder="Enter old password"
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                New password
              </label>
              <input
                id="new-password"
                type="password"
                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                autoComplete="new-password"
                placeholder="Enter new password"
                className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <button
              type="button"
              onClick={handleApplyDoctor}
              className="w-full rounded-md bg-blue-500 px-4 py-2 font-medium text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Yes, I am sure
            </button>
            <button
              type="button"
              onClick={() => setConformDoctorPopup(false)}
              className="w-full rounded-md bg-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </form>
            </article>
          ) : (
            <article className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-blue-100 sm:p-8 lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-800">
                Personal Details
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                This section shows the information currently stored in your
                account.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {infoCards.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-blue-100 bg-linear-to-br from-white to-blue-50 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {item.label}
                    </p>
                    <p className="mt-1 wrap-break-word text-lg font-semibold text-gray-800">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {isEditing && (
                <form
                  onSubmit={handleSubmit}
                  className="mt-6 space-y-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5"
                >
                  <h4 className="text-base font-semibold text-gray-800">
                    Edit Profile
                  </h4>

                  {error && (
                    <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
                      {error}
                    </p>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="age"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Age
                      </label>
                      <input
                        id="age"
                        name="age"
                        type="number"
                        min="0"
                        max="120"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="gender"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="profileUrl"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Profile Image URL
                    </label>
                    <input
                      id="profileUrl"
                      name="profileUrl"
                      type="url"
                      value={formData.profileUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {userRole === "doctor" && (
                    <>
                      <div>
                        <label
                          htmlFor="specialty"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Specialty
                        </label>
                        <input
                          id="specialty"
                          name="skills"
                          type="text"
                          value={formData.skills}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="location"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Location
                        </label>
                        <input
                          id="location"
                          name="location"
                          type="text"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="language"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Language
                        </label>
                        <input
                          id="languages"
                          name="languages"
                          type="text"
                          value={formData.languages}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="about"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          About
                        </label>
                        <textarea
                          id="about"
                          name="about"
                          rows={4}
                          value={formData.about}
                          onChange={handleChange}
                          placeholder="Write a short bio about your practice and expertise"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={closeEditor}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6">
                <button
                  onClick={openEditor}
                  disabled={isEditing}
                  className={`w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 ${isEditing ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {isEditing ? "Editing..." : "Edit Profile"}
                </button>
              </div>
              <div className="mt-6 rounded-xl border border-dashed border-blue-200 bg-cyan-50/70 p-4">
                <p className="text-sm text-cyan-900">
                  Tip: Add a profile picture and complete all details for a more
                  personalized experience.
                </p>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}

export default Profile;
