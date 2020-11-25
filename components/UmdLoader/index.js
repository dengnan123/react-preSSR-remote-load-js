import React, { useEffect, useState, useCallback } from 'react';

const LoadUmd = (props) => {
  const { url, name } = props;
  const [state, setState] = useState({ Component: null, error: null });
  const loaderScript = useCallback((url, name) => {}, []);

  useEffect(() => {}, [loaderScript, name, url]);

  if (state.Component) {
    return <state.Component {...(props.props || {})} />;
  }
  if (state.error) {
    return <div>{state.error}</div>;
  }
  return props.children;
};

export default LoadUmd;
