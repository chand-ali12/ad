import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const { token } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    // Redirect to signin and save the attempted location
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
