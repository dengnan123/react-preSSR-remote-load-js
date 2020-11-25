import * as moment from 'dayjs';

export function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}
export function isEmpty(obj) {
  return obj === null || obj === undefined;
}

export function isFunction(obj) {
  return Object.prototype.toString.call(obj) === '[object Function]';
}

export function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

export function urlJoin(...paths) {
  return paths
    .filter(p => p)
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '');
}

export function toDisplayDate(date) {
  const momentDate = moment(date);
  return {
    main: momentDate.format('LL'),
    dayOfWeek: momentDate.format('dddd'),
  };
}

export function getDurationDesc(duration, lang) {
  // TODO: 修改跨天的显示
  const monthCount = duration.month();
  const dayCount = duration.days();
  const hourCount = duration.hours();
  const minuteCount = duration.minutes();
  const monthUnit = lang === 'zh' ? '月' : 'month';
  const dayUnit = lang === 'zh' ? '天' : 'day';
  const hourUnit = lang === 'zh' ? '小时' : 'hour';
  const minuteUnit = lang === 'zh' ? '分钟' : 'minute';
  let result = '';
  if (monthCount > 0) {
    result = `${monthCount} ${monthUnit}`;
    if (monthCount > 1 && lang !== 'zh') {
      result += 's';
    }
  }
  if (dayCount > 0) {
    result = `${dayCount} ${dayUnit}`;
    if (dayCount > 1 && lang !== 'zh') {
      result += 's';
    }
  }
  if (hourCount > 0) {
    result += `${hourCount} ${hourUnit}`;
    if (hourCount > 1 && lang !== 'zh') {
      result += 's';
    }
    if (minuteCount > 0) {
      result += ` ${minuteCount} ${minuteUnit}`;
    }
  }
  if (hourCount === 0) {
    result += ` ${minuteCount} ${minuteUnit}`;
  }
  if (minuteCount > 1 && lang !== 'zh') {
    result += 's';
  }
  return result;
}
