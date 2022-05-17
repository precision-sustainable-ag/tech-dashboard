const defaultState = {
  name: '',
  type: '',
  data: [],
  filteredData: [],
  invalidData: [],
  validData: [],
  historyData: [],
  originalData: {
    validRecords: [],
    invalidRecords: [],
    historyRecords: [],
  },
  affiliationLookup: {},
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

const setFormsData = (state, action) => {
  return {
    ...state,
    type: action.payload.type,
    data: action.payload.validForms,
    filteredData: action.payload.validForms,
    invalidData: action.payload.invalidForms,
    validData: action.payload.validForms,
    historyData: action.payload.historyForms,
    originalData: {
      validRecords: action.payload.validForms,
      invalidRecords: action.payload.invalidForms,
      historyRecords: action.payload.historyForms,
    },
  };
};

const updateFilteredFormsData = (state, action) => {
  return {
    ...state,
    filteredData: action.payload.filteredData,
    type: action.payload.type,
  };
};

const updateFormsData = (state, action) => {
  return {
    ...state,
    data: action.payload.data,
    type: action.payload.type,
  };
};

const updateSelectedFormData = (state, action) => {
  return {
    ...state,
    selectedFormData: {
      slimRecord: action.payload.slimRecord,
      error: action.payload.error,
      uid: action.payload.uid,
    },
  };
};

const setAffiliationLookup = (state, action) => {
  return {
    ...state,
    affiliationLookup: action.payload,
  };
};
