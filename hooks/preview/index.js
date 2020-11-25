import { useState, useEffect, useRef } from 'react';
import { filterDataFunc, getTransform, generateDivId, getInfoByIds } from '@/helpers/screen';
import { getLocaleMode } from '@/helpers/storage';
import { getParseSearch } from '@/helpers/utils';
import API from '@/helpers/api';
import { setLocaleMode } from '@/helpers/storage';
import { windowUtil } from '@/helpers/windowUtil';
import emitter from '@/helpers/mitt';
import { isArray } from 'lodash';
import { getDataApiUrl } from '@/helpers/view';
import dynamicAPI from '@/helpers/api/dynamic';
import { useCustomCompareEffect, useEffectOnce } from 'react-use';
import isEqual from 'fast-deep-equal';
import io from 'socket.io-client';
import { getCondition, getHeaders, updateDataSource } from './util';

export const useTra = ({ pageConfig, data }) => {
  const [tra, setTra] = useState(null);
  useEffect(() => {
    const getTra = () => {
      const { type } = pageConfig;
      const tra = getTransform({
        type,
        pageWidth: pageConfig.pageWidth,
        pageHeight: pageConfig.pageHeight,
      });
      setTra(tra);
    };
    getTra();
    window.addEventListener('resize', getTra);
    return () => {
      window.removeEventListener('resize', getTra);
    };
  }, [setTra, pageConfig, data]);
  return { tra };
};

export const useInit = ({ init }) => {
  useEffectOnce(() => {
    const { pageId } = getParseSearch();
    console.log('useEffectOnce init')
    init({
      pageId,
    });
  });
};

export const useLoading = ({ propsList }) => {
  const [showLoading, setLoading] = useState(true);
  const intervalRefs = useRef(0);
  const index = intervalRefs.current;
  if (index === 0) {
    if (propsList && propsList.length) {
      intervalRefs.current = 1;
      setTimeout(() => {
        // 等页面完全渲染完成后，取消loading
        setLoading(false);
      }, 500);
    }
  }
  return { showLoading };
};

export const useWhenWidthChange = ({ width, widthChangeFunc, pageConfig }) => {
  // width变化重新计算  页面徐然完成后，当pageConfig有值的时候，代表已经拿到后端数据，开始计算宽度
  useEffect(() => {
    widthChangeFunc(width);
  }, [width, widthChangeFunc, pageConfig]);
};

export const useData = data => {
  const [_data, setData] = useState([]);
  useEffect(() => {
    setData(data);
  }, [data]);

  return { data: _data, setData };
};

// 组件隐藏
const hiddenComps = ({ updateCompsHiddenOrShow, data }) => {
  const {
    hiddenComps,
    openHiddenCompsFilterFunc,
    hiddenCompsFilterFunc,
    hiddenCompsFilterFuncEs5Code,
  } = data;
  let arr = hiddenComps;
  if (openHiddenCompsFilterFunc && hiddenCompsFilterFunc) {
    arr = filterDataFunc({
      filterFunc: hiddenCompsFilterFunc,
      filterFuncEs5Code: hiddenCompsFilterFuncEs5Code,
      data,
    });
  }
  console.log('隐藏ziji...... ', arr);
  if (arr?.length) {
    updateCompsHiddenOrShow({
      hiddenComps: arr,
    });
  }
};

//  组件显示
const showComps = ({ updateCompsHiddenOrShow, data }) => {
  const {
    showComps,
    showCompsFilterFuncEs5Code,
    showCompsFilterFunc,
    openShowCompsFilterFunc,
  } = data;

  let arr = showComps;
  if (openShowCompsFilterFunc && showCompsFilterFunc) {
    arr = filterDataFunc({
      filterFunc: showCompsFilterFunc,
      filterFuncEs5Code: showCompsFilterFuncEs5Code,
      data,
    });
  }
  if (arr?.length) {
    updateCompsHiddenOrShow({
      showComps: arr,
    });
  }
};

// 回调
const callback = ({ data }) => {
  const { clickCallbackFuncEs5Code, clickCallbackFunc, params } = data;
  //onChange事件的回调函数
  if (clickCallbackFunc) {
    filterDataFunc({
      filterFunc: clickCallbackFunc,
      filterFuncEs5Code: clickCallbackFuncEs5Code,
      data: params,
    });
  }
};

