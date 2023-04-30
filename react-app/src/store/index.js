import { configureStore, combineReducers } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { applyMiddleware, compose } from 'redux';
import jhaReducer from './jhaSlice';
import singleJHAReducer from './singleJHASlice';

const rootReducer = combineReducers({
  jhas: jhaReducer,
  // singleJHA: singleJHAReducer,
});

let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

export default store;
