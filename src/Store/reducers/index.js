import { allDataTableReducer } from './allDataTableReducer';
import { enrollmentReducer } from './enrollmentReducer';
import { formsDataReducer } from './formsDataReducer';
import { sharedSiteInfoReducer } from './sharedSiteInfoReducer';
import { userInfoReducer } from './userInfoReducer';

import { combineReducers } from 'redux';

export const allReducers = combineReducers({
  tableData: allDataTableReducer,
  enrollmentData: enrollmentReducer,
  formsData: formsDataReducer,
  sharedSiteInfo: sharedSiteInfoReducer,
  userInfo: userInfoReducer,
});
