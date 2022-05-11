// Default function
const Reducer = (state, action) => {
  switch (action.type) {
    case 'SET_SITE_INFO':
      return setSiteInfo(state, action);
    case 'ADD_ONE_SITE_INFO_TO_STATE':
      return setOneSiteInfo(state, action);
    case 'UPDATE_ALL_REPOS':
      return updateAllRepos(state, action);
    case 'SET_DEVICES_INFO':
      return setDevicesInfo(state, action);
    case 'CHECK_USERNAME_PASSWORD':
      return checkAuth(state, action);
    case 'UPDATE_ROLE':
      return updateRole(state, action);
    case 'UPDATE_USER_INFO':
      return updateUserInfo(state, action);
    case 'UPDATING_USER_INFO':
      return updatingUserInfo(state);
    case 'UPDATE_FORM_NAME':
      return updateFormName(state, action);
    case 'SET_FORMS_DATA':
      return setFormData(state, action);
    case 'UPDATE_FORMS_DATA':
      return updateFormsData(state, action);
    case 'UPDATE_FILTERED_FORMS_DATA':
      return updateFilteredFormsData(state, action);
    case 'UPDATE_SELECTED_FORM_DATA':
      return updateSelectedFormData(state, action);
    case 'SET_AFFILIATION_LOOKUP':
      return setAffiliationLookup(state, action);
    case 'UPDATE_SNACKBAR_DATA':
      return updateSnackbarData(state, action);
    case 'TOGGLE_IS_DARK_THEME':
      return toggleIsDarkTheme(state, action);
    case 'SET_VALUES_EDITED':
      return setValuesEdited(state, action);
    case 'SET_EDIT_MODAL_OPEN':
      return setEditModalOpen(state, action);
    case 'SET_EDIT_MODAL_DATA':
      return setEditModalData(state, action);
    case 'SET_REASSIGN_SITE_MODAL_OPEN':
      return setReassignSiteModalOpen(state, action);
    case 'SET_REASSIGN_SITE_MODAL_DATA':
      return setReassignSiteModalData(state, action);
    case 'SET_UNENROLL_OPEN':
      return setUnenrollOpen(state, action);
    case 'SET_UNENROLL_ROWDATA':
      return setUnenrollRowData(state, action);
    case 'SET_SHOW_NEW_ISSUE_DIALOG':
      return setShowNewIssueDialog(state, action);
    case 'SET_NEW_ISSUE_DATA':
      return setNewIssueData(state, action);
    case 'SET_MAP_MODAL_OPEN':
      return setMapModalOpen(state, action);
    case 'SET_MAP_MODAL_DATA':
      return setMapModalData(state, action);
    default:
      return { ...state };
  }
};

// Helper functions
const updateRole = (state, action) => {
  return {
    ...state,
    userRole: action.data.userRole,
  };
};

const updatingUserInfo = (state) => {
  return {
    ...state,
    loadingUser: true,
  };
};

const updateUserInfo = (state, action) => {
  return {
    ...state,
    userInfo: action.data.userInfo,
    loadingUser: false,
  };
};

const setDevicesInfo = (state, action) => {
  return {
    ...state,
    devices: action.data,
  };
};

const updateAllRepos = (state, action) => {
  return {
    ...state,
    repositories: action.data,
  };
};

const setSiteInfo = (state, action) => {
  return { ...state, site_information: action.data };
};

const setOneSiteInfo = (state, action) => {
  return {
    ...state,
    site_information: state.site_information.push(action.data),
  };
};

const checkAuth = (state, action) => {
  if (action.data.username === 'hey' && action.data.password === 'hey')
    return { ...state, loggedIn: true };
  else return { ...state, loggedIn: false };
};

const updateFormName = (state, action) => {
  return {
    ...state,
    formsData: {
      ...state.formsData,
      name: action.data.formName,
    },
  };
};

const setFormData = (state, action) => {
  return {
    ...state,
    formsData: {
      ...state.formsData,
      type: action.data.formType,
      data: action.data.validFilteredRecords,
      invalidData: action.data.invalidFilteredRecords,
      validData: action.data.validFilteredRecords,
      historyData: action.data.historyFilteredRecords,
      originalData: {
        validRecords: action.data.validFilteredRecords,
        invalidRecords: action.data.invalidFilteredRecords,
        historyRecords: action.data.historyFilteredRecords,
      },
    },
  };
};

const updateFilteredFormsData = (state, action) => {
  return {
    ...state,
    formsData: {
      ...state.formsData,
      filteredData: action.data.formsData,
      type: action.data.formType,
    },
  };
};

const updateFormsData = (state, action) => {
  return {
    ...state,
    formsData: {
      ...state.formsData,
      data: action.data.formsData,
      type: action.data.formType,
    },
  };
};

const updateSelectedFormData = (state, action) => {
  return {
    ...state,
    selectedFormData: {
      slimRecord: action.data.formSlimRecord,
      error: action.data.formError,
      uid: action.data.formUid,
    },
  };
};

const setAffiliationLookup = (state, action) => {
  return {
    ...state,
    affiliationLookup: action.data.affiliationLookup,
  };
};

const updateSnackbarData = (state, action) => {
  return {
    ...state,
    snackbarData: {
      open: action.data.snackbarOpen,
      text: action.data.snackbarText,
      severity: action.data.snackbarSeverity,
    },
  };
};

const toggleIsDarkTheme = (state, action) => {
  return {
    ...state,
    isDarkTheme: action.data.isDarkTheme,
  };
};

const setValuesEdited = (state, action) => {
  return {
    ...state,
    valuesEdited: action.data.valuesEdited,
  };
};
const setEditModalOpen = (state, action) => {
  console.log("modal");
  return {
    ...state,
    editModalOpen: action.data.editModalOpen,
  };
};
const setEditModalData = (state, action) => {
  console.log(action.data.valuesEdited);
  return {
    ...state,
    editModalData: action.data.editModalData,
  };
};
const setReassignSiteModalOpen = (state, action) => {
  return {
    ...state,
    reassignSiteModalOpen: action.data.reassignSiteModalOpen,
  };
};
const setReassignSiteModalData = (state, action) => {
  return {
    ...state,
    reassignSiteModalData: action.data.reassignSiteModalData,
  };
};
const setUnenrollOpen = (state, action) => {
  return {
    ...state,
    unenrollOpen: action.data.unenrollOpen,
  };
};
const setUnenrollRowData = (state, action) => {
  return {
    ...state,
    unenrollRowData: action.data.unenrollRowData,
  };
};
const setShowNewIssueDialog = (state, action) => {
  console.log("first");
  return {
    ...state,
    showNewIssueDialog: action.data.showNewIssueDialog,
  };
};
const setNewIssueData = (state, action) => {
  return {
    ...state,
    newIssueData: action.data.newIssueData,
  };
};
const setMapModalOpen = (state, action) => {
  return {
    ...state,
    mapModalOpen: action.data.mapModalOpen,
  };
};
const setMapModalData = (state, action) => {
  return {
    ...state,
    mapModalData: action.data.mapModalData,
  };
};

export default Reducer;
