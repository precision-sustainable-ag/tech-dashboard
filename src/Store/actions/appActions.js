export const setSnackbarData = (snackbarData) => {
  return {
    type: 'SET_SNACKBAR_DATA',
    payload: snackbarData,
  };
};

export const setWindowHeight = (height) => {
  return {
    type: 'SET_WINDOW_HEIGHT',
    payload: height,
  };
};

export const setWindowWidth = (width) => {
  return {
    type: 'SET_WINDOW_WIDTH',
    payload: width,
  };
};
