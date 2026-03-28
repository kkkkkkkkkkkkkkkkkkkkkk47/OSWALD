import axios from 'axios';

const API_URL = '/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('osvald_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('osvald_token');
      localStorage.removeItem('osvald_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
