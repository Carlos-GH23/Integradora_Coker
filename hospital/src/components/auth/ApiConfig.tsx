export const API_LOCAL_URL = "http://localhost:8080";

const API_ENDPOINTS_LOCAL = {
    login: `${API_LOCAL_URL}/api/auth/login`,
    users: `${API_LOCAL_URL}/users/api/`,
    cars: `${API_LOCAL_URL}/vehiculo/api/`,
    clients: `${API_LOCAL_URL}/cliente/api/`,
    services: `${API_LOCAL_URL}/vehiculo/servicio/api/`,
    resertPassword: `${API_LOCAL_URL}/users/password-reset/`,
    refresh: `${API_LOCAL_URL}/users/token/refresh/`,
};

export const API_ENDPOINTS = API_ENDPOINTS_LOCAL