import { allDataTableReducer } from './allDataTableReducer';
import { enrollmentReducer } from './enrollmentReducer';
import { formsDataReducer } from './formsDataReducer';
import { sharedSiteInfoReducer } from './sharedSiteInfoReducer';
import { userInfoReducer } from './userInfoReducer';
import { devicesReducer } from './devicesReducer';
import { farmDatesReducer } from './farmDatesReducer';
import { appReducer } from './appReducer';
import { issueDialogueReducer } from './issueDialogueReducer';

import { combineReducers } from 'redux';

export const allReducers = combineReducers({
  tableData: allDataTableReducer,
  enrollmentData: enrollmentReducer,
  formsData: formsDataReducer,
  sharedSiteInfo: sharedSiteInfoReducer,
  userInfo: userInfoReducer,
  devicesData: devicesReducer,
  farmDatesData: farmDatesReducer,
  appData: appReducer,
  issueDialogueData: issueDialogueReducer,
});
