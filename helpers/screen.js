import { getLocaleMode } from '@/helpers/storage';
// import compilers from '@/helpers/babel/compilers';
import { message, notification } from 'antd';
import UmdLoader from '@/components/UmdLoader';
import ErrorWrap from '@/components/ErrorWrap';
import { getCompScriptInfo } from '@/helpers/static';
import { isArray, cloneDeep } from 'lodash';

import { API_HOST, mapServerURL, mapThemeURL } from '@/config/index';
import PurCompLib from '@/components/PurCompLib';
import ojectPath from 'object-path';

export const getTransform = ({ type, pageWidth, pageHeight }) => {
  const width = document?.body?.clientWidth;
  const height = document?.body?.clientHeight;
  const widthPer = width / pageWidth;
  const heightPer = height / pageHeight;
  if (type === 'heightSpread') {
    return `scale(${heightPer})`;
    // return `scale(${widthPer})`;
  }
  if (type === 'widthSpread') {
    // return `scale(${heightPer})`;
    return `scale(${widthPer})`;
  }
  return `scale(${widthPer},${heightPer})`;
};

export const getBaseTransform = ({ type, selfWidth, selHeight, PWidth, PHeight }) => {
  if (selfWidth < PWidth) {
    return `scale(1,1)`;
  }
  const widthPer = selfWidth / PWidth;
  const heightPer = selHeight / PHeight;
  if (type === 'heightSpread') {
    return `scale(${heightPer})`;
  }
  if (type === 'widthSpread') {
    return `scale(${widthPer})`;
  }
  return `scale(${widthPer},${heightPer})`;
};

export const tranformPxToVw = (arr, pageWidth, nowPageWidth) => {
  return arr.map((v) => {
    const { child, width, left, childComps, basicStyle } = v;
    const vwWidth = traVw(width, pageWidth, nowPageWidth);
    const vwLeft = traVw(left, pageWidth, nowPageWidth);
    // 判断组件是否禁止缩放
    let baseInfo = {};
    if (basicStyle.forbidScale) {
      baseInfo = {
        ...v,
        left: `${vwLeft}vw`,
      };
    } else {
      baseInfo = {
        ...v,
        width: `${vwWidth}vw`,
        left: `${vwLeft}vw`,
      };
    }

    if (child && child.length) {
      return {
        ...baseInfo,
        child: tranformPxToVw(child, pageWidth, nowPageWidth),
      };
    }
    if (childComps && childComps.length) {
      return {
        ...baseInfo,
        childComps: tranformPxToVw(childComps, pageWidth, nowPageWidth),
      };
    }
    return baseInfo;
  });
};

export const traVw = (selfWidth, pageWidth, nowPageWidth) => {
  const _pageWidth = document?.body?.clientWidth;
  return (selfWidth / pageWidth) * 100 * (nowPageWidth / _pageWidth);
};

export const getGirdMaxY = (list) => {
  return list.reduce((pre, next) => {
    const { h = 0 } = next;
    return pre + h;
  }, 0);
};

// 数据过滤器
export const filterDataFunc = ({ filterFunc, filterFuncEs5Code, data, des, otherCompParams }) => {
  const lang = getLocaleMode();
  try {
    // eslint-disable-next-line no-new-func
    const filter = new Function('data', 'lang', 'otherCompParams', `${filterFunc}`);
    return filter(cloneDeep(data), lang, otherCompParams);
  } catch (err) {
    console.log('过滤器代码有误', err.message);
    console.log('filterFunc...', filterFunc);
    // 如果报错，可能是浏览器版本太低，如果有filterFuncEs5Code 代码 就走一遍new Function
    if (filterFuncEs5Code) {
      try {
        // eslint-disable-next-line no-new-func
        const filter = new Function('data', 'lang', 'otherCompParams', `${filterFuncEs5Code}`);
        return filter(cloneDeep(data), lang, otherCompParams);
      } catch (err) {
        console.log('filterFuncEs5Code有误', err.message);
        console.log('filterFuncEs5Code...', filterFuncEs5Code);
        return data;
      }
    }
    return data;
  }
};

const getNewDataByAliasList = (dataSource, dataSourceIdList, childDataSourceName) => {
  const obj = {};
  for (const dataSourceId of dataSourceIdList) {
    const key = childDataSourceName ? `${dataSourceId}.${childDataSourceName}` : dataSourceId;
    obj[dataSourceId] = ojectPath.get(dataSource, key, {});
  }
  return obj;
};

