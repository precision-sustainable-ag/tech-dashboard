const defaultState = {
  windowHeight: window.innerHeight,
  windowWidth: window.innerWidth,
};

export const userWindowReducer = (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'SET_WINDOW_HEIGHT':
      return setWindowHeight(state, action);
    case 'SET_WINDOW_WIDTH':
      return setWindowWidth(state, action);
    default:
      return { ...state };
  }
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
