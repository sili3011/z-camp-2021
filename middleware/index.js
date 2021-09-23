import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from './logger'

export default applyMiddleware(thunk, !__DEV__ ? logger : thunk);