// Wraps routes that require login
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireStaff }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  // If there's no user, kick them to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the route requires staff access, but the user is an owner, redirect them
  if (requireStaff && user.role === 'owner') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;