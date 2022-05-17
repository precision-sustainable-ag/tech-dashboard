import { allDataTableReducer } from './allDataTableReducer';
import { formsDataReducer } from './formsDataReducer';
import { userInfoReducer } from './userInfoReducer';

import { combineReducers } from 'redux';

export const allReducers = combineReducers({
  tableData: allDataTableReducer,
  formsData: formsDataReducer,
  userInfo: userInfoReducer,
});
