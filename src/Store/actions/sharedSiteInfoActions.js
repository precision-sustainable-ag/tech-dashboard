export const setValuesEdited = (valuesEdited) => {
  return {
    type: 'SET_VALUES_EDITED',
    payload: valuesEdited,
  };
};

export const setEditModalOpen = (editModalOpen) => {
  return {
    type: 'SET_EDIT_MODAL_OPEN',
    payload: editModalOpen,
  };
};

export const setEditModalData = (editModalData) => {
  return {
    type: 'SET_EDIT_MODAL_DATA',
    payload: editModalData,
  };
};
