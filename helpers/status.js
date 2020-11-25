export const getDisableDraggingAndResizing = props => {
  const { isClick, isLocking } = props;
  if (isLocking) {
    return true;
  }
  if (!isClick) {
    return true;
  }
  return false;
};

export const showClickLine = props => {
  const { isClick, isLocking, nowId, mulIdArrForLine } = props;
  if (isLocking) {
    return false;
  }

  if (isClick) {
    return true;
  }
  if (mulIdArrForLine.includes(nowId)) {
    return true;
  }
  return false;
};

export const showHoverLine = props => {
  const { isHover, isLocking } = props;
  if (isLocking) {
    return false;
  }
  if (isHover) {
    return true;
  }
  // if (highlightData[nowId]) {
  //   return true;
  // }
};

export const hasLocking = props => {
  const { id, useCompList } = props;
  let locking = false;
  for (const v of useCompList) {
    if (v.id === id) {
      locking = v.isLocking;
      break;
    }
  }
  return locking;
};

export const hasHidden = props => {
  const { id, useCompList } = props;
  let isHidden = false;
  for (const v of useCompList) {
    if (v.id === id) {
      isHidden = v.isHidden;
      break;
    }
  }
  return isHidden;
};


