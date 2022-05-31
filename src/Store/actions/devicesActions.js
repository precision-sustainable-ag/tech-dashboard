export const setDeviceData = (deviceData) => {
  return {
    type: 'SET_DEVICE_DATA',
    payload: deviceData,
  };
};

export const setUserTimezone = (userTimezone) => {
  return {
    type: 'SET_USER_TIMEZONE',
    payload: userTimezone,
  };
};

export const setTimeEnd = (timeEnd) => {
  return {
    type: 'SET_TIME_END',
    payload: timeEnd,
  };
};

export const setMostRecentData = (mostRecentData) => {
  return {
    type: 'SET_MOST_RECENT_DATA',
    payload: mostRecentData,
  };
};

export const setShowDevices = (showDevices) => {
  return {
    type: 'SET_SHOW_DEVICES',
    payload: showDevices,
  };
};

export const setDevices = (devices) => {
  return {
    type: 'SET_DEVICES',
    payload: devices,
  };
};

export const setDevicesLoadingState = (devices) => {
  return {
    type: 'SET_DEVICES_LOADING_STATE',
    payload: devices,
  };
};

export const setRefreshDevices = (refreshDevices) => {
  return {
    type: 'SET_REFRESH_DEVICES',
    payload: refreshDevices,
  };
};