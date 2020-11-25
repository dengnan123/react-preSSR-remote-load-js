const UMD_API_HOST = 'https://3dl.dfocus.top/api/static/dist';

export const getCompScriptInfo = (compName) => {
  return {
    compLibSrc: `${UMD_API_HOST}/${compName}/lib.js`,
    loaderLibName: `${compName}Lib`,
    compConfigSrc: `${UMD_API_HOST}/${compName}/config.js`,
    loaderConfigName: `${compName}Config`,
    compStaticDataSrc: `${UMD_API_HOST}/${compName}/data.js`,
    loaderStaticDataName: `${compName}Data`,
  };
};
