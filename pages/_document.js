import Document, { Html, Head, Main, NextScript } from 'next/document';
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          {/* <script src="https://unpkg.com/react@16.13.1/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@16.13.1/umd/react-dom.development.js"></script> */}
          {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/antd/3.26.15/antd.js"></script> */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
