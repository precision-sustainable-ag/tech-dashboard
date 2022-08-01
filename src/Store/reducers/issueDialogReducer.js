const defaultState = {
  issueDialogData: {
    nickname: '',
    setShowNewIssueDialog: false,
    dataType: '',
    defaultText: '',
  },
};

export const issueDialogReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_ISSUE_DIALOG_DATA':
      return setIssueDialogData(state, action);
    default:
      return { ...state };
  }
};

const setIssueDialogData = (state, action) => {
  return {
    ...state,
    issueDialogData: action.payload,
  };
};
