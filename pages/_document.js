import Document, { Html, Head, Main, NextScript } from 'next/document';
import styles from './document.less';
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }
  render() {
    return (
      <Html>
        <Head></Head>
        <body>
          <Main />
          <div className={styles['loading']}>
            <div>
              <div className={styles['circle-loading']}></div>
              <div className={styles['text-loading']}>LOADING...</div>
              <p className={styles['text-tip-loading']}>DFOCUS 3DL</p>
            </div>
          </div>
          <NextScript />
          <script src="./AntdTest/lib.js" crossorigin></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
