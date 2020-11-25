import { API_HOST } from '@/config/index';
export const addFont = myfont => {
  if (isIE()) {
    return;
  }
  const _addFont = new FontFace('myFont', `url(${API_HOST}/static/fonts/${myfont})`);
  _addFont
    .load()
    .then(loaded_face => {
      document?.fonts?.add(loaded_face);
    })
    .catch(error => {
      console.log(error);
    });
};

export function isIE() {
  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
    return true;
  } else {
    return false;
  }
}
