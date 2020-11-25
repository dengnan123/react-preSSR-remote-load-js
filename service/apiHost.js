import API from '../helpers/api';
import { loadScript } from '@/helpers/screen';

import { isPrivateDeployment } from '@/config/index';

export function addApiHost(opts) {
  return API.post(`/apiHost`, opts);
}

export function updateApiHost(opts) {
  return API.patch(`/apiHost`, opts);
}

export function deleteApiHost(opts) {
  return API.patch(`/apiHost/delete`, opts);
}

export function findApiHostList(opts) {
  // if (isPrivateDeployment) {
  //   return loadScript(`./pageStatic/apiHost.js`, 'DP_STATIC_APIHOST');
  // }
  return API.get(`/apiHost`, { params: opts });
}

export function addEnv(opts) {
  return API.post(`/apiHost/env`, opts);
}

export function updateEnv(opts) {
  return API.patch(`/apiHost/env`, opts);
}

export function deleteEnv(opts) {
  return API.patch(`/apiHost/env/delete`, opts);
}

export function findEnvList(opts) {
  // if (isPrivateDeployment) {
  //   return loadScript(`./pageStatic/env.js`, 'DP_STATIC_ENV');
  // }
  return API.get(`/apiHost/env`, { params: opts });
}

///env/check
export function updateEnvChecked(opts) {
  return API.patch(`/apiHost/env/check`, opts);
}
