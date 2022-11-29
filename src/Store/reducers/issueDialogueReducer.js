const defaultState = {
  issueDialogueData: {
    nickname: '',
    setShowNewIssueDialogue: false,
    dataType: '',
    defaultText: '',
  },
};

export const issueDialogueReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_ISSUE_DIALOGUE_DATA':
      return setIssueDialogueData(state, action);
    default:
      return { ...state };
  }
};

const setIssueDialogueData = (state, action) => {
  return {
    ...state,
    issueDialogueData: action.payload,
  };
};
