import { isObject, cloneDeep } from 'lodash';

export const flattenArrByKey = (arr = [], flatKey, saveKey) => {
  if (!arr) {
    return [];
  }
  return arr.reduce((pre, next) => {
    const child = next[flatKey];
    if (!child) {
      return [...pre, next[saveKey]];
    }
    const newArr = flattenArrByKey(child, flatKey, saveKey);
    return [...pre, next[saveKey], ...newArr];
  }, []);
};

export const updateTreeArrByKey = ({
  condition,
  arr,
  data,
  otherData = {},
  childKey = 'child',
}) => {
  if (!condition || !isObject(condition)) {
    return;
  }
  const key = Object.keys(condition)[0];
  const value = condition[key];
  const deepArr = treeArr => {
    for (let v of treeArr) {
      if (v[key] === value) {
        const newKeys = Object.keys(data);
        for (const key of newKeys) {
          v[key] = data[key];
        }
      } else {
        const newKeys = Object.keys(otherData);
        for (const key of newKeys) {
          v[key] = otherData[key];
        }
      }

      const child = v[childKey];
      if (child && child.length) {
        deepArr(child);
      }
    }
  };

  const newArr = cloneDeep(arr);
  deepArr(newArr);
  return newArr;
};

/**
 * 获取tree 的子child ID数组
 */
export const getChildIds = (arr, id, childKey = 'child') => {
  const selectData = arr.filter(v => v.id === id)[0];

  if (!selectData) {
    return [];
  }
  const children = selectData[childKey];
  return children.map(v => v.id);
};

/**
 * 更新选中组件的属性
 */
export const updateClickData = (arr, data) => {
  const deepArr = treeArr => {
    for (let v of treeArr) {
      if (v.isClick) {
        const newKeys = Object.keys(data);
        for (const key of newKeys) {
          v[key] = data[key];
        }
      }
      const { child } = v;
      if (child && child.length) {
        deepArr(child);
      }
    }
  };
  const newArr = cloneDeep(arr);
  deepArr(newArr);
  return newArr;
};

/**
 * 根据ID 更新组件 并且备份更新前的数据
 */
export const updateAndBakDataByKey = ({
  condition,
  arr,
  data,
  childKey = 'child',
  bakInfo: initBak,
}) => {
  if (!condition || !isObject(condition)) {
    return;
  }
  let bakInfo = initBak;
  const key = Object.keys(condition)[0];
  const value = condition[key];
  const deepArr = treeArr => {
    for (let v of treeArr) {
      if (v[key] === value) {
        const newKeys = Object.keys(data);
        for (const key of newKeys) {
          v[key] = data[key];
          if (!bakInfo) {
            bakInfo = {
              ...v,
            };
          }
        }
        break;
      }
      const child = v[childKey];
      if (child && child.length) {
        deepArr(child);
      }
    }
  };

  const newArr = cloneDeep(arr);
  deepArr(newArr);
  return {
    newArr,
    bakInfo,
  };
};
