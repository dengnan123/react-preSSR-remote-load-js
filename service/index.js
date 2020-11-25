import API from '../helpers/api';
import { GRID_LAYOUT_DEFAULT } from '../helpers/static';
import { loadScript } from '@/helpers/screen';
import { isPrivateDeployment } from '@/config/index';
// 获取所有组件列表
export function fetchCompList(opts) {
  return API.get(`/comp`);
}

// 获取大屏对应的组件列表
export function fetchPageUseCompList(opts) {
  // if (isPrivateDeployment) {
  //   return loadScript(`./pageStatic/${opts.pageId}-pageComp.js`, 'DP_STATIC_PAGECOMP');
  // }
  return API.get(`/page-comp/${opts.pageId}`, { params: opts });
}

// 新增大屏
export function addPage(opts) {
  // 不带ID
  // 当为栅格布局时，设置一些默认属性
  const { layoutType } = opts;
  if (layoutType && layoutType === 'grid') {
    opts.gridLayout = JSON.stringify(GRID_LAYOUT_DEFAULT);
  }
  return API.post(`/page`, opts);
}

export function delPage(params) {
  return API.patch(`/page/delete`, params);
}

// 获取所有大屏列表
export function fetchPageList(opts) {
  const res = API.get(`/page`, { params: opts });
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(res);
    }, 300);
  });
}
// 获取所有大屏项目tag
export function fetchProjectList(opts) {
  const res = API.get(`/tag`, { params: opts });
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(res);
    }, 300);
  });
}

// 新增项目
export function addProject(opts) {
  // 不带ID
  return API.post(`/tag`, opts);
}

// 编辑项目
export function editProject(opts) {
  return API.patch(`/tag`, opts);
}

// 删除项目
export function deleteProject(opts) {
  return API.patch(`/tag`, opts);
}

// 给大屏新增组件
export function addCompToPage(opts) {
  return API.post(`/page-comp`, opts);
}

// 更新大屏组件
export function updatePageComp(opts) {
  return API.patch(`/page-comp`, opts);
}

// 扁平数据 批量更新
export function flatArrBatchUpdate(opts) {
  return API.patch(`/page-comp/flatArrBatchUpdate`, opts);
}
// 删除大屏组件
export function delPageComp(opts) {
  return API.patch(`/page-comp/delete`, opts);
}

// 批量删除大屏组件
export function flatArrBatchDeletePageComp(opts) {
  return API.patch(`/page-comp/flatArrBatchDelete`, opts);
}

// 获取大屏的配置
export function fetchPageConfig(opts) {
  // if (isPrivateDeployment) {
  //   return loadScript(`./pageStatic/${opts.pageId}-page.js`, 'DP_STATIC_PAGE');
  // }
  return API.get(`/page/${opts.pageId}`);
}

// 更新大屏的配置

export function updatePage(opts) {
  return API.patch(`/page`, opts);
}

// 一键使用模板

export function creatPageByTemp(opts) {
  return API.post(`/page/template`, opts);
}

// 生成大屏截图

export function generatePagePic(params) {
  return API.post(`page/screenshot`, params);
}

// 取消成组的操作

export function cancelGroup(opts) {
  return API.patch(`/page-comp/cancelGroup`, opts);
}

// 成组操作
export function doGroup(opts) {
  return API.post(`/page-comp/doGroup`, opts);
}

// 组件批量新增
export function batchAddComp(opts) {
  return API.post(`/page-comp/batchAdd`, opts);
}

// 更新所有数据
export function saveAllData(opts) {
  return API.post('page-comp/batchUpdate', opts);
}

// 把组件复制到其他大屏里面
export function addCompToOtherPage(opts) {
  return API.post(`/page-comp/addCompToOtherPage`, opts);
}

// 新增数据源
export function addDataSource(opts) {
  return API.post(`/page/dataSource`, opts);
}

// 获取大屏对应的数据源列表
export function getAllDataSource(opts) {
  // if (isPrivateDeployment) {
  //   return loadScript(`./pageStatic/${opts.pageId}-dataSource.js`, 'DP_STATIC_DATASOURCE');
  // }
  return API.get(`/page/dataSource/all`, { params: opts });
}

// 获取大屏对应的数据源列表
export function getAllDataSourceByPageId(opts) {
  return API.get(`/page/dataSource/${opts.pageId}`);
}

// 获取项目对应的数据源列表
export function getAllDataSourceByTagId(opts) {
  return API.get(`/page/dataSource/tag/${opts.tagId}`);
}

// 通过ID更新数据源
export function updateDataSourceById(opts) {
  return API.patch(`/page/dataSource`, opts);
}

// 通过ID删除数据源
export function deleteDataSourceById(opts) {
  return API.patch(`/page/dataSource/delete`, opts);
}

//获取主题列表
export function getThemeList() {
  return API.get(`/theme`);
}

// 新增主题
export function addTheme(opts) {
  return API.post(`/theme`, opts);
}

//
export function deleteTheme(params) {
  return API.patch(`/theme/delete`, params);
}

// updateTheme
export function updateTheme(opts) {
  return API.patch(`/theme`, opts);
}

// 新增主题库配置
export function addThemeConfig(opts) {
  return API.post(`/theme/config`, opts);
}

// 删除主题库配置
export function deleteThemeConfig(params) {
  return API.patch(`/theme/config/delete`, params);
}

// 获取主题库配置列表
export function getThemeConfigList(params) {
  return API.get(`/theme/config`, { params });
}

// 清空页面所有组件
export function markSureEmptyPage(params) {
  return API.patch(`/page-comp/empty`, params);
}

// 隐藏组件
export function hiddenComp(params) {
  return API.patch(`/page-comp/hidden`, params);
}

// updatePluginConfig
export function updatePluginConfig(params) {
  return '';
}

export function updatePlugin(params) {
  return '';
}

export function getPluginList(params) {
  return '';
}

export function getPluginConfigById(params) {
  return '';
}

export function getPluginById(params) {
  return '';
}

export function addPluginConfig(params) {
  return '';
}

export function addPlugin(params) {
  return '';
}

/**
 * 组件管理
 */
// 获取主题库配置列表
export function queryMenuList(params) {
  return API.get(`/pluginTag`, { params });
}

// 新增主题库 menu 列表
export function addMenuItem(params) {
  return API.post(`/pluginTag`, params);
}

// 编辑主题库 menu 列表
export function editMenuItem(params) {
  return API.patch(`/pluginTag`, params);
}

// 获取主题库对应组件
export function queryCompList(params) {
  return API.get(`/plugin`, { params });
}

// 新增组件
export function addPluginItem(params) {
  return API.post(`/plugin`, params);
}

// 修改组件显示名称
export function onChangePlugin(params) {
  return API.patch(`/plugin`, params);
}

// 组件上传图片
export function uploadImage(params) {
  return API.post(`/plugin/upload`, params);
}

// 组件上传图片
export function pluginMenu(params) {
  const res = API.get(`/pluginTag/menu`, { params });
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(res);
    }, 300);
  });
}