const getNewData = ({ dataSource, dataSourceId, childDataSourceName, compName }) => {
  if (!isArray(dataSourceId)) {
    const key = childDataSourceName ? `${dataSourceId}.${childDataSourceName}` : dataSourceId;
    return ojectPath.get(dataSource, key, {});
  }
  if (dataSourceId.length === 1) {
    const key = childDataSourceName ? `${dataSourceId[0]}.${childDataSourceName}` : dataSourceId[0];
    return ojectPath.get(dataSource, key, {});
  }
  return getNewDataByAliasList(dataSource, dataSourceId, childDataSourceName);
};

export const getNewOtherCompParams = ({ otherCompParams, id }) => {
  return ojectPath.get(otherCompParams, id, {});
};

// 处理动态数据
// childDataSourceName 这个字段已经弃用， 现在是为了兼容以前的页面
export const getFetchData = (
  {
    filterFunc,
    filterFuncEs5Code,
    openHighConfig,
    compName,
    dataSourceId,
    aliasName,
    useDataType,
    type,
    id,
    childDataSourceName,
  },
  otherCompParams,
  dataSource,
) => {
  // dataSource 是整个preview 的model
  if (useDataType !== 'API') {
    return null;
  }
  if (!dataSource) {
    return null;
  }

  const newData = getNewData({ dataSource, dataSourceId, type, childDataSourceName, compName });

  if (openHighConfig && filterFunc) {
    // 把其他组件传递的参数合并到数据源里面
    const des = `组件过滤器组件名字-----${compName}`;
    return filterDataFunc({
      filterFunc,
      filterFuncEs5Code,
      data: newData,
      des,
      otherCompParams,
    });
  }
  return newData;
};

export const getData = ({ mockData, staticData, apiData = {}, useDataType, isPreview }) => {
  if (!isPreview) {
    if (mockData && JSON.stringify(mockData) !== '{}') {
      return mockData;
    }
    return staticData;
  }
  if (useDataType === 'API') {
    return apiData || {};
  }
  if (mockData && JSON.stringify(mockData) !== '{}') {
    return mockData;
  }
  return staticData;
};

export const getMockData = (mockData, staticData) => {
  if (mockData && JSON.stringify(mockData) !== '{}') {
    return mockData;
  }
  return staticData;
};

class CompInfoInstantClass {
  state = {};

  getCompStaticDataByCompName(compName) {
    return this.state[compName];
  }

  setCompStaticDataByCompName(props) {
    const { compName, staticData } = props;
    this.state[compName] = staticData;
  }
}

export const CompInfoInstant = new CompInfoInstantClass();

export const transformCode = (codeStr) => {
  try {
    // eslint-disable-next-line no-new-func
    new Function('params', codeStr);
  } catch (err) {
    console.log('validateCallback err', err.message);
    return;
  }
  const es5Code = compileCodeToEs5(codeStr);
  return es5Code;
};

export const compileCodeToEs5 = (codeStr) => {};

export const addEs5CodeToData = (data, keys) => {
  let newData = {
    ...data,
  };
  const getNewData = (key) => {
    const newKey = `${key}Es5Code`;
    const oldCode = data[key];
    if (!oldCode) {
      newData[newKey] = '';
      return;
    }
    const es5Code = compileCodeToEs5(oldCode);
    newData[newKey] = es5Code;
  };
  if (!isArray(keys)) {
    getNewData(keys);
  } else {
    for (const key of keys) {
      getNewData(key);
    }
  }
  return newData;
};

export const checkAndGetJsonByJsonStr = (jsonStr) => {
  let obj = {};
  let isError = false;
  try {
    obj = JSON.parse(jsonStr);
  } catch (err) {
    isError = true;
  }
  if (isError) {
    notification.open({
      message: 'Error',
      description: 'json格式有误',
    });
    return;
  }
  return obj;
};

export const checkJsonIsOk = (jsonStr) => {
  let isError = false;
  try {
    JSON.parse(jsonStr);
  } catch (err) {
    isError = true;
  }
  if (isError) {
    notification.open({
      message: 'Error',
      description: 'json格式有误',
    });
    return false;
  }
  return true;
};

export const getCompLib = (props) => {
  return <PurCompLib {...props}></PurCompLib>;
};

