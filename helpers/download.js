import API from '../helpers/api/noUrl';
import { message } from 'antd';
import { saveAs } from 'file-saver';

export function downLoadXlsx(obj, fileName) {
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    //IE浏览器保存文本框内容
    var filename = fileName;
    var type = 'text/plain; charset=UTF-8';

    var blob =
      typeof File === 'function'
        ? new File([obj], filename, { type: type })
        : new Blob([obj], { type: type });
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      var URL = window?.URL || window?.webkitURL;
      var downloadUrl = URL.createObjectURL(blob);
      if (filename) {
        var a = document?.createElement('a');
        if (typeof a.download === 'undefined') {
          window?.location = downloadUrl;
        } else {
          a.href = downloadUrl;
          a.download = filename;
          document?.body?.appendChild(a);
          a.click();
          setTimeout(() => {
            document?.body.removeChild(a);
          }, 1000);
        }
      } else {
        window?.location = downloadUrl;
      }
    }
  } else {
    let blob = obj;
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function(e) {
      let link = document?.createElement('a');
      link.download = fileName;
      link.href = e.target.result;
      document?.body?.appendChild(link);
      link.click();
      setTimeout(() => {
        document?.body?.removeChild(link);
      }, 1000);
    };
  }
}

export const download = async ({ baseUrl, apiRoute, condition }) => {
  const res = await API(baseUrl).get(`/booking/desk/asyncExport/download`, {
    params: {
      ...condition,
      fileName: '工位列表-20200527115138.xls',
      filePath: '/tmp/excel/',
    },
    responseType: 'blob',
  });
  downLoadXlsx(res, 'test.xlsx');
};

export const postDownload = async ({ baseUrl, apiRoute, condition }) => {
  try {
    const res = await API(baseUrl).post(apiRoute, condition);
    console.log('resresres', res);
    const { size } = res;
    if (size === 213) {
      message.error('下载失败');
      return;
    }
    // downLoadXlsx(res, 'json.zip');
    saveAs(res, 'df-visual-big-screen-building-system.zip');
  } catch (err) {
    console.log('postDownload error', err.message);
  }
};