// 条件缓存
const paramsCache = ({ data, cacheParamsRef, idParamsRef }) => {
  const { cacheParamsDeps, params } = data;
  // 把条件缓存到cacheParamsRef里面
  for (const v of cacheParamsDeps) {
    if (cacheParamsRef.current[v]) {
      cacheParamsRef.current[v] = {
        ...cacheParamsRef.current[v],
        ...params,
      };
    } else {
      cacheParamsRef.current[v] = params;
    }
  }
};

// 组件直接参数传递
const passParams = ({ data, updatePassParamsHash }) => {
  const { passParamsComps, params } = data;
  // 点击的时候组件之间传递参数
  if (passParamsComps && passParamsComps.length) {
    updatePassParamsHash({
      ids: passParamsComps,
      params,
    });
  }
};

// 清除关联组件条件
const clearParams = ({ data, updateClearParams, cacheParamsRef, dataSourceList, useCompList }) => {
  const { clearParamsComps, id } = data;
  //告诉子组件需要把状态恢复到默认状态
  updateClearParams({ shouldClear: clearParamsComps, resetSelf: id });
  // 把clearParamsComps 里面组件 对应的缓存的数据源清除掉 这样会产生一个新BUG，
  // 如果其他组件也关联的对应的数据源，关联数据也会被清除掉 后面再改
  const clearComps = getInfoByIds(clearParamsComps, useCompList);
  for (const v of clearComps) {
    const { cacheParamsDeps } = v;
    for (const v of cacheParamsDeps) {
      if (cacheParamsRef.current[v]) {
        cacheParamsRef.current[v] = {};
      }
    }
  }
};

// 联动数据源
const fetchApi = async ({
  data,
  dataSourceList,
  idParamsRef,
  cacheParamsRef,
  setHasData,
  apiHostList,
  envList,
}) => {
  const { deps, type, params, openDepsFilterFunc, depsFilterFunc, depsFilterFuncEs5Code } = data;
  let newDeps = deps;

  if (openDepsFilterFunc && depsFilterFunc) {
    newDeps = filterDataFunc({
      filterFunc: depsFilterFunc,
      filterFuncEs5Code: depsFilterFuncEs5Code,
      data,
    });
  }
  console.log('openDepsFilterFunc', openDepsFilterFunc);
  console.log('depsFilterFunc', depsFilterFunc);
  console.log('newDeps', newDeps);
  if (!newDeps || !newDeps.length) {
    return;
  }
  let shouldChangeArr = dataSourceList.filter(v => {
    if (newDeps.includes(v.id)) {
      return true;
    }
    return false;
  });
  let newIdParams = {
    ...idParamsRef.current,
  };
  for (const v of shouldChangeArr) {
    const { id: _ } = v;
    newIdParams[_] = params;
  }
  idParamsRef.current = newIdParams; //保存最新的条件引用
  const fetchArr = shouldChangeArr.map(v => {
    const { id } = v;
    const condition = getSearchParams(idParamsRef, cacheParamsRef, id, type);
    return fetchData({
      ...v,
      condition,
      setHasData,
      apiHostList,
      envList,
    });
  });
  await Promise.all(fetchArr);
};

//多语言切换
const langChange = ({ data }) => {
  const { params } = data;
  if (params.compName === 'LocaleSwitch') {
    setLocaleMode(params.compValue);
  }
};

// 清理数据源
const clearApiData = ({ data, setHasData }) => {
  console.log('clearApiDataclearApiData');
  const { openClearApiDepsFunc, clearApiDepsFuncEs5Code, clearApiDepsFunc, clearApiDeps } = data;
  let arr = clearApiDeps;
  console.log('arrarr', arr);
  if (openClearApiDepsFunc && clearApiDepsFunc) {
    arr = filterDataFunc({
      filterFunc: clearApiDepsFunc,
      filterFuncEs5Code: clearApiDepsFuncEs5Code,
      data,
    });
  }
  if (arr?.length) {
    const clearApiIdHash = {};
    for (const v of clearApiDeps) {
      clearApiIdHash[v] = null;
    }
    setHasData(clearApiIdHash);
  }
};

export const onChange = props => {
  const eventHash = {
    langChange,
    clearParams,
    passParams,
    paramsCache,
    callback,
    showComps,
    hiddenComps,
    fetchApi,
    clearApiData,
  };
  const {
    data: {
      params: { includeEvents, excludeEvents },
    },
  } = props;

  if (isArray(includeEvents)) {
    for (const event of includeEvents) {
      if (eventHash[event]) {
        eventHash[event](props);
      }
    }
    return;
  }
  const allEvents = Object.keys(eventHash);
  if (isArray(excludeEvents)) {
    for (const event of allEvents) {
      if (!excludeEvents.includes(event)) {
        if (eventHash[event]) {
          eventHash[event](props);
        }
      }
    }
    return;
  }
  for (const event of allEvents) {
    if (eventHash[event]) {
      eventHash[event](props);
    }
  }
};

