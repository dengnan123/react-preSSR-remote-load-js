import queryString from 'query-string';
import * as uuid from 'uuid';
import { message } from 'antd';
import { omit, isString, maxBy } from 'lodash';
import { updateAndBakDataByKey } from '@/helpers/arrayUtil';
import {
  // getFetchData,
  // getData,
  getCompLib,
  // getNewOtherCompParams,
  getCompItemProps,
} from '@/helpers/screen';
export const isProduction = process.env.NODE_ENV === 'production';
export const NODE_SERVER = !isProduction
  ? 'http://localhost:3000'
  : `http://${window?.location?.host}`;

// 获取元素的绝对位置坐标（像对于页面左上角）
export const getElementPagePosition = (element) => {
  //计算x坐标
  var actualLeft = element.offsetLeft;
  var current = element.offsetParent;
  while (current !== null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  } //计算y坐标
  var actualTop = element.offsetTop;
  var currentY = element.offsetParent;
  while (current !== null) {
    actualTop += currentY.offsetTop + currentY.clientTop;
    currentY = currentY.offsetParent;
  } //返回结果
  return { x: actualLeft, y: actualTop };
};

export function getParseSearch() {
  if (typeof window !== 'undefined') {
    return queryString.parse(window?.location?.search);
  }
  return {};
}

export const filterObj = (data, optArr) => {
  if (JSON.stringify(data) === '{}') {
    return data;
  }
  if (!optArr || !optArr.length) {
    return data;
  }
  let newData = {};
  const keys = Object.keys(data);
  for (const key of keys) {
    const value = data[key];
    if (optArr.includes(value)) {
      continue;
    }
    newData[key] = value;
  }
  return newData;
};

export const toTop = ({ arr, id, isSelectCompInfo }) => {
  const nowLocaltion = getIndexById(arr, id);
  if (!nowLocaltion) {
    // nowLocaltion 0 代表是顶层了
    return {
      data: isSelectCompInfo,
      newArr: arr,
    };
  }
  const { zIndex: topIndex, id: topId } = arr[0];
  const { zIndex: nowIndex } = arr[nowLocaltion];
  return getNewIndexArrAndData({
    arr,
    nowData: {
      id,
      zIndex: nowIndex,
    },
    changeData: {
      id: topId,
      zIndex: topIndex,
    },
  });
};

export const toBottom = ({ arr, id, isSelectCompInfo }) => {
  let nowLocaltion = getIndexById(arr, id);
  // 代表已经最底层了
  if (nowLocaltion === arr.length - 1) {
    return {
      data: isSelectCompInfo,
      newArr: arr,
    };
  }
  const { zIndex: bottomIndex, id: bottomId } = arr[arr.length - 1];
  const { zIndex: nowIndex } = arr[nowLocaltion];
  return getNewIndexArrAndData({
    arr,
    nowData: {
      id,
      zIndex: nowIndex,
    },
    changeData: {
      id: bottomId,
      zIndex: bottomIndex,
    },
  });
};

export const toUpperLevel = ({ id, arr, isSelectCompInfo }) => {
  const nowLocaltion = getIndexById(arr, id);
  if (!nowLocaltion) {
    return {
      data: isSelectCompInfo,
      newArr: arr,
    };
  }
  const preLocaltion = nowLocaltion - 1;
  const { zIndex: preIndex, id: preId } = arr[preLocaltion];
  const { zIndex: nowIndex } = arr[nowLocaltion];
  // let data = {};
  // let otherData = {};
  // const newArr = arr.map(v => {
  //   if (v.id === id) {
  //     data = {
  //       ...v,
  //       zIndex: preIndex,
  //     };
  //     return {
  //       ...v,
  //       zIndex: preIndex,
  //     };
  //   }
  //   if (v.id === preId) {
  //     otherData = {
  //       ...v,
  //       zIndex: nowIndex,
  //     };
  //     return otherData;
  //   }
  //   return v;
  // });
  // return {
  //   data,
  //   newArr,
  //   otherData,
  // };
  return getNewIndexArrAndData({
    arr,
    nowData: {
      id,
      zIndex: nowIndex,
    },
    changeData: {
      id: preId,
      zIndex: preIndex,
    },
  });
};

