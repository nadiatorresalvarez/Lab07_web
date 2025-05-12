import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.some(role => user.roles.includes(role))) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;