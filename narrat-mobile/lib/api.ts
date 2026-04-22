import axios from 'axios';
import { getToken } from './tokenStorage';
import { API_BASE_URL } from './config';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    if (error.message === 'Network Error') {
      return Promise.reject(new Error('Impossible de contacter le serveur. (Network Error)'));
    }
    return Promise.reject(new Error(error.message || 'Une erreur est survenue'));
  }
);