export const getIndexById = (arr, id) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return i;
    }
  }
};

export const getNewIndexArrAndData = ({ arr, nowData, changeData }) => {
  let otherData = {};
  let data = {};
  const newArr = arr.map((v) => {
    if (v.id === nowData.id) {
      data = {
        ...v,
        zIndex: changeData.zIndex,
      };
      return data;
    }
    if (v.id === changeData.id) {
      otherData = {
        ...v,
        zIndex: nowData.zIndex,
      };
      return otherData;
    }
    return v;
  });
  return {
    otherData,
    data,
    newArr,
  };
};

export const toLowLevel = ({ arr, id, isSelectCompInfo }) => {
  let nowLocaltion = getIndexById(arr, id);
  // 代表已经最底层了
  if (nowLocaltion === arr.length - 1) {
    return {
      data: isSelectCompInfo,
      newArr: arr,
    };
  }
  const nextLocaltion = nowLocaltion + 1;
  // zindex 互换
  const { zIndex: nextIndex, id: nextId } = arr[nextLocaltion];
  const { zIndex: nowIndex } = arr[nowLocaltion];
  return getNewIndexArrAndData({
    arr,
    nowData: {
      id,
      zIndex: nowIndex,
    },
    changeData: {
      id: nextId,
      zIndex: nextIndex,
    },
  });
};

export const sortArrByZindex = (arr) => {
  if (!arr) {
    return [];
  }
  return arr.sort(function (a, b) {
    return b.zIndex - a.zIndex;
  });
};

export const updateCompIndex = ({ arr, isSelectCompInfo, key }) => {
  const keyHash = {
    toLowLevel,
    toUpperLevel,
    toTop,
    toBottom,
  };
  if (!keyHash[key]) {
    throw new Error(`${key} is error`);
  }
  const { id, groupId } = isSelectCompInfo;
  if (!groupId) {
    const { data, newArr, otherData } = keyHash[key]({
      arr: sortArrByZindex(arr),
      id,
      isSelectCompInfo,
    });
    return {
      data,
      newArr: sortArrByZindex(newArr),
      otherData,
    };
  }
  const groupData = getClickInfoById(arr, groupId);

  const { child } = groupData;
  const res = keyHash[key]({ arr: sortArrByZindex(child), id, isSelectCompInfo });

  const { newArr } = updateAndBakDataByKey({
    condition: {
      id: groupId,
    },
    arr,
    data: {
      ...groupData,
      child: sortArrByZindex(res.newArr),
    },
  });
  return {
    data: res.data,
    newArr,
    otherData: res.otherData,
  };
};

export const toLevelCenter = (id, arr, { pageWidth }) => {
  let positionData = {};
  for (const v of arr) {
    if (v.id === id) {
      const { width, top } = v;
      positionData.top = top;
      positionData.left = pageWidth / 2 - width / 2;
      break;
    }
  }

  const newArr = dealWithDrapStopData(arr, positionData, id);
  const data = newArr.filter((v) => v.id === id)[0];
  return {
    data,
    newArr,
  };
};

export const toVerticalCenter = (id, arr, { pageHeight }) => {
  let positionData = {};
  for (const v of arr) {
    if (v.id === id) {
      const { height, left } = v;
      positionData.top = pageHeight / 2 - height / 2;
      positionData.left = left;
      break;
    }
  }

  const newArr = dealWithDrapStopData(arr, positionData, id);
  const data = newArr.filter((v) => v.id === id)[0];
  return {
    data,
    newArr,
  };
};

export const toLevelVerticalCenter = (id, arr, { pageHeight, pageWidth }) => {
  let positionData = {};
  for (const v of arr) {
    if (v.id === id) {
      const { height, width } = v;
      positionData.top = pageHeight / 2 - height / 2;
      positionData.left = pageWidth / 2 - width / 2;
      break;
    }
  }

  const newArr = dealWithDrapStopData(arr, positionData, id);
  const data = newArr.filter((v) => v.id === id)[0];
  return {
    data,
    newArr,
  };
};

