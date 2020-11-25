// const withLess = require('@zeit/next-less')
// module.exports = {
//     distDir: 'build',
//     cssModules: true
//   }

const withLess = require('@zeit/next-less');
const withCSS = require('@zeit/next-css');

module.exports = withCSS(
  withLess({
    webpack(config, options) {
      return config;
    },
  }),
);
