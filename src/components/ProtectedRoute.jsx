import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ProtectedRoute = ({ role, children }) => {
  const { session } = useApp();
  if (!session) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/auth'} replace />;
  }
  if (role) {
  const roles = Array.isArray(role) ? role : [role];

  if (!roles.includes(session.user.role)) {
    return <Navigate to="/" replace />;
  }
}
  return children;
};

export default ProtectedRoute;
