// Default function
const Reducer = (state, action) => {
  switch (action.type) {
    case "SET_SITE_INFO":
      return setSiteInfo(state, action);
    case "ADD_ONE_SITE_INFO_TO_STATE":
      return setOneSiteInfo(state, action);
    case "UPDATE_ALL_REPOS":
      return updateAllRepos(state, action);
    case "SET_DEVICES_INFO":
      return setDevicesInfo(state, action);
    case "CHECK_USERNAME_PASSWORD":
      return checkAuth(state, action);
    case "UPDATE_ROLE":
      return updateRole(state, action);
    case "UPDATE_USER_INFO":
      return updateUserInfo(state, action);

    case "UPDATING_USER_INFO":
      return updatingUserInfo(state, action);

    default:
      return { ...state };
  }
};

// Helper functions
const updateRole = (state, action) => {
  return {
    ...state,
    userRole: action.data.userRole,
  };
};

const updatingUserInfo = (state, action) => {
  return {
    ...state,
    loadingUser: true,
  };
};

const updateUserInfo = (state, action) => {
  return {
    ...state,
    userInfo: action.data.userInfo,
    loadingUser: false,
  };
};

const setDevicesInfo = (state, action) => {
  return {
    ...state,
    devices: action.data,
  };
};

const updateAllRepos = (state, action) => {
  return {
    ...state,
    repositories: action.data,
  };
};

const setSiteInfo = (state, action) => {
  return { ...state, site_information: action.data };
};

const setOneSiteInfo = (state, action) => {
  return {
    ...state,
    site_information: state.site_information.push(action.data),
  };
};

const checkAuth = (state, action) => {
  if (action.data.username === "hey" && action.data.password === "hey")
    return { ...state, loggedIn: true };
  else return { ...state, loggedIn: false };
};

export default Reducer;
