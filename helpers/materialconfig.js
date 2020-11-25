export const MaterialTypeName = [
  'Circle',
  'Arrow',
  'DividingLine',
  'Oval',
  'Rectangle',
  'BorderBox',
];

// 角度
export const rotateTypeName = ['Circle', 'Arrow', 'DividingLine', 'Oval', 'Rectangle'];
// 透明度
export const opacityTypeName = ['Circle', 'Arrow', 'DividingLine', 'Oval', 'Rectangle'];
// 边框宽度
export const borderWidthTypeName = ['Circle', 'DividingLine', 'Oval', 'Rectangle', 'BorderBox'];
// 边框颜色
export const borderColorTypeName = ['Circle', 'DividingLine', 'Oval', 'Rectangle', 'BorderBox'];
// 填充颜色（背景色）
export const backgroundColoryTypeName = ['Circle', 'Arrow', 'Oval', 'Rectangle', 'BorderBox'];
// 去除边框留白（padding）
export const linepaddingTypeName = ['DividingLine'];
// 四周圆角
export const borderRadiusTypeName = ['Rectangle'];
// 边框类型设置
export const borderStyleTypeName = ['BorderBox'];

// export const linepaddingTypeName = []

export const borderSettingEmus = {
  // 无
  none: 0,
  // 简单
  simple: 1,
  // 内置
  internal: 2,
  // 自定义
  customize: 3,
};

export const borderSettingStatus = {
  [borderSettingEmus.none]: 'none',
  [borderSettingEmus.simple]: 'simple',
  [borderSettingEmus.internal]: 'internal',
  [borderSettingEmus.customize]: 'customize',
};

// 边框的边框样式
export const borderStyleEmnu = {
  solid: 0,
  dotted: 1,
  double: 2,
  dashed: 3,
};
export const borderStyleStatus = {
  /* 实线 */
  [borderSettingEmus.solid]: 'solid',
  /* 点线 */ 
  [borderSettingEmus.dotted]: 'dotted',
  /* 双线 */ 
  [borderSettingEmus.double]: 'double',
  /* 虚线 */ 
  [borderSettingEmus.dashed]: 'dashed',
};
