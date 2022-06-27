export const setEnrollmentValuesEdited = (enrollmentValuesEdited) => {
  return {
    type: 'SET_ENROLLMENT_VALUES_EDITED',
    payload: enrollmentValuesEdited,
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
