import React, { memo, useEffect, useState } from 'react';
import ErrorWrap from '../ErrorWrap';
import { getCompScriptInfo } from '../../helpers/static';
import fetch from 'isomorphic-fetch';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';
import echarts from 'echarts';
const vm = require('vm');

const PurCompLib = (props) => {
  const { compName, id, MyComponentStr } = props;
  const { compLibSrc, loaderLibName } = getCompScriptInfo(compName);
  const [MyComponent, setComp] = useState();
  useEffect(() => {
    const sandbox = {
      React: React,
      ReactDOM: ReactDOM,
      PropTypes: PropTypes,
      echarts: echarts,
      MyComponent: null,
      self: {},
    };
    vm.runInNewContext(MyComponentStr, sandbox);
    const MyComponent = sandbox[loaderLibName] || sandbox[loaderLibName].default;
    setComp(<MyComponent {...props} />);
  }, [MyComponentStr]);

  return (
    <ErrorWrap>
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
        id={id}
      >
        {MyComponent}
      </div>
    </ErrorWrap>
  );
};

export default PurCompLib;
