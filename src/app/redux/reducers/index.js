import { combineReducers } from 'redux';
import AppReducer from './appReducer';

// Khai báo reducer vào đây
const rootReducers = combineReducers({
    AppInit: AppReducer
});
export default rootReducers;
