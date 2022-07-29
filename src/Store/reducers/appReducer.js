const defaultState = {
  snackbarData: {
    open: false,
    text: '',
    severity: 'success',
  },
  windowHeight: window.innerHeight,
  windowWidth: window.innerWidth,
};

export const appReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_SNACKBAR_DATA':
      return setSnackbarData(state, action);
    case 'SET_WINDOW_HEIGHT':
      return setWindowHeight(state, action);
    case 'SET_WINDOW_WIDTH':
      return setWindowWidth(state, action);
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

const setWindowHeight = (state, action) => {
  return {
    ...state,
    windowHeight: action.payload,
  };
};

const setWindowWidth = (state, action) => {
  return {
    ...state,
    windowWidth: action.payload,
  };
};
