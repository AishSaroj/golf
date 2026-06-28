import axios from 'axios';

// Store injection (kept as you had it)
let store;

export const injectStore = (_store) => {
  store = _store;
};

// ✅ FIXED BASE URL LOGIC
const BASE_URL =
  import.meta.env.VITE_API_URL || 'https://golf-backend-yv0a.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================
// REQUEST INTERCEPTOR
// ========================
api.interceptors.request.use(
  (config) => {
    if (store) {
      const token = store.getState().auth?.token;

      if (token) {
        const url = config.url || '';

        // Don't attach token for auth routes
        const isPublicRoute =
          url.includes('/auth/login') ||
          url.includes('/auth/register') ||
          url.includes('/auth/refresh');

        if (!isPublicRoute) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ========================
// RESPONSE INTERCEPTOR
// ========================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (res.data.success) {
          const newToken = res.data.data.accessToken;

          if (store) {
            store.dispatch({ type: 'auth/setToken', payload: newToken });
          }

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        if (store) {
          store.dispatch({ type: 'auth/logout' });
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;