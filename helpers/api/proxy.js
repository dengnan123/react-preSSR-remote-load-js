import axios from 'axios';
import querystring from 'query-string';
import { API_HOST } from '../../config';
import { getLocaleMode } from '@/helpers/storage';
import { isObject } from 'lodash';

function API(headers) {
  const _API = axios.create({
    baseURL: API_HOST,
  });
  _API.interceptors.request.use(config => {
    const { token = '' } = querystring.parse(decodeURI(window?.location?.search));
    config.headers.lang = getLocaleMode();
    config.headers.Authorization = token;
    if (isObject(headers)) {
      config.headers = {
        ...config.headers,
        ...headers,
      };
    }
    return config;
  });

  _API.interceptors.response.use(
    response => {
      return response.data;
    },
    error => {
      return Promise.reject(error);
    },
  );
  return _API;
}

export default API;
