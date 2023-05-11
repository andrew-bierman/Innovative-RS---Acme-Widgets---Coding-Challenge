import { configureStore, combineReducers } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { applyMiddleware, compose } from 'redux';
import jhaReducer from './jhaSlice';

// Create a root reducer, which will contain our one reducer
const rootReducer = combineReducers({
  jhas: jhaReducer,
});

let enhancer;

// Conditionally apply middleware depending on environment, for the Redux DevTools
if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

// Create a configureStore function with our rootReducer and the above enhancer
const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

export default store;
