import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function ProtectedRoute({children}) {
    const userStatus = useSelector(state => state.user.isLoggedin)
    const navigate = useNavigate()

    React.useEffect(() => {
      if(!userStatus){
        navigate('/login')
      }
    }, [userStatus])
    
  return (
    children
  )
}

export default ProtectedRoute
