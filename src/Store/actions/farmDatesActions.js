export const setEditDatesModalOpen = (editDatesModalOpen) => {
    return {
      type: 'SET_EDIT_DATES_MODAL_OPEN',
      payload: editDatesModalOpen, 
    };
};

export const setEditDatesModalData = (editDatesModalData) => {
  return {
    type: 'SET_EDIT_DATES_MODAL_DATA',
    payload: editDatesModalData, 
  };
};