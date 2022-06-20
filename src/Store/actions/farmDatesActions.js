export const setEditDatesModalOpen = (editDatesModalOpen) => {
  return {
    type: 'SET_EDIT_DATES_MODAL_OPEN',
    payload: editDatesModalOpen, 
  };
};

export const setEditDatesModalData = (editDatesModalData) => {
  return {
    type: 'SET_EDIT_DATES_MODAL_DATA',
    payload: editDatesModalData, 
  };
};

export const setFarmDatesData = (farmDatesData) => {
  return {
    type: 'SET_FARM_DATES_DATA',
    payload: farmDatesData, 
  };
};

export const setFarmDatesReloadNeeded = (farmDatesReloadNeeded) => {
  return {
    type: 'SET_FARM_DATES_RELOAD_NEEDED',
    payload: farmDatesReloadNeeded, 
  };
};