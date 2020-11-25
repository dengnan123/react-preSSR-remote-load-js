import qs from 'query-string';
import screenfull from 'screenfull';
import { pick } from 'lodash';
import { filterDataFunc } from '@/helpers/screen';
import { getParseSearch, clickIdHasParent } from '@/helpers/utils';
import { isString } from './object';

export function inViewPort(elem) {
  if (!elem || !elem.getBoundingClientRect) {
    return false;
  }

  const rect = elem.getBoundingClientRect();
  // DOMRect { x: 8, y: 8, width: 100, height: 100, top: 8, right: 108, bottom: 108, left: 8 }
  const windowHeight = window?.innerHeight || document?.documentElement.clientHeight;
  const windowWidth = window?.innerWidth || document?.documentElement.clientWidth;

  // http://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
  const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
  const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;

  return vertInView && horInView;
}

export function destoryGlobalSpinner() {
  const spinner = document?.getElementById('loading');
  if (spinner) {
    spinner.setAttribute('class', 'remove');
    // spinner.parentNode.removeChild(spinner);
  }
}

export function redirectTo(to, from) {}

export function goBack() {}

export function loadCssFle(url) {
  const fileref = document?.createElement('link');
  fileref.setAttribute('rel', 'stylesheet');
  fileref.setAttribute('type', 'text/css');
  fileref.setAttribute('href', url);
  document?.getElementsByTagName('head')[0].appendChild(fileref);
}

// eslint-disable-next-line no-script-url
export const someHref = 'javascript:void(0)';

export function animateScroll(container, element, containerTop = 0, speed = 100) {
  const rect = element.getBoundingClientRect();

  const top = container.scrollTop + rect.top - containerTop;

  let start = container.scrollTop;
  let difference = top - start;

  const step = (difference / speed) * 10;

  let clock;

  clearInterval(clock);
  clock = setInterval(() => {
    start += step;
    if (difference >= 0 && start >= top) {
      start = top;
      clearInterval(clock);
    }
    if (difference < 0 && start <= top) {
      start = top;
      clearInterval(clock);
    }
    container.scrollTo(0, start);
  }, 10);
}

export const getRouterParams = () => {
  const { search } = window?.location;
  const params = qs.parse(search);
  return params;
};

export const getApiHostValue = ({ apiHostId, apiHostList = [] }) => {
  const data = apiHostList.filter((v) => v.apiHostId === apiHostId)[0];
  if (!data) {
    return;
  }
  const { envList } = data;
  const envData = envList.filter((v) => v.checked)[0];
  if (!envData) {
    return;
  }
  return envData.value;
};

export const getApiHostValueById = ({ id, apiHostList = [] }) => {
  const data = apiHostList.filter((v) => v.id === id)[0];
  if (!data) {
    return;
  }
  const { sourceList } = data;
  const envData = sourceList.filter((v) => v.checked)[0];
  if (!envData) {
    return;
  }
  return envData;
};

/**
 * 旧版本的dataApiUrl,需要兼容
 */
export const getOldDataApiUrl = ({
  openDataApiUrlFilter,
  dataApiUrlFilter,
  condition,
  dataApiUrlFilterEs5Code,
  dataApiUrl,
}) => {
  let newDataApiUrl;
  if (openDataApiUrlFilter && dataApiUrlFilter) {
    newDataApiUrl = filterDataFunc({
      filterFunc: dataApiUrlFilter,
      filterFuncEs5Code: dataApiUrlFilterEs5Code,
      data: condition,
    });
  } else {
    newDataApiUrl = dataApiUrl;
  }
  return newDataApiUrl;
};

/**
 * 最新版本的 dataApiUrl
 */
export const getNewDataApiUrl = (props) => {
  const {
    condition,
    apiRouter,
    apiRouterFilter,
    apiRouterFilterEs5Code,
    openApiRouterFilter,
  } = props;
  const apiHostValue = getNowUseApihostValue(props);
  let newApiRouter = apiRouter;
  if (openApiRouterFilter && apiRouterFilter) {
    newApiRouter = filterDataFunc({
      filterFunc: apiRouterFilter,
      filterFuncEs5Code: apiRouterFilterEs5Code,
      data: condition,
    });
  }
  return `${apiHostValue}${newApiRouter}`;
};

/**
 * 获取合成的dataApiUrl
 * @param {string} dataApiUrl
 * @param {number} apiHostId
 * @param {boolean} openDataApiUrlFilter
 * @param {function} dataApiUrlFilter
 * @param {boolean} directDataSource
 * @param {array} envList - 环境块数据
 * @param {array} apiHostList - 后端数据源数组
 * @param {boolean} isDebug - 是否是在编辑页面调用api
 * @param {object} condition
 */
