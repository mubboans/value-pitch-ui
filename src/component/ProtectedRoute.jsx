// import React from 'react';
import { Navigate } from 'react-router-dom';
import { isUserLogined } from '../helper/helperFn';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ Component }) => {
    return isUserLogined() ? <Component /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
