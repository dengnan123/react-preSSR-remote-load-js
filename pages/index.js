
import React, { useEffect, useState } from 'react';
import fetch from 'isomorphic-fetch';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';
import echarts from 'echarts';

const vm = require('vm');

const testProps = {
  id: '29b98307-6281-4460-a202-b4b87d329816',
  compId: 123,
  pageId: 11201,
  groupId: '96b9877e-49db-4c46-9b92-462053dc4cb0',
  status: 0,
  width: 450,
  height: 300,
  left: 400,
  top: 20,
  zIndex: 2,
  compName: 'Bar',
  mapId: null,
  data: {
    categories: ['一月', '二月', '三月', '四月', '五月', '六月'],
    series: [
      {
        name: '出票量',
        type: 'bar',
        data: [1320, 1534, 3560, 1840, 3702, 2308],
      },
    ],
  },
  style: {
    grid: {
      leftType: 'px',
      topType: 'px',
      rightType: '%',
      bottomType: 'px',
      left: '50',
      top: 0,
      right: 0,
      bottom: 0,
    },
    series: {
      barGap: false,
      stack: false,
      label: {
        show: true,
        position: 'inside',
        distance: 50,
      },
      xyInverse: true,
      customizeBarWidth: false,
      notDataColor: '#0089e9',
      notDataFontSize: 20,
      notDataPadding: 20,
      barWithList: [],
      zlevels: [null, null, null],
      barWidth: 40,
      barBorderLTRadius: 1,
      barBorderRTRadius: 15,
      barBorderRBRadius: 15,
    },
    legend: {
      show: false,
      itemGap: 10,
      textStyle: {
        fontSize: 12,
        color: '#1d1818',
      },
      data: {
        icon: '',
      },
      position: 'top',
      distance: 0,
      orient: 'horizontal',
      align: 'auto',
    },
    xAxis: {
      show: true,
      type: 'category',
      inverse: false,
      boundaryGap: true,
      axisLine: {
        show: false,
        lineStyle: {
          color: '#1d1818',
          opacity: 1,
          width: 1,
          type: 'solid',
        },
      },
      nameTextStyle: {
        color: '#1d1818',
      },
      nameGap: 15,
      nameRotate: 0,
      axisLabel: {
        show: true,
        inside: false,
        rotate: 0,
        margin: 8,
        interval: 'auto',
        fontSize: 16,
        fontWeight: 'normal',
        color: 'rgba(204,215,229,1)',
      },
      axisTick: {
        show: false,
        interval: 'auto',
        inside: false,
        length: 5,
        lineStyle: {
          color: '#ffff',
          width: 1,
          type: 'solid',
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#ffff',
          width: 1,
          type: 'solid',
          opacity: 1,
        },
      },
    },
    yAxis: {
      show: true,
      type: 'value',
      inverse: false,
      boundaryGap: true,
      axisLabel: {
        show: false,
        inside: false,
        rotate: 0,
        margin: 8,
        interval: 'auto',
        fontSize: 16,
        fontWeight: 'normal',
        color: 'rgba(204,215,229,1)',
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#1d1818',
          opacity: 1,
          width: 1,
          type: 'solid',
        },
      },
      axisTick: {
        show: false,
        interval: 'auto',
        inside: false,
        length: 5,
        lineStyle: {
          color: '#ffff',
          width: 1,
          type: 'solid',
        },
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#ffff',
          width: 1,
          type: 'solid',
          opacity: 1,
        },
      },
    },
    color: ['rgba(2,169,248,1)'],
    tooltip: {
      doTimer: false,
      show: true,
      backgroundColor: 'rgba(50,50,50,0.7)',
      trigger: 'axis',
    },
  },
  dataApiUrl: null,
  autoRefresh: null,
  fetchInterval: null,
  useDataType: 'JSON',
  translateX: null,
  transformY: null,
  basicStyle: {},
  deps: [],
  cacheParamsDeps: [],
  aliasName: null,
  isLocking: null,
  clearParamsComps: [],
  isHidden: 1,
  loadingDeps: [],
  nowPage: null,
  openHighConfig: null,
  containerDeps: [],
  type: null,
  isOpenDrillDown: null,
  dataSourceName: null,
  dataSourceId: [],
  childDataSourceName: null,
  dataSourceAssociation: null,
  passParamsComps: [],
  clickCallbackFunc: null,
  hiddenComps: [],
  clickCallbackFuncEs5Code: null,
  showComps: [],
  onClickCallbackFunc: null,
  onClickCallbackFuncEs5Code: null,
  creatTime: '1605951489195',
  filterFunc: null,
  filterFuncEs5Code: null,
  updateTime: '1606276040548',
  authApiId: null,
  authFunc: null,
  authFuncEs5: null,
  openAuthFunc: 0,
  showCompsFilterFunc: null,
  showCompsFilterFuncEs5Code: null,
  openShowCompsFilterFunc: 0,
  hiddenCompsFilterFunc: null,
  hiddenCompsFilterFuncEs5Code: null,
  openHiddenCompsFilterFunc: null,
  openDepsFilterFunc: 0,
  moveCallbackFuncEs5Code: null,
  moveCallbackFunc: null,
  depsFilterFunc: null,
  depsFilterFuncEs5Code: null,
  clearApiDeps: [],
  openClearApiDepsFunc: 0,
  clearApiDepsFunc: null,
  clearApiDepsFuncEs5Code: null,
  grid: {
    x: 0,
    y: 1,
    w: 6,
    h: 1,
    minW: 2,
  },
};
export default function Home({ MyComponentStr }) {
  const [MyComponent, setComp] = useState();
  useEffect(() => {
    const sandbox = {
      React: React,
      ReactDOM: ReactDOM,
      PropTypes: PropTypes,
      echarts: echarts,
      MyComponent: null,
      self: {},
    };
    vm.runInNewContext(MyComponentStr, sandbox);
    const MyComponent = sandbox.BarLib || sandbox.BarLib.default;
    setComp(<MyComponent {...testProps} />);
  }, []);

  return (
    <div>
      <p>Hello from Next.js</p>
      {MyComponent}
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch('https://3dl.dfocus.top/api/static/dist/Bar/lib.js');
  const script = await res.text();
  return {
    props: {
      MyComponentStr: script,
    },
  };
}
