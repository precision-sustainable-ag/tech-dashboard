export const setValuesEdited = (valuesEdited) => {
  return {
    type: 'SET_VALUES_EDITED',
    payload: valuesEdited,
  };
};

export const setEditLocationModalOpen = (editLocationModalOpen) => {
  return {
    type: 'SET_EDIT_LOCATION_MODAL_OPEN',
    payload: editLocationModalOpen,
  };
};

export const setEditLocationModalData = (editLocationModalData) => {
  return {
    type: 'SET_EDIT_LOCATION_MODAL_DATA',
    payload: editLocationModalData,
  };
};
