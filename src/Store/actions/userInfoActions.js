export const updateRole = (userRole) => {
  return {
    type: 'UPDATE_ROLE',
    payload: userRole,
  };
};

export const updateUserInfo = (userInfo) => {
  return {
    type: 'UPDATE_USER_INFO',
    payload: userInfo,
  };
};

export const updatingUserInfo = () => {
  return {
    type: 'UPDATING_USER_INFO',
  };
};

// dark theme functions
export const toggleIsDarkTheme = (isDarkTheme) => {
  return {
    type: 'TOGGLE_IS_DARK_THEME',
    payload: isDarkTheme,
  };
};
