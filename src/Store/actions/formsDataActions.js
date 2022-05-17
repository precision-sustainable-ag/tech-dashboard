// FormsData functions
export const updateFormName = (formName) => {
  return {
    type: 'UPDATE_FORM_NAME',
    payload: formName,
  };
};

export const setFormsData = (formData) => {
  return {
    type: 'SET_FORMS_DATA',
    payload: formData,
  };
};

export const updateFilteredFormsData = (filteredFormsData) => {
  return {
    type: 'UPDATE_FILTERED_FORMS_DATA',
    payload: filteredFormsData,
  };
};

export const updateFormsData = (updatedFormsData) => {
  return {
    type: 'UPDATE_FORMS_DATA',
    payload: updatedFormsData,
  };
};

export const updateSelectedFormData = (selectedFormsData) => {
  return {
    type: 'UPDATE_SELECTED_FORM_DATA',
    payload: selectedFormsData,
  };
};

export const setAffiliationLookup = (affiliationLookup) => {
  return {
    type: 'SET_AFFILIATION_LOOKUP',
    payload: affiliationLookup,
  };
};
