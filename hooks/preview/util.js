import { filterDataFunc } from '@/helpers/screen';
export const getCondition = ({ condition = {}, parmasFilterFunc, parmasFilterFuncEs5Code }) => {
  let newCondition = {
    ...condition,
  };
  if (parmasFilterFunc) {
    newCondition = filterDataFunc({
      filterFunc: parmasFilterFunc,
      filterFuncEs5Code: parmasFilterFuncEs5Code,
      data: newCondition,
    });
  }
  return newCondition;
};

export const getHeaders = ({ cusHeaderFunc, cusHeaderFuncEs5Code }) => {
  let headers = {};
  if (cusHeaderFunc) {
    headers = filterDataFunc({
      filterFunc: cusHeaderFunc,
      filterFuncEs5Code: cusHeaderFuncEs5Code,
      data: {},
    });
  }
  return headers;
};

export const updateDataSource = ({
  setHasData,
  id,
  resData,
  dataApiUrl,
  filterFunc,
  filterFuncEs5Code,
}) => {
  const { data } = resData;
  let newData = data !== undefined ? data : resData;
  if (filterFunc) {
    // 给过滤器加上描述  这样便于debug
    const des = `获取${dataApiUrl}数据`;
    newData = filterDataFunc({
      filterFunc,
      filterFuncEs5Code,
      data: newData,
      des,
    });
  }
  setHasData &&
    setHasData({
      [id]: newData,
    });
};
