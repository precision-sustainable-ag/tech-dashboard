const defaultState = {
  enrollNewSite: false,
  savedData: false,
  editSite: false,
  data: {
    year: 'none',
    affiliation: 'none',
    growerInfo: {
      collaborationStatus: 'University',
      producerId: '',
      phone: '',
      lastName: '',
      email: '',
      sites: [],
    },
  },
};

// Default function
export const enrollmentReducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'SET_ENROLL_NEW_SITE':
      return setEnrollNewSite(state, action);
    case 'SET_SAVED_DATA':
      return setSavedData(state, action);
    case 'SET_EDIT_SITE':
      return setEditSite(state, action);
    case 'SET_ENROLLMENT_DATA':
      return setEnrollmentData(state, action);
    default:
      return { ...state };
  }
};

const setEnrollNewSite = (state, action) => {
  return {
    ...state,
    enrollNewSite: action.payload,
  };
};

const setSavedData = (state, action) => {
  return {
    ...state,
    savedData: action.payload,
  };
};

const setEditSite = (state, action) => {
  return {
    ...state,
    editSite: action.payload,
  };
};

const setEnrollmentData = (state, action) => {
  return {
    ...state,
    data: action.payload,
  };
};
