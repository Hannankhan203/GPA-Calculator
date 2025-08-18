import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../context/store";
import PropTypes from 'prop-types';
import LoadingSpinner from "./LoadingSpinner"; 

const ProtectedRoute = ({ children, requireEmailVerification = false }) => {
  const location = useLocation();
  const { user, loading, userData } = useAuthStore();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireEmailVerification && !user.emailVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireEmailVerification: PropTypes.bool
};

export default ProtectedRoute;