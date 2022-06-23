const defaultState = {
  editDatesModalOpen: false,
  editDatesModalData: {},
  farmDatesData: [],
  farmDatesValuesEdited: false,
};

export const farmDatesReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_EDIT_DATES_MODAL_OPEN':
      return setEditDatesModalOpen(state, action);
    case 'SET_EDIT_DATES_MODAL_DATA':
      return setEditDatesModalData(state, action);
    case 'SET_FARM_DATES_DATA':
      return setFarmDatesData(state, action);
    case 'SET_FARM_DATES_VALUES_EDITED':
      return setFarmDatesValuesEdited(state, action);
    default:
      return { ...state };
  }
};

const setEditDatesModalOpen = (state, action) => {
  return {
    ...state,
    editDatesModalOpen: action.payload,
  };
};

const setEditDatesModalData = (state, action) => {
  return {
    ...state,
    editDatesModalData: action.payload,
  };
};

const setFarmDatesData = (state, action) => {
  return {
    ...state,
    farmDatesData: action.payload,
  };
};

const setFarmDatesValuesEdited = (state, action) => {
  return {
    ...state,
    farmDatesValuesEdited: action.payload,
  };
};