//获取最小left
export const getMinLeft = (arr) => {
  if (!arr || !arr.length) {
    return;
  }
  const sortArr = arr.sort(function (a, b) {
    return a.left - b.left;
  });

  return sortArr[0];
};

export const getMaxLeft = (arr) => {
  if (!arr || !arr.length) {
    return;
  }
  const sortArr = arr.sort(function (a, b) {
    return a.left - b.left;
  });

  return sortArr[sortArr.length - 1];
};

//获取最小top
export const getMinTop = (arr) => {
  if (!arr || !arr.length) {
    return;
  }
  const sortArr = arr.sort(function (a, b) {
    return a.top - b.top;
  });

  return sortArr[0];
};

export const getMaxTop = (arr) => {
  if (!arr || !arr.length) {
    return;
  }
  const sortArr = arr.sort(function (a, b) {
    return a.top - b.top;
  });

  return sortArr[sortArr.length - 1];
};

// 获取最大width
export const getMaxWidth = (pageWidth, arr) => {
  if (!arr || !arr.length) {
    return;
  }

  const { left } = getMinLeft(arr);
  const minLeft = left;
  const minRight = getMinRight(pageWidth, arr);
  return pageWidth - minLeft - minRight;
};

// 获取元素中的最小 right
export const getMinRight = (pageWidth, arr) => {
  const newArr = arr
    .map((v) => {
      return {
        ...v,
        right: pageWidth - v.width - v.left,
      };
    })
    .sort(function (a, b) {
      return a.right - b.right;
    });
  return newArr[0].right;
};

// 回去元素中的最小 bottom
export const getMinBottom = (pageHeight, arr) => {
  const newArr = arr
    .map((v) => {
      return {
        ...v,
        bottom: pageHeight - v.height - v.top,
      };
    })
    .sort(function (a, b) {
      return a.bottom - b.bottom;
    });
  return newArr[0].bottom;
};

// 获取高度
export const getHeightDiff = (pageHeight, arr) => {
  if (!arr || arr.length < 2) {
    return;
  }
  const { top } = getMinTop(arr);
  const minBottom = getMinBottom(pageHeight, arr);
  const minTop = top;
  return pageHeight - minTop - minBottom;
};

// 根据多选生成最新的数据

export const generaterArrByMul = (mulArr, arr, opt) => {
  const idArr = mulArr.map((v) => v.id);
  // 获取当前最大的zindex
  const maxZindex = sortArrByZindex(arr)[0].zIndex;
  const newArr = arr.filter((v) => {
    if (idArr.includes(v.id)) {
      return false;
    }
    return true;
  });
  const { pageId } = getParseSearch();
  const newId = uuid();
  const newGroupData = {
    ...opt,
    id: newId,
    style: {},
    mockData: {},
    child: mulArr.map((v) => {
      return {
        ...v,
        groupId: newId,
      };
    }),
    compName: 'Group',
    pageId,
    zIndex: maxZindex + 1,
  };
  const resArr = [...newArr, newGroupData];
  return {
    newArr: resArr,
    newGroupData,
  };
};

// 把成组数据还原成扁平数组
export const flatArr = (arr) => {
  const dealWithChild = (child) => {
    return child
      .reduce((pre, next) => {
        const { child } = next;
        if (child && child.length) {
          return [...pre, ...dealWithChild(child)];
        }
        return [...pre, next];
      }, [])
      .filter((v) => {
        if (v.child) {
          return false;
        }
        return true;
      });
  };
  const newArr = arr
    .reduce((pre, next) => {
      const { child } = next;
      if (child && child.length) {
        return [...pre, ...dealWithChild(child)];
      }
      return [...pre, next];
    }, [])
    .filter((v) => {
      if (v.child) {
        return false;
      }
      return true;
    });

  return newArr;
};

