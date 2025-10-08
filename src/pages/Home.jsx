import React from "react";
import { FaStethoscope, FaUserMd, FaHospital } from "react-icons/fa";
import { Card, CountUp } from "../components/index";
import { acne, depression, anxiety, generalHealth } from "../assets/index";
import { Link, Element } from "react-scroll";
import { NavLink } from "react-router-dom";

function Home() {
  const issues = [
    {
      title: "Skin Issues",
      desc: "Acne, rashes, eczema, and other skin concerns.",
      img: acne,
      alt: "Skin Issue",
    },
    {
      title: "Depression",
      desc: "Feeling low, loss of interest, or persistent sadness.",
      img: depression,
      alt: "Depression",
    },
    {
      title: "Anxiety",
      desc: "Worry, nervousness, or panic attacks affecting daily life.",
      img: anxiety,
      alt: "Anxiety",
    },
    {
      title: "General Health",
      desc: "Fever, headache, fatigue, and other common symptoms.",
      img: generalHealth,
      alt: "General Health",
    },
  ];
  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-blue-200/60 to-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-40 w-[34rem] h-[34rem] rounded-full bg-gradient-to-tr from-indigo-200/50 to-purple-200/40 blur-3xl" />

      <section className="relative py-10 md:py-28">
        <div className="flex flex-col justify-center items-center mb-15 pb-6 border-b border-blue-100/70 backdrop-blur-sm">
          <h1 className="text-center font-extrabold tracking-tight text-4xl sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
              Welcome to Healthify
            </span>
          </h1>
          <p className="mt-4 text-lg max-w-2xl text-gray-600 text-center">
            Your one-stop solution for all health-related queries.
          </p>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-14">
            <div className="md:w-1/2 text-center md:text-left space-y-6">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Your Health, Our{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    Priority.
                  </span>
                  <span className="absolute -bottom-1 left-0 w-full h-2 bg-gradient-to-r from-blue-400/40 to-cyan-400/40 rounded-full blur-sm" />
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto md:mx-0">
                Providing compassionate and expert medical care to our
                community. Trust us with your well-being and health journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center md:justify-start">
                <NavLink to={"/book-appointment"}>
                  <button className="relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-10 py-3 font-semibold text-white shadow-lg transition duration-300 hover:shadow-blue-500/40 focus:outline-none focus:ring-4 focus:ring-blue-300 cursor-pointer">
                    <span className="relative z-10">Book an Appointment</span>
                    <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-transform duration-300" />
                  </button>
                </NavLink>

                <Link
                  to="common-issues"
                  smooth={true}
                  duration={500}
                  className="rounded-full max-w-3/5 mx-auto sm:mx-0 border border-blue-300/60 bg-white/60 backdrop-blur px-10 py-3 font-semibold text-blue-600 shadow-sm hover:shadow-md hover:border-blue-400 transition focus:outline-none focus:ring-4 focus:ring-blue-200 cursor-pointer"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-200/40 via-transparent to-cyan-200/40 rounded-3xl blur-xl" />
              <img
                src="https://cdn.pixabay.com/photo/2020/11/03/15/31/doctor-5710150_1280.jpg"
                alt="Doctor consulting with a patient"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover ring-1 ring-blue-100/70 transition-transform duration-500 hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        <Element name="common-issues">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Common Medical Issues
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-8">
            {issues.map((issue) => (
              <div
                key={issue.title}
                className="group relative bg-white/80 backdrop-blur rounded-2xl shadow-md hover:shadow-xl px-6 pt-8 pb-6 flex flex-col items-center transition duration-300 border border-transparent hover:border-blue-200"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 opacity-0 group-hover:opacity-100 transition" />
                <img
                  src={issue.img}
                  alt={issue.alt}
                  className="relative w-24 h-24 object-cover rounded-full mb-5 ring-4 ring-white shadow-md"
                  loading="lazy"
                />
                <h3 className="relative text-lg font-semibold text-gray-700 mb-2 md:text-2xl text-center">
                  {issue.title}
                </h3>
                <p className="relative text-gray-500 text-center text-sm flex-1 md:text-base">
                  {issue.desc}
                </p>
                <button className="relative mt-5 w-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 text-sm font-medium shadow hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">
                  Consult Now
                </button>
              </div>
            ))}
          </div>
        </div>
        </Element>
      </section>

      <section className="relative">
        <Element name="count-up">
          <CountUp />
        </Element>
      </section>

      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-blue-100/40 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              Healthify
            </span>
            ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Card
              title="Expert Doctors"
              description="Our team of highly qualified and experienced medical professionals is dedicated to your health and well-being."
              border="border-blue-500"
              color="text-blue-500"
              icon={FaStethoscope}
            />
            <Card
              title="24/7 Availability"
              description="Healthcare services available around the clock for your convenience."
              border="border-green-500"
              color="text-green-500"
              icon={FaHospital}
            />
            <Card
              title="Personalized Care"
              description="We believe in a patient-centric approach, tailoring treatments to your individual needs and comfort."
              border="border-purple-500"
              color="text-purple-500"
              icon={FaUserMd}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
