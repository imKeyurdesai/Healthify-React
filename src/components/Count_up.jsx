import React from 'react'
import CountUp from 'react-countup';
import { FaRegUser} from 'react-icons/fa';
import { FaUserDoctor } from "react-icons/fa6";
import { LiaHandsHelpingSolid } from "react-icons/lia";

function Count_up() {
     const statsData = [
    { 
      title: "Current Users", 
      value: 5230, 
      color: "text-blue-600",
      icon : FaRegUser
    },
    { 
      title: "Patients Consulted", 
      value: 12480, 
      color: "text-red-600",
      icon : LiaHandsHelpingSolid
    },
    { 
      title: "Expert Doctors", 
      value: 187, 
      color: "text-green-600",
      icon: FaUserDoctor
    }
  ];
  return (
     <div className="bg-gradient-to-br from-white to-blue-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsData.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="border-2 border-dashed rounded-xl w-16 h-16" >
                  <stat.icon className={`w-8 h-8 mx-auto mt-4 ${stat.color} group-hover:scale-110 transition-transform`} />
                </div>
              </div>
              
              <div className="text-center">
                <CountUp
                  end={stat.value}
                  duration={2.5}
                  delay={index * 0.3}
                  formattingFn={(val) => `${val.toLocaleString()}+`}
                  className={`text-5xl font-extrabold ${stat.color} group-hover:scale-110 transition-transform`}
                />
                <p className="mt-2 text-gray-600 font-medium">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Count_up

