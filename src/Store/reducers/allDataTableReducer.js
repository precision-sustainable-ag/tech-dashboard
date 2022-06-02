const defaultState = {
  valuesEdited: false,
  editModalOpen: false,
  editModalData: {},
  reassignSiteModalOpen: false,
  reassignSiteModalData: {},
  unenrollOpen: false,
  unenrollRowData: {},
  editProtocolsModalOpen: false,
  editProtocolsModalData: null,
  showNewIssueDialog: false,
  newIssueData: {},
  mapModalOpen: false,
  mapModalData: [35.763197, -78.700187],
};

// Default function
export const allDataTableReducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'SET_REASSIGN_SITE_MODAL_OPEN':
      return setReassignSiteModalOpen(state, action);
    case 'SET_REASSIGN_SITE_MODAL_DATA':
      return setReassignSiteModalData(state, action);
    case 'SET_UNENROLL_OPEN':
      return setUnenrollOpen(state, action);
    case 'SET_UNENROLL_ROWDATA':
      return setUnenrollRowData(state, action);
    case 'SET_EDIT_PROTOCOLS_MODAL_OPEN':
      return setEditProtocolsModalOpen(state, action);
    case 'SET_EDIT_PROTOCOLS_MODAL_DATA':
      return setEditProtocolsModalData(state, action);
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

const setReassignSiteModalOpen = (state, action) => {
  return {
    ...state,
    reassignSiteModalOpen: action.payload,
  };
};
const setReassignSiteModalData = (state, action) => {
  return {
    ...state,
    reassignSiteModalData: action.payload,
  };
};
const setUnenrollOpen = (state, action) => {
  return {
    ...state,
    unenrollOpen: action.payload,
  };
};
const setUnenrollRowData = (state, action) => {
  return {
    ...state,
    unenrollRowData: action.payload,
  };
};
const setEditProtocolsModalOpen = (state, action) => {
  return {
    ...state,
    editProtocolsModalOpen: action.payload,
  };
};
const setEditProtocolsModalData = (state, action) => {
  return {
    ...state,
    editProtocolsModalData: action.payload,
  };
};
const setShowNewIssueDialog = (state, action) => {
  return {
    ...state,
    showNewIssueDialog: action.payload,
  };
};
const setNewIssueData = (state, action) => {
  return {
    ...state,
    newIssueData: action.payload,
  };
};
const setMapModalOpen = (state, action) => {
  return {
    ...state,
    mapModalOpen: action.payload,
  };
};
const setMapModalData = (state, action) => {
  return {
    ...state,
    mapModalData: action.payload,
  };
};
