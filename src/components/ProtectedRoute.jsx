import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      console.warn('No token found, redirecting to login');
    }
  }, [token]);

  return token ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;