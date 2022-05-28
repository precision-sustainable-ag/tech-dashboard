const defaultState = {

};

export const formsDataReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'UPDATE_FORM_NAME':
      return updateFormName(state, action);
    case 'SET_FORMS_DATA':
      return setFormsData(state, action);
    case 'UPDATE_FORMS_DATA':
      return updateFormsData(state, action);
    case 'UPDATE_FILTERED_FORMS_DATA':
      return updateFilteredFormsData(state, action);
    case 'UPDATE_SELECTED_FORM_DATA':
      return updateSelectedFormData(state, action);
    case 'SET_AFFILIATION_LOOKUP':
      return setAffiliationLookup(state, action);
    default:
      return { ...state };
  }
};

const updateFormName = (state, action) => {
  return {
    ...state,
    name: action.payload,
  };
};