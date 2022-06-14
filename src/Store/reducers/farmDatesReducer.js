
const defaultState = {
    editDatesModalOpen: false,
    editDatesModalData: {},
};
  
  export const farmDatesReducer = (state = defaultState, action) => {
    switch (action.type) {
      case 'SET_EDIT_DATES_MODAL_OPEN':
        return setEditDatesModalOpen(state, action);
      case 'SET_EDIT_DATES_MODAL_DATA':
        return setEditDatesModalData(state, action);
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