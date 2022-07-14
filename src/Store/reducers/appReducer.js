const defaultState = {
  snackbarData: {
    open: false,
    text: '',
    severity: 'success',
  },
};

export const appReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_SNACKBAR_DATA':
      return setSnackbarData(state, action);
    default:
      return { ...state };
  }
};

const setSnackbarData = (state, action) => {
  return {
    ...state,
    snackbarData: action.payload,
  };
};
