import { useState, useCallback } from 'react';
import { setLocaleMode } from '@/helpers/storage';
import { fetchPageUseCompList, fetchPageConfig, getAllDataSource } from '../../service';
import { findApiHostList, findEnvList } from '@/service/apiHost';
import { tranformPxToVw } from '@/helpers/screen';
import { getParseSearch } from '@/helpers/utils';
import fetch from 'isomorphic-fetch';
import {
  getEventHashAndDrillDownHash,
  updateListBysaveDeps,
  getContainerHash,
  dealWithInitData,
} from '@/helpers/utils';

const { pageId, tagId } = getParseSearch();

export const useModal = () => {
  // const [initUseCompList, setInitUseCompList] = useState([]);
  // const [bakInitUseCompList, setBakInitUseCompList] = useState([]);
  // const [pageConfig, setPageConfig] = useState({});
  // const [eventHash, setEventHash] = useState({});
  // const [drillDownHash, setDrillDownHash] = useState({});
  // const [idParams, setIdParams] = useState({});

  const [modalState, setState] = useState({
    initUseCompList: [],
    bakInitUseCompList: [],
    pageConfig: {},
    eventHash: {},
    drillDownHash: {}, // 所有开启先钻功能的组件
    idParams: {},
    lang: 'zh-CN',
    dataSourceList: [],
    apiHostList: [],
    envList: [],
    passParamsHash: {}, // 存放组件之间需要传递的参数
  });

  const init = async () => {
    const res = await Promise.all([
      fetchPageUseCompList({
        pageId,
      }),
      fetchPageConfig({
        pageId,
      }),
      getAllDataSource({
        pageId,
        tagId,
      }),
      findApiHostList({
        tagId,
      }),
      findEnvList({
        tagId,
      }),
    ]);
    let initUseCompList = res[0].data;
    initUseCompList = dealWithInitData(initUseCompList);
    if (res[1].errorCode !== 200) {
      return;
    }
    const pageConfig = res[1].data;
    const dataSourceList = res[2].data;
    const apiHostList = res[3].data;
    const envList = res[4].data;
    const { gridLayout } = pageConfig;
    let layoutParams = gridLayout || {};
    if (typeof gridLayout === 'string') {
      layoutParams = JSON.parse(gridLayout);
    }
    const { eventHash, drillDownHash } = getEventHashAndDrillDownHash(initUseCompList);
    const containerHash = getContainerHash(initUseCompList);
    let newList = updateListBysaveDeps({
      containerHash,
      initUseCompList,
    });
    setState({
      initUseCompList: newList,
      pageConfig: { ...pageConfig, gridLayout: layoutParams },
      eventHash,
      drillDownHash,
      bakInitUseCompList: initUseCompList,
      dataSourceList,
      apiHostList,
      envList,
    });
  };
  const fetchPageUseCompListApi = useCallback(async () => {
    const { errorCode, data } = await fetchPageUseCompList({
      pageId,
    });
    if (errorCode !== 200) {
      return;
    }
    setState((state) => {
      return {
        ...state,
        initUseCompList: data,
      };
    });
  }, []);

  const widthChangeFunc = useCallback((width) => {
    setState((state) => {
      const { pageConfig, initUseCompList } = state;
      if (pageConfig.type === 'widthSpread') {
        const vwList = tranformPxToVw(initUseCompList, pageConfig.pageWidth, width);
        return {
          ...state,
          initUseCompList: vwList,
        };
      }
      return state;
    });
  }, []);

  const updateClearParams = useCallback((payload) => {
    setState((state) => {
      const { initUseCompList } = state;
      const { shouldClear, resetSelf } = payload;
      const newArr = initUseCompList.map((v) => {
        if (shouldClear && shouldClear.includes(v.id)) {
          return {
            ...v,
            shouldClearParams: true, //shouldClearParams传递到子组件中，如果是true 代表需要把子组件的转台恢复的默认状态
          };
        }
        if (resetSelf === v.id) {
          return {
            ...v,
            shouldClearParams: false,
          };
        }
        return v;
      });
      return {
        ...state,
        initUseCompList: newArr,
      };
    });
  }, []);

  const updateCompsHiddenOrShow = useCallback((payload) => {
    setState((state) => {
      const { initUseCompList } = state;
      const { showComps, hiddenComps } = payload;
      const newArr = initUseCompList.map((v) => {
        if (showComps && showComps.includes(v.id)) {
          return {
            ...v,
            isHidden: 0,
          };
        }
        if (hiddenComps && hiddenComps.includes(v.id)) {
          return {
            ...v,
            isHidden: 1,
          };
        }
        return v;
      });

      return {
        ...state,
        initUseCompList: newArr,
      };
    });
  }, []);

  const updateLoading = useCallback((payload) => {
    setState((state) => {
      const { initUseCompList } = state;
      const newArr = initUseCompList.map((v) => {
        if (v.id === payload.id) {
          const data = {
            ...v,
            ...payload,
          };
          return data;
        }
        return v;
      });
      return {
        ...state,
        initUseCompList: newArr,
      };
    });
  }, []);

  const updatePassParamsHash = useCallback((payload) => {
    setState((state) => {
      const { passParamsHash } = state;
      const { ids, params } = payload;
      const newParamsHash = {
        ...passParamsHash,
      };
      for (const id of ids) {
        newParamsHash[id] = params;
      }

      return {
        ...state,
        passParamsHash: newParamsHash,
      };
    });
  }, []);

  const setLang = useCallback((lang) => {
    setState((state) => {
      return {
        ...state,
        lang,
      };
    });
    setLocaleMode(lang);
  }, []);

  const setHasData = useCallback((payload) => {
    setState((state) => {
      return {
        ...state,
        ...payload,
      };
    });
  }, []);

  const updateState = useCallback((payload) => {
    setState((state) => {
      return {
        ...state,
        ...payload,
      };
    });
  }, []);

  return {
    updateClearParams,
    updateCompsHiddenOrShow,
    updateLoading,
    updatePassParamsHash,
    widthChangeFunc,
    init,
    fetchPageUseCompListApi,
    setLang,
    setHasData,
    updateState,
    ...modalState,
  };
};

export const initFecth = async ({ pageId, tagId }) => {
  const res = await Promise.all([
    fetchPageUseCompList({
      pageId,
    }),
    fetchPageConfig({
      pageId,
    }),
    getAllDataSource({
      pageId,
      tagId,
    }),
    findApiHostList({
      tagId,
    }),
    findEnvList({
      tagId,
    }),
  ]);
  
  let initUseCompList = res[0].data;
  initUseCompList = dealWithInitData(initUseCompList);
  if (res[1].errorCode !== 200) {
    return;
  }
  const pageConfig = res[1].data;
  const dataSourceList = res[2].data;
  const apiHostList = res[3].data;
  const envList = res[4].data;
  const { gridLayout } = pageConfig;
  let layoutParams = gridLayout || {};
  if (typeof gridLayout === 'string') {
    layoutParams = JSON.parse(gridLayout);
  }
  const { eventHash, drillDownHash } = getEventHashAndDrillDownHash(initUseCompList);
  const containerHash = getContainerHash(initUseCompList);
  let newList = updateListBysaveDeps({
    containerHash,
    initUseCompList,
  });
  return {
    initUseCompList: newList,
    pageConfig: { ...pageConfig, gridLayout: layoutParams },
    eventHash,
    drillDownHash,
    bakInitUseCompList: initUseCompList,
    dataSourceList,
    apiHostList,
    envList,
  };
};
