import { Navigate } from "react-router-dom";

const CheckAuth = ({ children }) => {
  const token = localStorage.getItem("token");

  // If token exists, allow access
  if (token) {
    return children;
  }

  // If no token, redirect to login
  return <Navigate to="/" replace />;
};

export default CheckAuth;