export const reductionArr = (arr, id) => {
  const newArr = arr.reduce((pre, next) => {
    if (next.id === id) {
      let child = [];
      if (next.child && next.child.length) {
        child = next.child;
      }
      const newChild = child.map((v) => {
        return {
          ...v,
          groupId: null,
        };
      });
      return [...pre, ...newChild];
    }
    return [...pre, next];
  }, []);
  return newArr.filter((v) => v.id !== id);
};

export const flatArrAndAddGroupId = (arr) => {
  const getChild = (v) => {
    const newInfo = {
      ...v,
    };
    delete newInfo.child;
    const { child } = v;
    const newChild = child.reduce((pre, next) => {
      if (!next.child || !next.child.length) {
        return [
          ...pre,
          {
            ...next,
            groupId: v.id,
          },
        ];
      }
      const _child = getChild(next);
      const newNext = {
        ...next,
        groupId: v.id,
      };
      delete newNext.child;
      return [...pre, ..._child, newNext];
    }, []);
    return newChild;
  };

  return arr.reduce((pre, next) => {
    if (!next.child || !next.child.length) {
      return [...pre, next];
    }
    const _child = getChild(next);
    const newNext = {
      ...next,
      groupId: null,
    };
    delete newNext.child;
    return [...pre, newNext, ..._child];
  }, []);
};

// 数组中所有元素生成新的ID
export const genereteNewIdArr = (arr) => {
  const getChild = (arr) => {
    return arr.map((v, index) => {
      if (!v.child || !v.child.length) {
        return {
          ...v,
          id: uuid.v4(),
        };
      }
      const _child = getChild(v.child);
      return {
        ...v,
        id: uuid.v4(),
        child: _child,
      };
    });
  };

  return getChild(arr);
};

export const dealWithDrapStopData = (useCompList, data, id) => {
  const dealWithChild = ({
    child,
    leftDiff,
    topDiff,
    perWidth = 1,
    perHeight = 1,
    PLeft,
    PTop,
  }) => {
    return child.map((v) => {
      const newTop = v.top + topDiff;
      const newLeft = v.left + leftDiff;
      const transformY = (newTop - PTop) * perHeight;
      const translateX = (newLeft - PLeft) * perWidth;
      // 处理高度的缩放 perHeight 缩放比

      const resData = {
        ...v,
        left: Math.round(PLeft + translateX),
        top: Math.round(PTop + transformY),
        transformY: transformY,
        translateX: translateX,
        perHeight,
        perWidth,
        width: Math.round(v.width * perWidth),
        height: Math.round(v.height * perHeight),
      };

      if (!v.child) {
        return resData;
      }
      const _child = dealWithChild({
        child: v.child,
        leftDiff: Math.round(PLeft + translateX) - v.left,
        topDiff: Math.round(PTop + transformY) - v.top,
        perWidth,
        perHeight,
        PLeft: Math.round(PLeft + translateX),
        PTop: Math.round(PTop + transformY),
      });
      resData.child = _child;
      return resData;
    });
  };
  return useCompList.map((v) => {
    if (v.id === id) {
      const resData = {
        ...v,
        ...data,
      };
      const { child, left: oldLeft, top: oldTop, width: oldWidth, height: oldHeight, type } = v;
      if (child && child.length && type !== 'container') {
        const perWidth = data.width ? data.width / oldWidth : 1;
        const perHeight = data.height ? data.height / oldHeight : 1;
        const leftDiff = data.left !== undefined ? data.left - oldLeft : 0;
        const topDiff = data.top !== undefined ? data.top - oldTop : 0;
        const PLeft = data.left !== undefined ? data.left : oldLeft;
        const PTop = data.top !== undefined ? data.top : oldTop;
        const _child = dealWithChild({
          child,
          leftDiff,
          topDiff,
          PLeft,
          PTop,
          perWidth: perWidth,
          perHeight: perHeight,
        });
        resData.child = _child;
      }
      return resData;
    }
    return v;
  });
};

