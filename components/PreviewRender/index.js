import React, { memo } from 'react';
import { getBasicStyle } from '@/helpers/utils';
import isEqual from 'fast-deep-equal';
import WrapMitt from '@/components/WrapMitt';
import { getCompLib, getCompItemProps, generateDivId, getCompIsHidden } from '@/helpers/screen';
import classnames from 'classnames';
import styles from './index.less';
import CompRender from '@/components/CompRender';

const getEle = props => {
  const { v, onClick, authDataSource } = props;
  const { left, top, width, height, id, zIndex, child, basicStyle } = v;
  const newProps = {
    ...props,
    isPreview: true,
  };
  const _itemProps = getCompItemProps(newProps);
  const { otherCompParams } = _itemProps;
  const newIsHidden = getCompIsHidden({ v, authDataSource, otherCompParams });
  const renderComp = () => {
    if (!child?.length) {
      return getCompLib(_itemProps);
    }
    return <CompRender {...newProps}></CompRender>;
  };
  return (
    <div
      id={generateDivId(v)}
      key={id}
      style={{
        zIndex,
        left,
        top,
        width,
        height,
        position: 'absolute',
      }}
      className={classnames(styles.rnd, newIsHidden ? styles.hidden : {})}
      onClick={() => {
        onClick && onClick(v);
      }}
    >
      <div className={styles.innerDiv} style={{ ...getBasicStyle(basicStyle) }}>
        {renderComp()}
      </div>
    </div>
  );
};

function comparator(previosProps, nextProps) {
  const { type, dataSourceId, id } = nextProps.v;
  if (type === 'container') {
    // 容器组件每次都渲染
    return;
  }
  if (!isEqual(previosProps.v, nextProps.v)) {
    return;
  }
  if (!isEqual(previosProps.authDataSource, nextProps.authDataSource)) {
    return;
  }

  const preData = {};
  const nextData = {};
  // dataSourceId 是个数组
  for (const id of dataSourceId) {
    preData[id] = previosProps.dataSource[id];
    nextData[id] = nextProps.dataSource[id];
  }

  const preOtherCompParams = previosProps.otherCompParams[id];
  const nextOtherCompParams = nextProps.otherCompParams[id];
  if (!isEqual(preData, nextData)) {
    return;
  }
  if (!isEqual(preOtherCompParams, nextOtherCompParams)) {
    return;
  }

  return true;
}

export default WrapMitt(getEle);