export const getDataApiUrl = (props) => {
  const { directDataSource } = props;
  /**
   * 如果是直连数据源，就用老的逻辑，否则用新逻辑
   */
  if (directDataSource) {
    return getOldDataApiUrl(props);
  }
  return getNewDataApiUrl(props);
};

/**
 * 根据链接 获取 链接的
 */

export const getHostByApiHostId = ({ apiHostId, apiHostList = [], envList = [] }) => {
  const keys = ['http://', 'https://'];
  const checkedValue = getNowUseApihostValue({ apiHostId, apiHostList, envList });
  if (!checkedValue) {
    return null;
  }
  for (const key of keys) {
    if (checkedValue.includes(key)) {
      const arr = checkedValue.split(key);
      const newValue = arr[1];
      const data = newValue.split('/');
      if (data?.length) {
        return data[0];
      }
      return newValue;
    }
  }
};

/**
 *
 * 获取当前的使用的环境
 */
export const getNowEnvData = (envList) => {
  const { ENV_KEY } = getParseSearch();
  if (ENV_KEY) {
    for (const v of envList) {
      if (v.envKey === ENV_KEY) {
        return v;
      }
    }
  }
  return envList.filter((v) => v.checked)[0];
};

/**
 * 获取当前使用的 后端数据源
 */
export const getNowUseApihostValue = ({ apiHostId, apiHostList = [], envList = [] }) => {
  const checkedEnv = getNowEnvData(envList);
  if (!checkedEnv) {
    return;
  }
  let checkedValue;
  for (const v of apiHostList) {
    const { id, sourceList } = v;
    if (id === apiHostId) {
      for (const item of sourceList) {
        const { envId, value } = item;
        if (envId === checkedEnv.id) {
          checkedValue = value;
        }
      }
    }
  }

  return checkedValue;
};

/**
 * 根据当前的环境ID 获取,筛选数据源
 */
export const getApiHostByEnvId = (envId, apiHostList = []) => {
  if (!envId) {
    return [];
  }
  return apiHostList.map((v) => {
    const { sourceList } = v;
    for (const item of sourceList) {
      if (item.envId === envId) {
        return {
          apiHostName: v.apiHostName,
          value: item.value,
        };
      }
    }
    return {};
  });
};

/**
 * 根据当前的组件ID 获取 hiddenList
 * 如果组件是在一个成组组件或者容器组件里面，右键操作是需要受限制的
 */

export const getHiddenActionListById = ({ eventArr, id, initUseCompList }) => {
  const filterActionList = [
    'locking',
    'unlock',
    'hidden',
    'show',
    'doGroup',
    'cancelGroup',
    // 'toTop',
    // 'toBottom',
    // 'toUpperLevel',
    // 'toLowLevel',
    'toLevelCenter',
    'toVerticalCenter',
    'toLevelVerticalCenter',
  ];
  let hasParent = clickIdHasParent(initUseCompList, id);
  if (hasParent) {
    // 代表是在成组组件 或者容器里面
    return eventArr.filter((v) => {
      const { eventName } = v;
      return !filterActionList.includes(eventName);
    });
  }
  return eventArr;
};

/**
 * 设置页面全屏
 */
export const fullScreen = (id, cb) => {
  const ele = document?.getElementById(id) || document?.body;
  if (screenfull.isEnabled) {
    screenfull.request(ele);
    screenfull.on('change', () => {
      cb && cb(screenfull.isFullscreen);
    });
  }
};

/**
 * 退出全屏
 */
export const exitFullScreen = () => {
  screenfull.exit();
};

/**
 * 处理数据，只保存 left top width height id pageId compName
 */
export const dealWithDoGroupData = (data) => {
  const keyArr = ['left', 'top', 'width', 'height', 'id', 'pageId', 'groupId', 'compName'];
  const { child = [] } = data;
  const newData = cleanTreeData(child, keyArr);
  return {
    ...pick(data, keyArr),
    child: newData,
  };
};

/**
 * 清洗树状结构的数据
 */
export const cleanTreeData = (arr, keyArr) => {
  return arr.map((v) => {
    const { child } = v;
    if (!child || !child.length) {
      return pick(v, keyArr);
    }
    const newChild = cleanTreeData(child, keyArr);
    return {
      ...pick(v, keyArr),
      child: newChild,
    };
  });
};
