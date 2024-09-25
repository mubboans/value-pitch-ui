import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getValue, isUserLogined } from '../helper/helperFn';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ Component, allowedRoles }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const userDetail = getValue('userdetail');
    const navigate = useNavigate();

    useEffect(() => {
        if (userDetail) {
            const isLoggedIn = isUserLogined();
            const hasAccess = allowedRoles.includes(userDetail.role);

            if (isLoggedIn && hasAccess) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } else {
            setIsAuthorized(false); // Not logged in
        }
    }, [userDetail, allowedRoles]);

    const handleGoBack = () => {
        if (userDetail && userDetail.role === 'user') {
            navigate('/myprofile'); // Navigate to profile for regular users
        } else {
            navigate(-1); // Go back to the previous page
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? (
        <Component />
    ) : (
        <div>
            <h2>Access Denied</h2>
            <p>You do not have permission to view this page.</p>
            <button onClick={handleGoBack}>Go Back</button>
        </div>
    );
};

export default ProtectedRoute;
