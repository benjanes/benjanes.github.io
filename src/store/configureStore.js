import { applyMiddleware, createStore, combineReducers } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createLogger from 'redux-logger';
// allows easy resolution of http request promises when supplying them
// as an action payload to a reducer function
import reduxPromise from 'redux-promise';
import reduxThunk from 'redux-thunk';
import rootReducer from './reducers';

export default function configureStore(initialState, browserHistory) {
  const logger = createLogger({
    predicate: () => process.env.NODE_ENV === 'development', // only log in dev
    collapsed: true
  });

  const routeMiddleware = routerMiddleware(browserHistory);

  const store = applyMiddleware(logger, reduxPromise, reduxThunk, routeMiddleware)(createStore)(
    combineReducers(Object.assign({}, { rootState: rootReducer }, { routing: routerReducer })),
    initialState
  );

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = rootReducer.default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
