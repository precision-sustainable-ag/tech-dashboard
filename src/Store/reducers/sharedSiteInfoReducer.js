const defaultState = {
  valuesEdited: false,
  editLocationModalOpen: false,
  editLocationModalData: {},
};

// Default function
export const sharedSiteInfoReducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'SET_VALUES_EDITED':
      return setValuesEdited(state, action);
    case 'SET_EDIT_LOCATION_MODAL_OPEN':
      return setEditLocationModalOpen(state, action);
    case 'SET_EDIT_LOCATION_MODAL_DATA':
      return setEditLocationModalData(state, action);
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
const setEditLocationModalOpen = (state, action) => {
  return {
    ...state,
    editLocationModalOpen: action.payload,
  };
};
const setEditLocationModalData = (state, action) => {
  return {
    ...state,
    editLocationModalData: action.payload,
  };
};
