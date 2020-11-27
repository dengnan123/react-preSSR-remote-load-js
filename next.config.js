// const withLess = require('@zeit/next-less')
// module.exports = {
//     distDir: 'build',
//     cssModules: true
//   }
const isProd = process.env.NODE_ENV === 'production';
const withLess = require('@zeit/next-less');
const withCSS = require('@zeit/next-css');
const path  = require('path')

module.exports = withCSS(
  withLess({
    webpack(config, options) {
      options.config.assetPrefix = isProd ? '/ssr' : '';
      // if (config.externals) {
      //   const includes = [/antd/];
      //   config.externals = config.externals.map((external) => {
      //     if (typeof external !== 'function') return external;
      //     return (ctx, req, cb) => {
      //       return includes.find((include) =>
      //         req.startsWith('.') ? include.test(path.resolve(ctx, req)) : include.test(req),
      //       )
      //         ? cb()
      //         : external(ctx, req, cb);
      //     };
      //   });
      // }
      return config;
    },
  }),
);
