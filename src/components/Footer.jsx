import React from 'react'
import {Logo} from './index'

function Footer() {
  return (
    <div>
      <footer className="w-full p-3 h-max bg-blue-500 text-sm md:text-lg flex items-center justify-around text-white">
        <div className='w-2/3 flex justify-evenly gap-2'>
            <div>
            <h3 className='font-bold '>Healthify</h3>
            <ul>
                <li className='cursor-pointer hover:text-neutral-300'>About</li>
                <li className='cursor-pointer hover:text-neutral-300'>Blog</li>
                <li className='cursor-pointer hover:text-neutral-300'>Careers</li>
                <li className='cursor-pointer hover:text-neutral-300'>Contact Us</li>
            </ul>
            </div>
            <div>
                <div>
                    <h3 className='font-bold'>For Patients</h3>
                    <ul>
                        <li className='cursor-pointer hover:text-neutral-300'>Search For Doctors</li>
                        <li className='cursor-pointer hover:text-neutral-300'>Book an Appointment</li>
                        <br></br>
                    </ul>
                </div>
                <div>
                    <h3 className='font-bold'>For Doctors</h3>
                    <ul>
                        <li className='cursor-pointer hover:text-neutral-300'>Healthify Profile</li>
                    </ul>
                </div>
            </div>
            <div>
                <h3 className='font-bold'>More</h3>
                <ul>
                    <li className='cursor-pointer hover:text-neutral-300'>Help</li>
                    <li className='cursor-pointer hover:text-neutral-300'>Privacy Policy</li>
                    <li className='cursor-pointer hover:text-neutral-300'>Terms & Conditions</li>
                    <li className='cursor-pointer hover:text-neutral-300'>Healthcare Directory</li>
                </ul>
            </div>
        </div>
        <div className='w-1/4 flex flex-col justify-center items-center'>
        <Logo props='h-15 w-15'/>
        <h1 className='text-xl md:text-2xl m-3'>Healthify</h1>
        </div>
      </footer>
    </div>
  )
}

export default Footer
