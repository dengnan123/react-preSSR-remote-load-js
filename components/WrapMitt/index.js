import emitter from '@/helpers/mitt';
import { useState, useEffect } from 'react';

export default Comp => {
  return function useName(props) {
    const {
      v: { loadingDeps },
    } = props;
    const [loading, setLoading] = useState(false);
    const [loadingOverRes, setLoadingOver] = useState(null);

    useEffect(() => {
      if (loadingDeps && loadingDeps.length) {
        // 监听数据源
        for (const apiId of loadingDeps) {
          emitter.on(`${apiId}_loading_true`, v => {
            setLoading(true);
            setLoadingOver(null);
          });
          emitter.on(`${apiId}_loading_false`, v => {
            setLoading(false);
            setLoadingOver(v);
          });
        }
      }
    }, [loadingDeps]);
    const compProps = {
      ...props,
      v: {
        ...props.v,
        loading,
        loadingOverRes,
        setLoadingOver,
      },
    };

    return <Comp {...compProps}></Comp>;
  };
};
