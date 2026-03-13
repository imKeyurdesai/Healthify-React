import React from 'react'
import { useSelector } from 'react-redux'

function Profile() {
  const userdata = useSelector(state => state.user.userdata)
  return (
    <div>
        <h1>Profile</h1>
        <p>FirstName: {userdata.firstName}</p>
        <p>Email: {userdata.emailId}</p>
        <p>Age: {userdata.age}</p>
        <img src={userdata.profileUrl} alt="Profile" />
    </div>
  )
}

export default Profile
