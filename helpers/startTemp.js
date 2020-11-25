import { saveAs } from 'file-saver';

/**
 * 获取启动脚本模板
 * @param {object} json
 */
export const getStartTemp = (json = {}) => {
  const str1 = `#!/bin/bash

echo "============== start pc ================"

pid=\`ps aux | grep -i 'screen-fe' | grep -v grep | awk {'print $2'}\`

if [ ! -n "$pid" ] ;then
  echo "No process found, go ahead as you need"
else
  kill -9 $pid
  echo "Process "$pid" were killed"
fi

DP_SCREEN_PATH=$(cd "$(dirname "$0")";pwd)
chmod 777  -R $DP_SCREEN_PATH/dist
cd $DP_SCREEN_PATH
`;

  const str2 = `npm run start:prod &
echo "============= end pc =================="`;

  let str = str1;
  /**
   * 防止打包做字符串替换
   */
  const UMI_PUBLIC_ = 'UMI_PUBLIC_';
  const startShJson = { [`${UMI_PUBLIC_}PATH`]: '.', ...json };
  str += `\n${str2}`;
  Object.keys(startShJson).forEach(key => {
    str += `\nexport ${key}=${startShJson[key]}`;
  });
  str += `\n${str2}`;

  return str;
};

/**
 * 下载启动脚本
 */
export const downloadTemp = str => {
  let blob = new Blob([str], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'start.sh');
  blob = null;
};
