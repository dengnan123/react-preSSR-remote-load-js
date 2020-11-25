import React from 'react';

export default class ErrorWrap extends React.Component {
  state = {
    hasError: false,
  };
  componentDidMount() {
    // Sentry.init({
    //   dsn: 'https://2619860ff5174353bf70878de962156b@o419482.ingest.sentry.io/5333379',
    //   debug: true,
    // });
    window.onerror = error => {
      console.log(' window.onerror', error);
      this.setState({
        hasError: true,
      });
      // Sentry.captureException(error);
    };
  }
  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.log('componentDidCatch', error, errorInfo);
    this.setState({
      hasError: true,
    });
    // Sentry.captureException(error);
  }
  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return <div>组件渲染报错</div>;
    }
    return children;
  }
}