export const useRegistInterval = props => {
  const intervalRefs = useRef([]);
  useCustomCompareEffect(
    () => {
      const clearFunc = () => {
        if (!intervalRefs.current.length) {
          return;
        }
        for (const timer of intervalRefs.current) {
          clearInterval(timer);
        }
      };
      const { dataSourceList } = props;
      for (const item of dataSourceList) {
        const { fetchInterval, autoRefresh, useDataType } = item;
        const _fetchInterval = fetchInterval ? fetchInterval : 10;
        if (useDataType === 'API' && autoRefresh) {
          const timerId = creatFetchInterval({
            ...item,
            fetchInterval: _fetchInterval,
            ...props,
          });

          intervalRefs.current = [...intervalRefs.current, timerId];
        }
      }
      return () => {
        clearFunc();
      };
    },
    [props],
    (prevDeps, nextDeps) => {
      const preProps = prevDeps[0];
      const nextProps = nextDeps[0];
      return isEqual(preProps.dataSourceList, nextProps.dataSourceList);
    },
  );
};

const creatFetchInterval = props => {
  const { fetchInterval, id, idParamsRef, cacheParamsRef } = props;
  return setInterval(() => {
    fetchData({
      ...props,
      condition: {
        ...idParamsRef.current[id],
        ...cacheParamsRef.current[id],
      },
    });
  }, fetchInterval * 1000);
};

export const fetchData = async props => {
  const {
    dataApiUrl,
    id,
    setHasData,
    methodType,
    filterFuncEs5Code,
    filterFunc,
    notUseProxy,
  } = props;
  console.log('notUseProxynotUseProxy', notUseProxy);
  const newDataApiUrl = getDataApiUrl(props);
  const newCondition = getCondition(props);
  const headers = getHeaders(props);
  emitter.emit(`${id}_loading_true`, {});

  let resData;
  if (notUseProxy) {
    resData = await dynamicAPI({
      dataApiUrl: newDataApiUrl,
      condition: newCondition,
      methodType,
      cusHeaders: headers,
    });
  } else {
    resData = await API.post(`/page-comp/apiProxy`, {
      dataApiUrl: newDataApiUrl,
      condition: newCondition,
      methodType,
      cusHeaders: headers,
    });
  }
  emitter.emit(`${id}_loading_false`, resData);
  updateDataSource({
    setHasData,
    id,
    resData,
    dataApiUrl,
    filterFunc,
    filterFuncEs5Code,
  });
};

export const getSearchParams = (idParamsRef, cacheParamsRef, id, type) => {
  if (type === 'resetParams') {
    return {};
  }
  const condition = idParamsRef.current[id] || {};
  const cacheParams = cacheParamsRef.current[id] || {};

  const _condition = {
    ...condition,
    ...cacheParams,
  };

  return _condition;
};

export const onClick = ({ data }) => {
  const { onClickCallbackFuncEs5Code, onClickCallbackFunc } = data;
  if (onClickCallbackFunc) {
    filterDataFunc({
      filterFunc: onClickCallbackFunc,
      filterFuncEs5Code: onClickCallbackFuncEs5Code,
      data,
    });
  }
};

export const useHotUpdate = ({ pageConfig, fetchPageUseCompList }) => {
  const timerRef = useRef(null);
  useEffect(() => {
    const { hotUpdate } = pageConfig;
    if (hotUpdate) {
      const timer = setInterval(() => {
        fetchPageUseCompList();
      }, 5 * 1000);
      timerRef.current = timer;
    }
    return () => {
      clearInterval(timerRef.current);
    };
  }, [pageConfig, fetchPageUseCompList]);
};

export const useInitFetchData = props => {
  const isFirstRef = useRef(true);
  useEffect(() => {
    const { dataSourceList } = props;
    if (dataSourceList && dataSourceList.length) {
      if (!isFirstRef.current) {
        return;
      }
      const doFetch = async () => {
        // 执行需要初始化的接口
        const fetchList = dataSourceList.map(async item => {
          const { useDataType, pageInitFetch } = item;
          if (useDataType === 'API' && pageInitFetch) {
            await fetchData({
              ...item,
              condition: {},
              ...props,
            });
          }
        });
        await Promise.all(fetchList);
      };
      setTimeout(() => {
        doFetch();
        // 先下载lib.js 初始化接口可以晚一点
      }, 0);

      isFirstRef.current = false;
    }
  }, [props]);
};

