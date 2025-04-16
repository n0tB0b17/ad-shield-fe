import { configureStore } from '@reduxjs/toolkit';
import clientReducer from '../features/client/clientSlice';
import tenantReducer from '../features/tenant/tenantSlice'
import portScanReducer from '../features/tenant/features/portscan/portScanSlice'

export const store = configureStore({
    reducer: {
        clients: clientReducer,
        tenants: tenantReducer,
        portScan: portScanReducer
    },
});