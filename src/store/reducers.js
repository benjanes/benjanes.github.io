import { combineReducers } from 'redux';
import { GET_POST, SET_POST_IDX, SET_PROJ_IDX, SET_TRANSITION_DIRECTION } from './actions';
// import posts from '../posts/posts.json';

const initialState = {
  post: null,
  postIdx: 2,
  projIdx: 2,
  transitionDirection: null
};

function appData( state = initialState, action ) {
  switch (action.type) {
    case GET_POST:
      return Object.assign({}, state, { post: action.payload.data });
    case SET_POST_IDX:
      return Object.assign({}, state, { postIdx: action.payload });
    case SET_PROJ_IDX:
      return Object.assign({}, state, { projIdx: action.payload });
    case SET_TRANSITION_DIRECTION:
      return Object.assign({}, state, { transitionDirection: action.payload });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  appData,
});

export default rootReducer;
