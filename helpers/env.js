export const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

export function isOpenPages(pathname) {
  return pathname.startsWith('/o/') || pathname.startsWith('/preview');
}

export function resolvePublicPath(pathname) {
  const base = window?.routerBase || '';
  if (isProduction) {
    return `${base.endsWith('/') ? base.slice(0, base.length - 1) : base}${pathname}`;
  }
  return pathname;
}

export function IsPC() {
  var userAgentInfo = navigator.userAgent;
  // var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  var Agents = ['SymbianOS'];
  var flag = false;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = true;
      break;
    }
  }
  return flag;
}
