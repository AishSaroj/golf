import axios from 'axios';

// We will inject the store later to prevent circular dependencies
let store;

export const injectStore = (_store) => {
  store = _store;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (store) {
      const token = store.getState().auth?.token;

      if (token) {
        // 🚨 IMPORTANT FIX: do NOT attach token on auth routes
        const url = config.url || '';

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`,
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