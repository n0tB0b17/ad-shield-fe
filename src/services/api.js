import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const authApiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

authApiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('authToken');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

authApiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('tenantUser');
            localStorage.removeItem('tokenExpireAt');
            
            // const currentPath = window.location.pathname;
            // const clientId = currentPath.split('/')[2]; // Extract clientId from URL
            // if (clientId) {
            //     window.location.href = `/tenant/${clientId}/login`;
            // }
        }
        return Promise.reject(error);
    }
);

export { authApiClient };

export default apiClient;