export const syncStyle = (useCompList, data, id) => {
  const dealWithChild = ({
    child,
    leftDiff,
    topDiff,
    perWidth = 1,
    perHeight = 1,
    PLeft,
    PTop,
  }) => {
    return child.map((v) => {
      const newTop = v.top + topDiff;
      const newLeft = v.left + leftDiff;
      const transformY = (newTop - PTop) * perHeight;
      const translateX = (newLeft - PLeft) * perWidth;
      // 处理高度的缩放 perHeight 缩放比
      const resData = {
        ...v,
        left: Math.round(PLeft + translateX),
        top: Math.round(PTop + transformY),
        transformY: transformY,
        translateX: translateX,
        perHeight,
        perWidth,
        width: Math.round(v.width * perWidth),
        height: Math.round(v.height * perHeight),
      };

      if (!v.child) {
        return resData;
      }
      const _child = dealWithChild({
        child: v.child,
        leftDiff: Math.round(PLeft + translateX) - v.left,
        topDiff: Math.round(PTop + transformY) - v.top,
        perWidth,
        perHeight,
        PLeft: Math.round(PLeft + translateX),
        PTop: Math.round(PTop + transformY),
      });
      resData.child = _child;
      return resData;
    });
  };
  return useCompList.map((v) => {
    const { child } = v;
    if (v.id === id) {
      const resData = {
        ...v,
        ...data,
      };
      const { child, left: oldLeft, top: oldTop, width: oldWidth, height: oldHeight, type } = v;
      if (child && child.length && type !== 'container') {
        const perWidth = data.width ? data.width / oldWidth : 1;
        const perHeight = data.height ? data.height / oldHeight : 1;
        const leftDiff = data.left !== undefined ? data.left - oldLeft : 0;
        const topDiff = data.top !== undefined ? data.top - oldTop : 0;
        const PLeft = data.left !== undefined ? data.left : oldLeft;
        const PTop = data.top !== undefined ? data.top : oldTop;
        const _child = dealWithChild({
          child,
          leftDiff,
          topDiff,
          PLeft,
          PTop,
          perWidth: perWidth,
          perHeight: perHeight,
        });
        resData.child = _child;
      }
      return resData;
    }
    if (child?.length) {
      const newChild = syncStyle(child, data, id);
      return {
        ...v,
        child: newChild,
      };
    }
    return v;
  });
};

export const hashDeduplication = (arr, key) => {
  let obj = {};
  return arr.filter((v) => {
    const _key = v[key];
    if (obj[_key]) {
      return false;
    }
    obj[_key] = 1;
    return true;
  });
};

export const getMockData = (mockData, staticData) => {
  if (mockData && JSON.stringify(mockData) !== '{}') {
    return mockData;
  }
  return staticData;
};

export const getBasicStyle = (style) => {
  const newSty = omit(style, 'left', 'top', 'height', 'width');
  const _sty = filterObj(newSty, ['', undefined, null]);
  return _sty;
};

export const addDataToArrObj = (pChild, props) => {
  return pChild.map((v) => {
    const { child } = v;
    const itemProps = getCompItemProps({
      ...props,
      v,
    });
    const Lib = getCompLib(itemProps);
    if (child && child.length) {
      const _child = addDataToArrObj(child, props);
      return {
        ...v,
        Lib,
        child: _child,
        data: itemProps.data,
        itemProps,
      };
    }
    return {
      ...v,
      Lib,
      data: itemProps.data,
      itemProps,
    };
  });
};

export const getTransform = ({ left, top, PLeft, PTop }) => {
  if (isString(left)) {
    // 说明是vw
    return `translate(${parseFloat(left) - parseFloat(PLeft)}vw, ${top - PTop}px)`;
  }
  return `translate(${left - PLeft}px, ${top - PTop}px)`;
};

export const getStyle = ({ left, top, PLeft, PTop, width, height, zIndex, basicStyle }) => {
  return {
    position: 'absolute',
    transform: getTransform({
      left,
      top,
      PLeft,
      PTop,
    }),
    width,
    height,
    zIndex,
    ...getBasicStyle(basicStyle),
  };
};

