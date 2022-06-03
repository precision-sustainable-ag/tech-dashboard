const defaultState = {
  timeEnd: Math.floor(Date.now() / 1000),
  deviceData: { name: '' },
  userTimezone: 'America/New_York',
  mostRecentData: [],
  showDevices: false,
  devices: [],
  devicesLoadingState: true,
  refreshDevices: false,
};

export const devicesReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_DEVICE_DATA':
      return setDeviceData(state, action);
    case 'SET_USER_TIMEZONE':
      return setUserTimezone(state, action);
    case 'SET_TIME_END':
      return setTimeEnd(state, action);
    case 'SET_MOST_RECENT_DATA':
      return setMostRecentData(state, action);
    case 'SET_SHOW_DEVICES':
      return setShowDevices(state, action);
    case 'SET_DEVICES':
      return setDevices(state, action);
    case 'SET_DEVICES_LOADING_STATE':
      return setDevicesLoadingState(state, action);
    case 'SET_REFRESH_DEVICES':
      return setRefreshDevices(state, action);
    // case 'SET_AFFILIATION_LOOKUP':
    //   return setAffiliationLookup(state, action);
    default:
      return { ...state };
  }
};

const setDeviceData = (state, action) => {
  return {
    ...state,
    user: action.payload,
  };
};

const setUserTimezone = (state, action) => {
  return {
    ...state,
    userTimezone: action.payload,
  };
};

const setTimeEnd = (state, action) => {
  return {
    ...state,
    timeEnd: action.payload,
  };
};

const setMostRecentData = (state, action) => {
  return {
    ...state,
    mostRecentData: action.payload,
  };
};

const setShowDevices = (state, action) => {
  return {
    ...state,
    showDevices: action.payload,
  };
};

const setDevices = (state, action) => {
  return {
    ...state,
    devices: action.payload,
  };
};

const setDevicesLoadingState = (state, action) => {
  return {
    ...state,
    devicesLoadingState: action.payload,
  };
};

const setRefreshDevices = (state, action) => {
  return {
    ...state,
    refreshDevices: action.payload,
  };
};

// const setUserTimezone = (state, action) => {
//   return {
//     ...state,
//     userTimezone: action.payload,
//   };
// };
