import axios from 'axios';
import querystring from 'query-string';
import { API_HOST } from '../../config';
import { getLocaleMode } from '@/helpers/storage';

// const server_port = process.env.NODE_ENV === 'production' ? window.location.port : 3001;
const API = axios.create({
  baseURL: API_HOST,
});

API.interceptors.request.use((config) => {
  config.headers.lang = getLocaleMode();
  config.headers['DF-Account-ID'] = 1;
  config.headers['df-project-id'] = 1;
  config.headers['df-tenant-id'] = 1;
  return config;
});

API.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default API;