export const getCompConfig = (props) => {
  const { compName } = props;
  const { compConfigSrc, loaderConfigName } = getCompScriptInfo(compName);
  const Lib = (
    <ErrorWrap>
      <UmdLoader url={compConfigSrc} name={loaderConfigName} props={{ ...props }}>
        <p></p>
      </UmdLoader>
    </ErrorWrap>
  );
  return Lib;
};

export const getCompStaticData = async (compName) => {
  const { compStaticDataSrc, loaderStaticDataName } = getCompScriptInfo(compName);
  return await loadScript(compStaticDataSrc, loaderStaticDataName);
};

export const loadScript = (url, name) => {
  return new Promise((reslove, reject) => {
    script(url, () => {
      const target = window[name];
      if (target) {
        reslove(target);
      } else {
        reslove({});
      }
    });
  });
};

/**
 * 复制内容到粘贴板
 * content : 需要复制的内容
 * msg : 复制完后的提示，不传则默认提示"复制成功"
 */
export function copyToClip(content, msg) {
  const aux = document?.createElement('input');
  aux.setAttribute('value', content);
  document?.body?.appendChild(aux);
  aux.select();
  document.execCommand('copy');
  document?.body?.removeChild(aux);
  if (msg == null) {
    message.success('复制成功');
  } else {
    message.success(msg);
  }
}

/**
 * 获取组件的itemProps
 * v: 组件的基本信息
 * dataSource: preview页面的model
 * onChange: onChange事件
 * lang：当前语言环境
 * pageConfig: 当前页面的基本信息
 * otherCompParams：所有组件的往外传递条件的集合
 * updateCompsHiddenOrShow: 控制组件显示隐藏事件
 * onClick:onClick事件
 */
export const getCompItemProps = (props) => {
  const {
    dataSource,
    v,
    onChange,
    lang,
    pageConfig = {},
    otherCompParams,
    updateCompsHiddenOrShow,
    isPreview,
  } = props;
  const { compName, mapId, mockData = {}, style = {}, useDataType, id } = v;
  // const mapServerURL = `${API_HOST}/static/maps`;
  // const mapThemeURL = `${API_HOST}/static/themes`;
  // const mapServerURL = `./pageStatic/static/maps`;
  // const mapThemeURL = `./pageStatic/static/themes`;

  let fetchData = null;
  const newOtherCompParams = getNewOtherCompParams({ otherCompParams, id });

  if (useDataType === 'API') {
    fetchData = getFetchData(v, newOtherCompParams, dataSource);
  }

  // 图片 src 资源
  const src = style?.filename ? `${API_HOST}/static/${pageConfig.id}/${style.filename}` : null;
  const data =
    getData({
      mockData,
      staticData: null,
      apiData: fetchData,
      useDataType,
      isPreview,
    }) || {};

  // antd  modal挂载容器
  const getContainer = () => {
    return (
      document?.getElementById('canvas') ||
      document?.getElementById('containerDiv') ||
      document?.body
    );
  };

  const resData = {
    ...v,
    style: {
      ...style,
      src,
    },
    mapServerURL,
    mapThemeURL,
    mapId,
    data,
    fetchData,
    onChange: (params) => {
      onChange &&
        onChange({
          ...v,
          params: {
            ...params,
            compName,
            fetchData,
          },
        });
    },
    lang,
    updateCompsHiddenOrShow,
    otherCompParams: newOtherCompParams,
    pageConfig,
    getContainer,
  };
  // if (type === 'container' && child?.length) {
  //   resData.child = addDataToArrObj(child, props);
  // }
  return resData;
};

/**
 * 生成div ID
 */
export const generateDivId = (v) => {
  return `${v.id}_${v.compName}`;
};

/**
 * 根据 isHidden 和  权限确定组件是否显示
 */
export const getCompIsHidden = ({ v, authDataSource, otherCompParams }) => {
  // 权限优先
  const { authFunc, authFuncEs5Code, isHidden, openAuthFunc } = v;
  if (openAuthFunc && authFunc && authDataSource && JSON.stringify(authDataSource) !== '{}') {
    const authRes = filterDataFunc({
      filterFunc: authFunc,
      filterFuncEs5Code: authFuncEs5Code,
      data: authDataSource,
      otherCompParams,
    });
    return authRes;
  }
  return isHidden;
};

/**
 * 更具ID 挥着ID数数组获取对应的信息
 */
export const getInfoByIds = (ids, arr) => {
  return arr.filter((v) => {
    if (ids.includes(v.id)) {
      return true;
    }
    return false;
  });
};
