import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children}) {
    const isLoggedin = useSelector(state => state.user.isLoggedin)
    const isAuthChecked = useSelector(state => state.user.isAuthChecked)

    if (!isAuthChecked) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <p className="text-sm sm:text-base text-gray-600">Checking your session...</p>
        </div>
      )
    }

    if (!isLoggedin) {
      return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute
