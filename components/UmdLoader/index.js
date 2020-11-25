import React, { useEffect, useState, useCallback } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import script from 'scriptjs';
window.PropTypes = PropTypes;
window.React = React;
window.ReactDom = ReactDom;
const LoadUmd = (props) => {
  const { url, name } = props;
  const [state, setState] = useState({ Component: null, error: null });
  const loaderScript = useCallback((url, name) => {
    script(url, () => {
      const target = window[name];
      if (target) {
        // loaded OK
        setState({
          error: null,
          Component: target.default ? target.default : target,
        });
      } else {
        // loaded fail
        setState({
          error: `Cannot load component ${name} at ${url}`,
          Component: null,
        });
      }
    });
  }, []);

  useEffect(() => {
    console.log('111111111');
    loaderScript(url, name);
  }, [loaderScript, name, url]);

  if (state.Component) {
    return <state.Component {...(props.props || {})} />;
  }
  if (state.error) {
    return <div>{state.error}</div>;
  }
  return props.children;
};

export default LoadUmd;
