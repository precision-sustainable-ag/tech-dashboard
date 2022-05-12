import { createSlice,configureStore } from "@reduxjs/toolkit";

// const initialState = {
//     loggedIn: false,
//     isDarkTheme: false,
//     site_information: [],
//     repositories: [],
//     devices: [],
//     psaForms: [],
//     psassgForms: [],
//     userRole: 'default',
//     userInfo: {},
//     loadingUser: true,
//     affiliationLookup: {},
//     formsData: {
//       name: '',
//       type: '',
//       data: [],
//       invalidData: [],
//       validData: [],
//       historyData: [],
//       originalData: {
//         validRecords: [],
//         invalidRecords: [],
//         historyRecords: [],
//       },
//     },
//     selectedFormData: {
//       slimRecord: {},
//       error: [],
//       uid: '',
//     },
//     valuesEdited: false,
//     editModalOpen: false,
//     editModalData: {},
//     reassignSiteModalOpen: false,
//     reassignSiteModalData: {},
//     unenrollOpen: false,
//     unenrollRowData: {},
//     showNewIssueDialog: false,
//     newIssueData: {},
//     mapModalOpen: false,
//     mapModalData: [35.763197, -78.700187],
//   };

export const slice = createSlice({
  name: "theStore",
  initialState: { 
    loggedIn: false,
    isDarkTheme: false,
    site_information: [],
    repositories: [],
    devices: [],
    psaForms: [],
    psassgForms: [],
    userRole: 'default',
    userInfo: {},
    loadingUser: true,
    affiliationLookup: {},
    formsData: {
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
    },
    selectedFormData: {
      slimRecord: {},
      error: [],
      uid: '',
    },
    valuesEdited: false,
    editModalOpen: false,
    editModalData: {},
    reassignSiteModalOpen: false,
    reassignSiteModalData: {},
    unenrollOpen: false,
    unenrollRowData: {},
    showNewIssueDialog: false,
    newIssueData: {},
    mapModalOpen: false,
    mapModalData: [35.763197, -78.700187], 
   },
  reducers: {

    checkAuth: (state, action) => {
        if (action.payload.username === 'hey' && action.payload.password === 'hey'){
            state.loggedIn = true;
        }
        else
        { state.loggedIn = false; }
    },
    updateRole: (state, action) => {
        state.userRole = action.payload;
    },
    updateUserInfo: (state, action) => {
        state.userInfo = action.payload;
        state.loadingUser = false;
    },
    updatingUserInfo: (state) => {
        state.loadingUser = true;
    },

    // FormsData
    updateFormName: (state, action) => {
        state.formsData.name = action.payload;
    },
    setFormData: (state, action) => {
        state.formsData.type = action.payload.formType;
        state.formsData.data = action.payload.validFilteredRecords;
        state.formsData.invalidData = action.payload.invalidFilteredRecords;
        state.formsData.validData = action.payload.validFilteredRecords;
        state.formsData.historyData = action.payload.historyFilteredRecords;
        state.formsData.originalData.validRecords = action.payload.validFilteredRecords;
        state.formsData.originalData.invalidRecords = action.payload.invalidFilteredRecords;
        state.formsData.originalData.historyRecords = action.payload.historyFilteredRecords;
    },
    updateFilteredFormsData: (state, action) => {
        state.formsData.filteredData = action.payload.formsData;
        state.formsData.type = action.payload.formType;
    },
    updateFormsData: (state, action) => {
        state.formsData.data = action.payload.formsData;
        state.formsData.type = action.payload.formType;
    },
    updateSelectedFormData: (state, action) => {
        state.selectedFormData.slimRecord = action.payload.formSlimRecord;
        state.selectedFormData.error = action.payload.formError;
        state.selectedFormData.uid = action.payload.formUid;
    },

    setAffiliationLookup: (state, action) => {
        state.affiliationLookup = action.payload.affiliationLookup;
    },
    toggleIsDarkTheme: (state, action) => {
        state.isDarkTheme = action.payload;
    },

    // AllDataTable
    setValuesEdited: (state, action) => {
        state.valuesEdited = action.payload;
    },
    setEditModalOpen: (state, action) => {
        state.editModalOpen = action.payload;
      },
    setEditModalData: (state, action) => {
        state.editModalData = action.payload;
      },
    setReassignSiteModalOpen: (state, action) => {
        state.reassignSiteModalOpen = action.payload;
      },
    setReassignSiteModalData: (state, action) => {
        state.reassignSiteModalData = action.payload;
      },
    setUnenrollOpen: (state, action) => {
        state.unenrollOpen = action.payload;
      },
    setUnenrollRowData: (state, action) => {
        state.unenrollRowData = action.payload;
      },
    setShowNewIssueDialog: (state, action) => {
        state.showNewIssueDialog = action.payload;
      },
    setNewIssueData: (state, action) => {
        state.newIssueData = action.payload;
      },
    setMapModalOpen: (state, action) => {
        state.mapModalOpen = action.payload;
      },
    setMapModalData: (state, action) => {
        state.mapModalData = action.payload;
      },
  }
});

export default configureStore({
    reducer: {
      theStore: slice.reducer,
    },
  });

export const { 
    updateRole,
    updateUserInfo,
    updatingUserInfo,
    updateFormName,
    setFormData,
    updateFilteredFormsData,
    updateFormsData,
    updateSelectedFormData,
    setAffiliationLookup,
    toggleIsDarkTheme,
    setValuesEdited,
    setEditModalData, 
    setEditModalOpen, 
    setReassignSiteModalData, 
    setReassignSiteModalOpen, 
    setMapModalOpen, 
    setMapModalData,
    setShowNewIssueDialog,
    setNewIssueData,
    setUnenrollOpen,
    setUnenrollRowData
    } = slice.actions;
export const reducer = slice.reducer;
// export default newStore = newStore;