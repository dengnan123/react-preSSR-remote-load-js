const isProduction = process.env.NODE_ENV === 'production';
const PORD_ENVS = {
  UMI_ROUTER_BASE: 'UMI_ROUTER_BASE',
  UMI_PUBLIC_PATH: 'UMI_PUBLIC_PATH',
  isProduction,
};
const DEV_ENVS = {
  UMI_ROUTER_BASE: '/',
  UMI_PUBLIC_PATH: '/',
  isProduction,
};

module.exports = isProduction ? PORD_ENVS : DEV_ENVS;
