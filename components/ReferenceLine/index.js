import React from 'react';
import styles from './index.less';

export default ({ id }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: '0px',
        top: '0px',
        borderBottom: '2px #009aff dashed',
        borderRight: '2px #009aff dashed',
        width: '100%',
        height: '100%',
        transform: 'scale(0)',
        pointerEvents: 'none',
      }}
      id={`${id}_line`}
    >
      <div className={styles.leftLine}></div>
      <div className={styles.topLine}></div>
    </div>
  );
};
