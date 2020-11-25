import API from '../helpers/api';

export function addTag(opts) {
  return API.post(`/tag`, opts);
}

export function updateTag(opts) {
  return API.patch(`/tag`, opts);
}

export function deleteTag(opts) {
  return API.patch(`/tag/delete`, opts);
}

export function findTagList(opts) {
  return API.get(`/tag`, { params: opts });
}
