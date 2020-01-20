const Reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_HELLO_WORLD":
      return updateHelloWorld(state, action);

    case "SET_SITE_INFO":
      return setSiteInfo(state, action);
    case "ADD_ONE_SITE_INFO_TO_STATE":
      return setOneSiteInfo(state, action);
    case "UPDATE_ALL_REPOS":
      return updateAllRepos(state, action);
    case "SET_DEVICES_INFO":
      return setDevicesInfo(state, action);
    default:
      return { ...state };
  }
};

const setDevicesInfo = (state, action) => {
  return {
    ...state,
    devices: action.data
  };
};

const updateAllRepos = (state, action) => {
  return {
    ...state,
    repositories: action.data
  };
};
const updateHelloWorld = (state, action) => {
  return { ...state, helloText: "hi world" };
};

const setSiteInfo = (state, action) => {
  return { ...state, site_information: action.data };
};

const setOneSiteInfo = (state, action) => {
  return {
    ...state,
    site_information: state.site_information.push(action.data)
  };
};

export default Reducer;
