import { useEffect } from 'react';
import { useAsyncFn, useEffectOnce } from 'react-use';
import { isFunction } from 'lodash';
import { addApiHost, updateApiHost } from '@/service/apiHost';

export const useAddApiHost = () => {
  const [state, addFunc] = useAsyncFn(
    async v => {
      const response = await addApiHost(v);
      return response;
    },
    [addApiHost],
  );
  return {
    addFunc,
    state,
    addLoading: state.loading,
  };
};

export const useUpdateApiHost = () => {
  const [state, updateFunc] = useAsyncFn(
    async v => {
      const response = await updateApiHost(v);
      return response;
    },
    [addApiHost],
  );
  return {
    updateFunc,
    state,
    updateLoading: state.loading,
  };
};

export const useDoApi = (apiFunc, initFetch = false, params = {}) => {
  const [state, doApi] = useAsyncFn(
    async v => {
      if (!isFunction(apiFunc)) {
        throw new Error('apiFunc must a  function');
      }
      const response = await apiFunc(v);
      return response;
    },
    [apiFunc],
  );
  useEffectOnce(() => {
    if (initFetch) {
      doApi(params);
    }
  });
  return {
    doApi,
    state,
  };
};

// export const useDoArrApi = (apiFuncArr, initFetch = false, Arrparams = {}) => {
//   for (let apiFunc of apiFuncArr) {
//     if (!isFunction(apiFunc)) {
//       throw new Error('apiFunc must a  function');
//     }
//   }
//   const [state, doApi] = useAsyncFn(
//     async v => {

//       const response = await Promise.all(apiFuncArr);

//       return response;
//     },
//     [apiFuncArr],
//   );
//   useEffectOnce(() => {
//     if (initFetch) {
//       doApi(params);
//     }
//   });
//   return {
//     doApi,
//     state,
//   };
// };
