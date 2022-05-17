const defaultState = {
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
export const allDataTableReducer = (state = defaultState, action) => {
  switch (action.type) {
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

// const setValuesEdited = (state, action) => {
//   state.tableData.valuesEdited = action.payload;
// };
// const setEditModalOpen = (state, action) => {
//   state.tableData.editModalOpen = action.payload;
// };
// const setEditModalData = (state, action) => {
//   state.tableData.editModalData = action.payload;
// };
// const setReassignSiteModalOpen = (state, action) => {
//   state.tableData.reassignSiteModalOpen = action.payload;
// };
// const setReassignSiteModalData = (state, action) => {
//   state.tableData.reassignSiteModalData = action.payload;
// };
// const setUnenrollOpen = (state, action) => {
//   state.tableData.unenrollOpen = action.payload;
// };
// const setUnenrollRowData = (state, action) => {
//   state.tableData.unenrollRowData = action.payload;
// };
// const setShowNewIssueDialog = (state, action) => {
//   state.tableData.showNewIssueDialog = action.payload;
// };
// const setNewIssueData = (state, action) => {
//   state.tableData.newIssueData = action.payload;
// };
// const setMapModalOpen = (state, action) => {
//   state.tableData.mapModalOpen = action.payload;
// };
// const setMapModalData = (state, action) => {
//   state.tableData.mapModalData = action.payload;
// };

const setValuesEdited = (state, action) => {
  return {
    ...state,
    valuesEdited: action.payload,
  };
};
const setEditModalOpen = (state, action) => {
  console.log('modal');
  return {
    ...state,
    editModalOpen: action.payload,
  };
};
const setEditModalData = (state, action) => {
  //   console.log(action.payload.valuesEdited);
  return {
    ...state,
    editModalData: action.payload,
  };
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
const setShowNewIssueDialog = (state, action) => {
  console.log('first');
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
