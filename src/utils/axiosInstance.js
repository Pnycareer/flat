import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  // baseURL: 'https://www.api.zianshahlegalconsultant.com/api',
  headers: {
    'Content-Type': 'application/json'
  },
});

// ⬅️ Interceptor to add JWT
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
