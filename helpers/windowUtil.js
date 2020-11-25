import qs from 'query-string';
import { isArray, isObject, isNumber, isString } from 'lodash';
import moment from 'dayjs';
import { getRouterParams } from './view';
import { setStorageBykey, getStorageByKey } from './storage';

/**
 * 获取当天的开始时间
 */

export const getDayStartTime = () => {
  return moment().startOf('day').valueOf();
};

/**
 * 获取当天的结束时间
 */
export const getDayEndTime = () => {
  return moment().endOf('day').valueOf();
};

/**
 * 展示千分位
 * @param {any} num
 * @param {any} decimalNumber 小数位数
 */
function thousandsDigitFormat(num, decimalNumber) {
  let number = parseFloat((num || '').toString());
  if (number.toString() === 'NaN') {
    number = 0;
  }
  number = ![undefined, null].includes(decimalNumber) ? number.toFixed(decimalNumber) : number;
  const res = number.toString().replace(/\d+/, function (n) {
    // 先提取整数部分
    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
      return $1 + ',';
    });
  });
  return res;
}

const notEmptyObj = (data) => {
  return data && isObject(data) && JSON.stringify(data) !== '{}';
};

export const windowUtil = (data = {}) => {
  const isHash = {
    isArray,
    isObject,
    isNumber,
    isString,
    getDayStartTime,
    getDayEndTime,
    getRouterParams,
    setStorageBykey,
    getStorageByKey,
    notEmptyObj,
    ...data,
  };
  if (typeof window !== 'undefined') {
    window.qs = qs; // 把 qs挂在到window上，以便于过滤器中使用
    window.thousandsDigitFormat = thousandsDigitFormat;
    window.DP_ENV = process.env.DP_ENV_KEY;
    const keys = Object.keys(isHash);
    keys.map((v) => {
      window[v] = isHash[v];
      return null;
    });
  }
};

/**
 * 挂载在window上的工具类方法
 */
export const windowUtilList = [
  {
    label: 'lodash方法',
    children: [
      {
        label: 'isArray',
        usage: 'isArray(arr)',
        description: 'lodash中的isArray方法',
      },
      {
        label: 'isObject',
        usage: 'isObject(obj)',
        description: 'lodash中的isObject方法',
      },
      {
        label: 'isNumber',
        usage: 'isNumber(num)',
        description: 'lodash中的isNumber方法',
      },
      {
        label: 'isString',
        usage: 'isString(str)',
        description: 'lodash中的isString方法',
      },
    ],
  },
  {
    label: '时间类方法',
    children: [
      {
        label: 'getDayStartTime',
        usage: 'getDayStartTime()',
        description: '获取当天开始时间戳',
      },
      {
        label: 'getDayEndTime',
        usage: 'getDayEndTime()',
        description: '获取当天结束时间戳',
      },
    ],
  },
  {
    label: '浏览器存储',
    children: [
      {
        label: 'setStorageBykey',
        usage: 'setStorageBykey(key, value)',
        description: 'localStorage存储数据',
      },
      {
        label: 'getStorageByKey',
        usage: 'getStorageByKey(key)',
        description: 'localStorage读取数据',
      },
      {
        label: 'setLang',
        usage: 'setLang(lang)',
        description: 'localStorage设置语言环境，lang与umi_locale保持一致',
      },
    ],
  },
  {
    label: '其他方法',
    children: [
      {
        label: 'qs',
        usage: 'qs(str)',
        description: 'npm：query-string',
      },
      {
        label: 'getRouterParams',
        usage: 'getRouterParams()',
        description: '获取url参数',
      },
      {
        label: 'thousandsDigitFormat',
        usage: 'thousandsDigitFormat(num, decimalNumber)',
        description:
          '获取千分位字符串：num-数值，decimalNumber-保留小数位数，decimalNumber为null或者undefined则不对小数位做处理',
      },
    ],
  },
];
