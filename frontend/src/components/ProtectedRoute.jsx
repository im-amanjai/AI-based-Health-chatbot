import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Check if JWT token exists
  const token = localStorage.getItem("token");

  // If no token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists → allow access
  return children;
}