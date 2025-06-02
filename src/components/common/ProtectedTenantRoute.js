import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import Loader from './Loader';
import { checkTokenExpiration } from '../../features/tenant/tenantSlice';

const ProtectedTenantRoute = () => {
    const { clientId } = useParams();
    const { isAuthenticated, authStatus } = useSelector((state) => state.tenants);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(checkTokenExpiration());
    }, [dispatch, checkTokenExpiration]);

    if (authStatus === 'loading') {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return <Navigate to={`/tenant/${clientId}/login`} replace />;
    }

    return <Outlet />;
};

export default ProtectedTenantRoute;