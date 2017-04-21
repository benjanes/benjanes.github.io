import axios from 'axios'; // use for http requests
const postsPath = process.env.NODE_ENV === 'development' ? '/content/posts' : '/dist/content/posts';

/* Action Types */
export const GET_POST = 'GET_POST';
export const SET_POST_IDX = 'SET_POST_IDX';
export const SET_PROJ_IDX = 'SET_PROJ_IDX';
export const SET_TRANSITION_DIRECTION = 'SET_TRANSITION_DIRECTION';
export const SET_SHOW_OVERLAY = 'SET_SHOW_OVERLAY';
export const SET_OVERLAY_DETAIL = 'SET_OVERLAY_DETAIL';

/* Action Creators */
export function getPost(postTitle) {
  const req = axios.get(`${postsPath}/${postTitle}.json`);
  return { type: GET_POST, payload: req };
}

export function setPostIdx(newIdx) {
  return { type: SET_POST_IDX, payload: newIdx };
}

export function setProjIdx(newIdx) {
  return { type: SET_PROJ_IDX, payload: newIdx };
}

export function setTransitionDirection(transitionDirection) {
  return { type: SET_TRANSITION_DIRECTION, payload: transitionDirection };
}

export function setShowOverlay(bool) {
	return { type: SET_SHOW_OVERLAY, payload: bool };
}

export function setOverlayDetail(detail) {
	return { type: SET_OVERLAY_DETAIL, payload: detail };
}