export const getGridTransform = ({ left, top }) => {
  if (isString(left)) {
    // 说明是vw
    return `translate(${parseFloat(left)}vw, ${top}px)`;
  }
  return `translate(${left}px, ${top}px)`;
};

export const getGridStyle = ({ left, top, width, height, zIndex, basicStyle }) => {
  return {
    position: 'absolute',
    transform: getGridTransform({
      left,
      top,
    }),
    width,
    height,
    zIndex,
    ...getBasicStyle(basicStyle),
  };
};

export const getEventHashAndDrillDownHash = (initUseCompList) => {
  let eventHash = {};
  let drillDownHash = {};
  const getInfo = (initUseCompList) => {
    for (const v of initUseCompList) {
      const { deps = [], child, isOpenDrillDown, id } = v;
      // deps 去重 先
      if (isOpenDrillDown) {
        drillDownHash[id] = v;
      }
      const _deps = Array.from(new Set(deps));
      if (!child || !child.length) {
        for (const dep of _deps) {
          if (!eventHash[dep]) {
            eventHash[dep] = [v];
          } else {
            eventHash[dep] = [...eventHash[dep], v];
          }
        }
      } else {
        getInfo(child);
      }
    }
  };
  getInfo(initUseCompList);
  return {
    eventHash,
    drillDownHash,
  };
};

export const getContainerHash = (initUseCompList) => {
  let hash = {};
  const getInfo = (initUseCompList) => {
    for (const v of initUseCompList) {
      const { containerDeps = [] } = v;
      for (const dep of containerDeps) {
        if (!hash[dep]) {
          hash[dep] = [v];
        } else {
          hash[dep] = [...hash[dep], v];
        }
      }
    }
  };
  getInfo(initUseCompList);

  return hash;
};

export const updateListBysaveDeps = ({ initUseCompList = [], containerHash }) => {
  let preId;
  for (const v of initUseCompList) {
    if (v.compName === 'Pre') {
      preId = v.id;
      break;
    }
  }

  if (!preId) {
    return initUseCompList;
  }
  const preArr = containerHash[preId];

  if (!preArr || !preArr.length) {
    return initUseCompList;
  }

  const preIdArr = preArr.map((v) => v.id);
  // 整理数据
  const filterArr = initUseCompList.filter((v) => {
    if (preIdArr.includes(v.id)) {
      return false;
    }
    return true;
  });

  return filterArr.map((v) => {
    if (v.id === preId) {
      return {
        ...v,
        child: preArr,
      };
    }
    return v;
  });
};

export const getInfoById = (arr, id) => {
  let info = {};
  for (const v of arr) {
    if (v.id === id) {
      info = {
        ...v,
      };
    }
  }
  return info;
};

export const getName = (id, useCompList = []) => {
  const filterArr = useCompList.filter((v) => v.id === id);
  if (!filterArr.length) {
    return '';
  }
  return filterArr[0].aliasName ? filterArr[0].aliasName : filterArr[0].compName;
};

export const dealWithCvData = ({ initUseCompList, id }) => {
  let cvInfo = getClickInfoById(initUseCompList, id);
  if (!cvInfo) {
    return;
  }
  cvInfo.id = uuid.v4();
  cvInfo.groupId = null;
  cvInfo.isClick = false;
  // 获取当前zindex的最高值
  let newArr = [];
  let updateArr = [];
  if (!cvInfo.child || !cvInfo.child.length) {
    newArr = [...initUseCompList, cvInfo];
    updateArr = [cvInfo];
  } else {
    const newDealWithChild = genereteNewIdArr(cvInfo.child);
    let newCvInfo = {
      ...cvInfo,
      child: newDealWithChild,
    };
    newArr = [...initUseCompList, newCvInfo];
    const _cvInfo = filterObj(newCvInfo, ['', undefined, null]);
    const dealWithArr = flatArrAndAddGroupId([_cvInfo]).map((v) => {
      return filterObj(v, ['', undefined, null]);
    });
    updateArr = dealWithArr;
  }
  return {
    newArr,
    flatArr: updateArr,
  };
};