export const useDoPageShell = ({ pageConfig }) => {
  const { pageShellEs5Code } = pageConfig;
  useEffect(() => {
    if (pageShellEs5Code) {
      const lang = getLocaleMode();
      try {
        // eslint-disable-next-line no-new-func
        const filter = new Function('lang', `${pageShellEs5Code}`);
        filter(lang);
      } catch (err) {
        console.log('useDoPageShell err', err);
      }
    }
  }, [pageShellEs5Code]);
};

export const getDataSource = ({ dataSourceId, type, id, dataSourceKey }, preview) => {
  if (!isArray(dataSourceId)) {
    return type === 'container' ? preview : preview[dataSourceId];
  }
};

export const emitterInitOn = data => {
  if (data.length) {
    for (const v of data) {
      const { loadingDeps } = v;
      if (loadingDeps && loadingDeps.length) {
        // 监听数据源
        for (const apiId of loadingDeps) {
          emitter.on(`${apiId}_loading_true`, v => {});
          emitter.on(`${apiId}_loading_false`, v => {});
        }
      }
    }
  }
};

export const useMoveEvent = arr => {
  const [domList, setList] = useState([]);
  useEffect(() => {
    if (!arr || !arr.length) {
      return;
    }
    if (domList.length) {
      return;
    }
    // 批量注册监听器
    for (const v of arr) {
      const { moveCallbackFuncEs5Code, moveCallbackFunc } = v;
      const divId = generateDivId(v);

      if (moveCallbackFunc) {
        // 找到divId 加上监听
        const func = () => {
          console.log('回调 useMoveEvent');
          filterDataFunc({
            filterFunc: moveCallbackFunc,
            filterFuncEs5Code: moveCallbackFuncEs5Code,
            data: v,
          });
        };
        const domDiv = document?.getElementById(divId);
        domDiv.addEventListener('touchstart', func);
        setList(pre => {
          return [
            ...pre,
            {
              domDiv,
              func,
            },
          ];
        });
      }
    }
    return () => {
      // 卸载监听器
      for (const v of domList) {
        const { domDiv, func } = v;
        domDiv.removeEventListener('touchstart', func);
      }
    };
  }, [arr, domList]);
};

export const useLoadFuncToWindow = data => {
  useEffect(() => {
    windowUtil(data);
  }, [data]);
};

/**
 * 如果页面是全屏铺满模式，设置body
 */
export const useSetBodyStyle = type => {
  useEffect(() => {
    if (type !== 'allSpread') {
      return;
    }
    document.body.style.overflow = 'hidden';
    // const ele = doc
    const ele = document.getElementById('containerDiv');
    if (ele) {
      ele.style.overflow = 'hidden';
    }
  }, [type]);
};

/**
 * 数据源是socket的处理
 */
export const useSocket = props => {
  useCustomCompareEffect(
    () => {
      const { dataSourceList, setHasData } = props;
      const socketDataSource = dataSourceList.filter(v => v.useDataType === 'socket');
      if (!socketDataSource.length) {
        return;
      }
      for (const item of socketDataSource) {
        socketFunc({
          ...item,
          setHasData,
        });
      }
      return () => {};
    },
    [props],
    (prevDeps, nextDeps) => {
      const preProps = prevDeps[0];
      const nextProps = nextDeps[0];
      return isEqual(preProps.dataSourceList, nextProps.dataSourceList);
    },
  );
};

/**
 * socket监听
 */
export const socketFunc = async props => {
  const {
    dataApiUrl,
    id,
    setHasData,
    filterFuncEs5Code,
    filterFunc,
    notUseProxy,
    socketEventName = 'message',
  } = props;
  const newDataApiUrl = getDataApiUrl(props);
  console.log('newDataApiUrlnewDataApiUrl', newDataApiUrl);
  const newCondition = getCondition(props);
  // const headers = getHeaders(props);
  const socket = io(newDataApiUrl, {
    query: newCondition,
  });

  socket.on(socketEventName, resData => {
    updateDataSource({
      setHasData,
      id,
      resData,
      dataApiUrl,
      filterFunc,
      filterFuncEs5Code,
    });
  });
  socket.on('disconnect', function(msg) {
    console.log('msgmsgmsgmsg', msg);
  });
};
