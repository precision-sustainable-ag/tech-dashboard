// Dependency Imports
import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
// Local Imports
import Reducer from './Reducer';

const initialState = {
  loggedIn: false,
  isDarkTheme: false,
  site_information: [],
  repositories: [],
  devices: [],
  psaForms: [],
  psassgForms: [],
  userRole: 'default',
  userInfo: {},
  loadingUser: true,
  affiliationLookup: {},
  formsData: {
    name: '',
    type: '',
    data: [],
    invalidData: [],
    validData: [],
    historyData: [],
    originalData: {
      validRecords: [],
      invalidRecords: [],
      historyRecords: [],
    },
  },
  selectedFormData: {
    slimRecord: {},
    error: [],
    uid: '',
  },
  valuesEdited: false,
  editModalOpen: false,
  editModalData: {},
  reassignSiteModalOpen: false,
  reassignSiteModalData: {},
  unenrollOpen: false,
  unenrollRowData: {},
  showNewIssueDialog: false,
  newIssueData: {},
  mapModalOpen: false,
  mapModalData: [35.763197, -78.700187],
};

// Default function
const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>;
};

Store.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
};

export const Context = createContext(initialState);
export default Store;
