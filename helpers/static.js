
import screenfull from 'screenfull';
import { Fragment } from 'react';

import { UMD_API_HOST } from '@/config/index';

export const loadScript = (url, name) => {
  return new Promise((reslove, reject) => {
    script(url, () => {
      const target = window?.InfoBarData;
      if (target) {
        reslove(target);
      } else {
        reject();
      }
    });
  });
};

export const getCompScriptInfo = compName => {
  return {
    compLibSrc: `${UMD_API_HOST}/${compName}/lib.js`,
    loaderLibName: `${compName}Lib`,
    compConfigSrc: `${UMD_API_HOST}/${compName}/config.js`,
    loaderConfigName: `${compName}Config`,
    compStaticDataSrc: `${UMD_API_HOST}/${compName}/data.js`,
    loaderStaticDataName: `${compName}Data`,
  };
};

/**
 * 设置页面全屏
 */

export const fullPage = (id, change) => {
  const ele = document?.getElementById(id) || document?.body;
  if (screenfull.isEnabled) {
    screenfull.request(ele);
    screenfull.on('change', () => {
      if (!screenfull.isFullscreen) {
        change && change();
      }
    });
  }
};

/**
 * 栅格布局默认值
 */
export const GRID_LAYOUT_DEFAULT = {
  colsNum: 2,
  rowHeight: 50,
  marginX: 8,
  marginY: 8,
  compactType: 'null',
  // gridBgColor: '#ffffff',
  // gridBorderWidth: 1,
  // gridBorderStyle: 'solid',
  // gridBorderColor: '#ffffff',
  // paddingTop: 0,
  // paddingRight: 0,
  // paddingBottom: 0,
  // paddingLeft: 0,
  // gridBorderRadius: 0,
  // gridBoxShadow: 'none',
};

/**
 * 参考线样式
 */
export const lineStyle = {
  position: 'absolute',
  left: '0px',
  top: '0px',
  border: '2px #009aff dashed',
  width: '100%',
  height: '100%',
  transform: 'scale(0)',
};
