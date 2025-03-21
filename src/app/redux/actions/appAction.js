import {store} from '../stores';
import {APP_ACTION} from './actionType';

export const loadInitModule = data => {
  store.dispatch({
    type: APP_ACTION.INIT_MODULE,
    data,
  });
};

export const logoutUser = data => {
  store.dispatch({
    type: APP_ACTION.APP_LOGOUT,
    data,
  });
};
