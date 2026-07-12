import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

const TOKEN_KEY = 'ab_token'; // appify book token

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/' + import.meta.env.VITE_API_VERSION || 'http://localhost:6063/api/v1',
  headers: {
    Accept: 'application/json',
  },
})

// Attach the bearer token on every request.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401, drop the token so the app redirects to login.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearToken()
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
