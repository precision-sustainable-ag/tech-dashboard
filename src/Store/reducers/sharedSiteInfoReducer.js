const defaultState = {
  valuesEdited: false,
  editModalOpen: false,
  editModalData: {},
};

// Default function
export const sharedSiteInfoReducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'SET_VALUES_EDITED':
      return setValuesEdited(state, action);
    case 'SET_EDIT_MODAL_OPEN':
      return setEditModalOpen(state, action);
    case 'SET_EDIT_MODAL_DATA':
      return setEditModalData(state, action);
    default:
      return { ...state };
  }
};

const setValuesEdited = (state, action) => {
  return {
    ...state,
    valuesEdited: action.payload,
  };
};
const setEditModalOpen = (state, action) => {
  return {
    ...state,
    editModalOpen: action.payload,
  };
};
const setEditModalData = (state, action) => {
  return {
    ...state,
    editModalData: action.payload,
  };
};
