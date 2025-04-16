import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import Loader from './Loader'; // Assuming you have a Loader component

const ProtectedTenantRoute = () => {
    const { clientId } = useParams();
    const { isAuthenticated, authStatus } = useSelector((state) => state.tenants);

    // Optional: Check if auth status is still loading (e.g., if checking token validity on load)
    if (authStatus === 'loading') {
        return <Loader />; // Or some loading indicator
    }

    if (!isAuthenticated) {
        // Redirect them to the tenant-specific login page
        return <Navigate to={`/tenant/${clientId}/login`} replace />;
    }

    // If authenticated, render the child route component
    return <Outlet />;
};

export default ProtectedTenantRoute;