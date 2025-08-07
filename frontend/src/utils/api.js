import axios from 'axios';

// .env dosyasındaki VITE_API_BASE değişkenine göre baseURL belirlenir.
// Geliştirme ortamında CORS sorunlarını önlemek için yoksa '/api' kullanılır.
const BASE = import.meta.env.VITE_API_BASE;
const api = axios.create({
  baseURL: BASE ? `${BASE}/api` : '/api',
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaultsa.headers.common['Authorization'];
  }
}

export default api;
