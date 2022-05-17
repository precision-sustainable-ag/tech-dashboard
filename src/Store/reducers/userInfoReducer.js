const defaultState = {
  isDarkTheme: false,
  userid: '',
  email: '',
  state: '',
  role: '',
  permissions: '',
  states_editable: '',
  view_protected: '',
  updated: '',
  apikey: '',
  view_type: '',
  loadingUser: true,
};

export const userInfoReducer = (state = defaultState, action) => {
  // console.log(action, state);
  switch (action.type) {
    case 'UPDATE_ROLE':
      return updateRole(state, action);
    case 'UPDATE_USER_INFO':
      return updateUserInfo(state, action);
    case 'UPDATING_USER_INFO':
      return updatingUserInfo(state);
    case 'TOGGLE_IS_DARK_THEME':
      return toggleIsDarkTheme(state, action);
    default:
      return { ...state };
  }
};

const updateRole = (state, action) => {
  return {
    ...state,
    userRole: action.payload.userRole,
  };
};

const updatingUserInfo = (state) => {
  return {
    ...state,
    loadingUser: true,
  };
};

const updateUserInfo = (state, action) => {
  let newObj = action.payload;
  newObj['isDarkTheme'] = state.isDarkTheme;
  newObj['loadingUser'] = state.loadingUser;

  console.log(newObj);
  return newObj;
};

const toggleIsDarkTheme = (state, action) => {
  return {
    ...state,
    isDarkTheme: action.payload,
  };
};
