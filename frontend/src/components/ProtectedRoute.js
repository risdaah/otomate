import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

/**
 * ProtectedRoute component to restrict access based on user roles.
 * 
 * Props:
 * - allowedRoles: array of roles allowed to access the route
 * - children: component(s) to render if access is allowed
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = useSelector((state) => state.auth.user)

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User role not authorized, redirect to unauthorized or home page
    return <Navigate to="/welcome" replace />
  }

  // Authorized, render children
  return children
}

export default ProtectedRoute
