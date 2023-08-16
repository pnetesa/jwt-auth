import axios from 'axios';
import { AuthResponse } from '../models/response/auth-response';

export const API_URL = 'http://localhost:5001/api';

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

$api.interceptors.response.use((config) => config,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && originalRequest && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
        localStorage.setItem('token', response.data.accessToken);
        return $api.request(originalRequest);
      } catch (e) {
        console.error('USER IS NOT AUTHORIZED');
      }
    }
    throw error; // Non 401 error, throw up
  });

export default $api;
