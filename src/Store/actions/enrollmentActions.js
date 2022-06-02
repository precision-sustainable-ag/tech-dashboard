export const setEnrollNewSite = (enrollNewSite) => {
  return {
    type: 'SET_ENROLL_NEW_SITE',
    payload: enrollNewSite,
  };
};

export const setSavedData = (savedData) => {
  return {
    type: 'SET_SAVED_DATA',
    payload: savedData,
  };
};

export const setEditSite = (editSite) => {
  return {
    type: 'SET_EDIT_SITE',
    payload: editSite,
  };
};

export const setEnrollmentData = (enrollmentData) => {
  return {
    type: 'SET_ENROLLMENT_DATA',
    payload: enrollmentData,
  };
};
