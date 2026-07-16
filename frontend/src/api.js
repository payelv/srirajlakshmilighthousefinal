// API client for the Sri Rajlaxmi backend.
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const http = axios.create({ baseURL: API });

http.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('srl-token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const contentApi = {
  get: () => http.get('/content').then((r) => r.data),
  update: (patch) => http.put('/content', patch).then((r) => r.data),
};

export const authApi = {
  login: (email, password) =>
    http.post('/admin/login', { email, password }).then((r) => r.data),
  verify: () => http.get('/admin/verify').then((r) => r.data),
};

export const enquiryApi = {
  create: (payload) => http.post('/enquiries', payload).then((r) => r.data),
  list: () => http.get('/enquiries').then((r) => r.data),
  remove: (id) => http.delete(`/enquiries/${id}`).then((r) => r.data),
};

export const uploadApi = {
  // Uploads a file (image) and returns { url, path, filename, size, contentType }
  upload: (file, onProgress) => {
    const form = new FormData();
    form.append('file', file);
    return http
      .post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
        },
      })
      .then((r) => r.data);
  },
};

export default http;
