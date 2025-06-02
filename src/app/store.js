import { configureStore } from '@reduxjs/toolkit';
import clientReducer from '../features/client/clientSlice';
import tenantReducer from '../features/tenant/tenantSlice'
import portScanReducer from '../features/tenant/features/portscan/portScanSlice'
import pcapScanReducer from '../features/tenant/features/pcapScan/pcapSlice'
import ipLookupReducer from '../features/tenant/features/ipLookup/ipLookupSlice'
import adReducer from '../features/tenant/features/activeDirectory/adSlice'
import usersReducer from '../features/tenant/features/users/usersSlice';
import reportReducer from '../features/tenant/features/report/reportSlice'

export const store = configureStore({
    reducer: {
        clients: clientReducer,
        tenants: tenantReducer,
        portScan: portScanReducer,
        pcapScan: pcapScanReducer,
        ipLookup: ipLookupReducer,
        ad: adReducer,
        users: usersReducer,
        report: reportReducer
    }
});