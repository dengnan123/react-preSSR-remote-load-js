import axios from 'axios';
import { getLocaleMode } from '@/helpers/storage';
// const server_port = process.env.NODE_ENV === 'production' ? window.location.port : 3001;

export default baseURL => {
  const API = axios.create({
    baseURL,
    responseType: 'blob',
  });

  API.interceptors.request.use(config => {
    config.headers.lang = getLocaleMode();
    config.headers.Authorization =
      'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1IiwiZXhwIjoxNTkxMDc5MzQ2fQ.GP2tXc0Nv1Z5XSQ-NYAgpEZH7BBnKFA09c_BNI3z-Evn8lOB-oaSw3OWtMO26FoUVGHuv6QEW5YADYCIpfwrzg';
    return config;
  });

  API.interceptors.response.use(
    response => {
      return response.data;
    },
    error => {
      return Promise.reject(error);
    },
  );
  return API;
};
