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
