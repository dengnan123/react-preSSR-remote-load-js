import { isProduction } from '../helpers/env';

/**
 * 所有的 *_PLACEHOLDER__，在npm run serve启动时，都需要指定运行时需要的值
 * 这个在“Use docker for release”时非常好用，可以针对不同的运行环境使用同一个镜像，指定不同的环境变量
 */
export const STORAGE_TOKEN_KEY = 'platform-token';

export const STORAGE_EXPIRE_DAYS = 49;

export const STORAGE_DOMAIN = '';

export const injectedModule = 'dfocus';

// http://localhost:3002
// https://3dl.dfocus.top/api
// http://40.72.105.107:3003
// http://localhost:3030/static 本地组件库
// http://3dl.dfocus.top/api/static/dist 测试组件库
export const API_HOST = !isProduction ? 'https://3dl.dfocus.top/api' : 'API_HOST_PROD';
export const API_BUILD_HOST = !isProduction
  ? 'https://3dl.dfocus.top/build'
  : 'API_BUILD_HOST_PROD';

export const isPrivateDeployment = process.env.DP_ENV_KEY === 'release';

export const UMD_API_HOST = getUMD_API_HOST();

function getUMD_API_HOST() {
  if (!isPrivateDeployment) {
    return 'https://3dl.dfocus.top/api/static/dist';
  }
  return './pageStatic/static/dist';
}

export const mapServerURL = !isPrivateDeployment
  ? `${API_HOST}/static/maps`
  : './pageStatic/static/maps';

export const mapThemeURL = !isPrivateDeployment
  ? `${API_HOST}/static/themes`
  : './pageStatic/static/themes';