export const getClickInfo = (data) => {
  let isSelectCompInfo = {};
  const deepArr = (data) => {
    for (let v of data) {
      if (v.isClick) {
        isSelectCompInfo = v;
        return;
      }
      const { child } = v;
      if (child && child.length) {
        deepArr(child);
      }
    }
  };
  deepArr(data);
  return isSelectCompInfo;
};

export const getClickInfoById = (data, id) => {
  let isSelectCompInfo = {};
  const deepArr = (data) => {
    for (let v of data) {
      if (v.id === id) {
        isSelectCompInfo = {
          ...v,
        };
        return;
      }
      const { child } = v;
      if (child && child.length) {
        deepArr(child);
      }
    }
  };
  deepArr(data);
  return isSelectCompInfo;
};
/**
 *
 * @param {*} data
 * 获取 当前元素及所有子元素的ID数组
 */
export const getTreeIds = (data) => {
  const { id, child } = data;
  if (!child?.length) {
    return [id];
  }
  const childIds = (childData) => {
    return childData.reduce((pre, v) => {
      const { child, id } = v;
      if (!child?.length) {
        return [...pre, id];
      }
      return [...pre, id, ...childIds(child)];
    }, []);
  };
  return [id, ...childIds(child)];
};

/**
 *
 * @param {array} data - 组件列表
 * @param {string} id - id
 * 判断当前组件是否有父元素 可能是成组组件也可能是容器组件
 */
export const clickIdHasParent = (data, id) => {
  let hasParent = true;
  for (const v of data) {
    if (v.id === id) {
      return false;
    }
  }
  return hasParent;
};

// export const getClickInfo = data => {
//   let isSelectCompInfo = {};
//   const arr = data.filter(v => v.isClick);
//   if (arr.length) {
//     isSelectCompInfo = arr[0];
//   }
//   return isSelectCompInfo;
// };

export const dealWithInitData = (initUseCompList) => {
  return initUseCompList.map((v) => {
    return {
      ...v,
      shouldClearParams: false, // 如果是true 那么对应的组件 就要把自己的内部状态恢复到默认状态
    };
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
  document?.execCommand('copy');
  document?.body?.removeChild(aux);
  if (msg == null) {
    message.success('复制成功');
  } else {
    message.success(msg);
  }
}

/**
 * 去除所有空格
 */
export function removeSpace(str) {
  if (str) {
    return str.toString().replace(/\s+/g, '');
  }
  return str;
}

/**
 * 获取组件的grid配置 layoutType
 */
export function getGridConfig(properties, config) {
  const { gridLayout, layoutType } = config || {};
  const { colsNum } = gridLayout || {};
  const isGrid = layoutType && layoutType === 'grid';
  const colsNumValue = colsNum ? colsNum : 2;
  const defaultWidth = 12 / colsNumValue;

  const gridsList = properties.map((i) => i.grid).filter((i) => !!i);
  if (!isGrid) {
    return { x: 0, y: gridsList.length, w: defaultWidth, h: 1, minW: 2 };
  }

  // let lastItemGrid = { y: 0, h: 0 }
  // 最后一行的Y
  let maxYItem = { x: 0, y: 0, h: 0 };
  if (gridsList.length) {
    maxYItem = maxBy(gridsList, (i) => {
      return i.y;
    });
  }

  // 最后一行的items
  let lastRowItems = [];
  if (gridsList.length) {
    lastRowItems = gridsList.filter((i) => {
      return maxYItem.y === i.y;
    });
  }

  let maxXItem = {};
  if (lastRowItems.length) {
    maxXItem = maxBy(lastRowItems, (i) => {
      return i.x;
    });
  }
  let maxX = 0;
  if (maxXItem) {
    const { x: itemX, w: itemW } = maxXItem;
    if (itemX + itemW + defaultWidth <= 12) {
      maxX = itemX + itemW || 0;
    }
  }

  const maxY = maxYItem.y + maxYItem.h;
  return { x: 0, y: maxY, w: defaultWidth, h: 1, minW: 2 };
}
