import {APP_ACTION} from '../actions/actionType';

const initialState = {
  MODULE: '',
  SCREEN: '',
  APPUSER: '',
  FULLVIEW: null,
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case APP_ACTION.INIT_MODULE:
      return {...state, MODULE: action.data};

    case APP_ACTION.APP_LOGOUT:
      return {...state, APPUSER: action.data};

    default:
      return state;
  }
};

export default AppReducer;
