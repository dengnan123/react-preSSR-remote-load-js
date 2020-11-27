import React, { useRef, useCallback, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';
import echarts from 'echarts'
import { API_HOST } from '@/config/index';
import styles from './index.less';
import { withSize } from 'react-sizeme';
import OnlyPre from '@/components/PreviewRender';
import fetch from 'isomorphic-fetch';
import Promise from 'bluebird';
import * as antd from 'antd';
import moment from 'moment';
import '../node_modules/antd/dist/antd.min.css';
// import PreviewGridRender from '@/components/PreviewGridRender';
import { useModal, initFecth } from '@/hooks/useModal';
import {
  useTra,
  useInit,
  useLoading,
  useWhenWidthChange,
  useRegistInterval,
  onChange,
  onClick,
  useHotUpdate,
  useInitFetchData,
  useDoPageShell,
  useMoveEvent,
  useLoadFuncToWindow,
  useSetBodyStyle,
  useSocket,
} from '@/hooks/preview';
import { IsPC } from '@/helpers/env';

const vm = require('vm');

function App(props) {
  const preview = useModal();
  const {
    init,
    widthChangeFunc,
    setHasData,
    lang,
    updateClearParams,
    updatePassParamsHash,
    passParamsHash,
    fetchPageUseCompListApi,
    updateCompsHiddenOrShow,
    updateLoading,
    setLang,
    // apiHostList,
    // envList,
    // dataSourceList,
    // initUseCompList: data,
    // pageConfig,
    // eventHash,
  } = preview;
  const {
    size: { width },
    envList = [],
    apiHostList = [],
    dataSourceList = [],
    initUseCompList: data = [],
    pageConfig = {},
    eventHash = {},
    jsArr,
  } = props;

  if (typeof window !== undefined) {
    if (!window.hasLoadJs) {
      // const sandbox = {
      //   React: React,
      //   ReactDOM: ReactDOM,
      //   PropTypes: PropTypes,
      //   MyComponent: null,
      //   self: {},
      // };
      // for (const v of jsArr) {
      //   const { MyComponentStr } = v;
      //   vm.runInNewContext(MyComponentStr, sandbox);
      //   window[v.key] = sandbox[v.key] || sandbox[v.key].default;
      // }
      window.React = React
      window.ReactDOM = ReactDOM
      window.PropTypes = PropTypes
      window.moment = moment;
      window.antd = antd;
      window.echarts  = echarts
      window.hasLoadJs = true;
    }
  }

  useSetBodyStyle(pageConfig.type);

  // 页面初始化后，执行页面插件
  useDoPageShell({ pageConfig });

  // 处理页面body样式
  useLoadFuncToWindow({
    setLang,
  });

  const idParamsRef = useRef({});
  const cacheParamsRef = useRef({});
  // emitter 逻辑
  // 热更新逻辑
  useHotUpdate({ pageConfig, fetchPageUseCompList: fetchPageUseCompListApi });
  // useInit({ init });
  useInitFetchData({ dataSourceList, setHasData, apiHostList, envList });
  const { tra } = useTra({ pageConfig, data });
  const { showLoading } = useLoading({ propsList: data });
  useWhenWidthChange({ widthChangeFunc, width, pageConfig });
  useRegistInterval({
    dataSourceList,
    setHasData,
    idParamsRef,
    cacheParamsRef,
    envList,
    apiHostList,
  });
  useMoveEvent(data);
  const _onChange = useCallback(
    (compData) => {
      onChange({
        data: compData,
        eventHash,
        idParamsRef,
        setHasData,
        dataSourceList,
        cacheParamsRef,
        updateClearParams,
        updatePassParamsHash,
        updateCompsHiddenOrShow,
        updateLoading,
        useCompList: data,
        apiHostList,
        envList,
      });
    },
    [
      eventHash,
      setHasData,
      updateCompsHiddenOrShow,
      dataSourceList,
      updateClearParams,
      updatePassParamsHash,
      updateLoading,
      data,
      apiHostList,
      envList,
    ],
  );

  const _onClick = useCallback((data) => {
    onClick({ data });
  }, []);

  /**
   * socket逻辑
   */
  useSocket({
    dataSourceList,
    setHasData,
    idParamsRef,
    cacheParamsRef,
    envList,
    apiHostList,
  });

  let styleProps = {
    width,
    backgroundColor: pageConfig.bgc,
    backgroundImage: `url(${API_HOST}/static/${pageConfig.id}/${pageConfig.bgi})`,
    backgroundSize: 'cover',
  };
  if (pageConfig.type === 'allSpread') {
    styleProps = {
      ...styleProps,
      transform: tra,
      width: pageConfig.pageWidth,
      height: pageConfig.pageHeight,
    };
  }
  if (pageConfig.type === 'default') {
    styleProps = {
      ...styleProps,
      width: pageConfig.pageWidth,
      height: pageConfig.pageHeight,
    };
  }

  const isGridLayout = pageConfig.layoutType && pageConfig.layoutType === 'grid';
  const commonProps = {
    onChange: _onChange,
    onClick: _onClick,
    updateCompsHiddenOrShow,
    dataSource: preview,
    lang,
    data,
    pageConfig,
    otherCompParams: passParamsHash,
  };
  return (
    <>
      {IsPC() ? (
        <div style={{ fontSize: 15, textAlign: 'center' }}>暂不支持手机端查看 请在电脑端打开！</div>
      ) : (
        <div
          style={{
            fontFamily: 'myFont',
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: showLoading ? 'hidden' : null,
          }}
        >
          <div className={styles.PreviewDiv} style={styleProps} id="containerDiv">
            {data.map((v) => {
              const _props = {
                ...commonProps,
                v,
                authDataSource: preview[v.authApiId], // 组件关联的数据权限数据源
              };
              return <OnlyPre {..._props} key={v.id}></OnlyPre>;
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default withSize()(App);

export async function getStaticProps(props) {
  const data = await initFecth({
    pageId: 11287,
    tagId: 12,
  });
  // const newRes = await Promise.map(
  //   data.initUseCompList,
  //   async (v) => {
  //     const res = await fetch(`https://3dl.dfocus.top/api/static/dist/${v.compName}/lib.js`);
  //     const MyComponentStr = await res.text();
  //     return {
  //       ...v,
  //       MyComponentStr,
  //     };
  //   },
  //   {
  //     concurrency: 10,
  //   },
  // );
  // console.log('newResnewRes', newRes.length);
  return {
    props: {
      ...data,

    },
  };
}
