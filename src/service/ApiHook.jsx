import axios from 'axios';
import { useMemo } from 'react';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function ApiHook() {
    const api = useMemo(() => {
        const instance = axios.create({ baseURL: API_BASE_URL });
    
        instance.interceptors.request.use((config) => {
          const token = localStorage.getItem('token');
        //   console.log('Using token:', token);
          if (token) config.headers.Authorization = `Bearer ${token}`;
          return config;
        });
    
        return instance;
      }, []);
    
      return {
        get: (url, config) => api.get(url, config),
        post: (url, data, config) => api.post(url, data, config),
        put: (url, data, config) => api.put(url, data, config),
        del: (url, config) => api.delete(url, config),
      };
}
