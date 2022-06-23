import { useSelector, useDispatch } from 'react-redux';
import { setEditDatesModalOpen, setFarmDatesValuesEdited } from '../../../../Store/actions';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  TextField,
  Button,
  Grid,
} from '@material-ui/core';
import { callAzureFunction } from '../../../../utils/SharedFunctions';
import { useAuth0 } from '../../../../Auth/react-auth0-spa';
import PropTypes from 'prop-types';

const EditDatesModal = ({ setSnackbarDataGlobal }) => {
  const farmDatesValuesEdited = useSelector((state) => state.farmDatesData.farmDatesValuesEdited);
  const editDatesModalData = useSelector((state) => state.farmDatesData.editDatesModalData);
  const editDatesModalOpen = useSelector((state) => state.farmDatesData.editDatesModalOpen);
  const [datesDict, setDatesDict] = useState({
    coverCropPlanting: 'undefined',
    coverCropTermination: 'undefined',
    cashPlanting: 'undefined',
  });
  const [farmCode, setFarmCode] = useState();
  const { getTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  //set all values when first loaded
  useEffect(() => {
    setFarmCode(editDatesModalData.code);
    setDatesDict({
      coverCropPlanting: editDatesModalData.cover_planting,
      coverCropTermination: editDatesModalData.cover_termination,
      cashPlanting: editDatesModalData.cash_planting,
    });
  }, [editDatesModalData]);

  //updates the dictionary with the passed data based on which column is selected
  //0=coverCropPlanting, 1=coverCropTermination, 2=cashPlanting
  const updateDate = (col, data) => {
    switch (col) {
      case 0:
        setDatesDict({
          ...datesDict,
          coverCropPlanting: data,
        });
        break;
      case 1:
        setDatesDict({
          ...datesDict,
          coverCropTermination: data,
        });
        break;
      case 2:
        setDatesDict({
          ...datesDict,
          cashPlanting: data,
        });
        break;
      default:
        return;
    }
  };

  //handles closing of the modal
  const handleEditDatesModalClose = () => {
    dispatch(setEditDatesModalOpen(false));
  };

  //handles submit
  const handleEditDatesModalSubmit = () => {
    //set data to be submitted to API
    const data = {
      values: {
        cc_planting_date: datesDict.coverCropPlanting,
        cc_termination_date: datesDict.coverCropTermination,
        cash_crop_planting_date: datesDict.cashPlanting,
      },
      conditions: {
        code: farmCode,
      },
    };
    callAzureFunction(data, 'crowndb/farm_history', 'POST', getTokenSilently).then((res) => {
      if (res.response && res.response.status === 201) {
        dispatch(setFarmDatesValuesEdited(!farmDatesValuesEdited));
        setSnackbarDataGlobal({
          open: true,
          text: 'Dates Edit Was Successful!',
          severity: 'success',
        });
        handleEditDatesModalClose();
      } else {
        setSnackbarDataGlobal({
          open: true,
          text: 'Dates Edit Was Unsuccessful',
          severity: 'error',
        });
      }
    });
  };

  return (
    <Dialog open={editDatesModalOpen} onClose={handleEditDatesModalClose}>
      <DialogTitle>Edit Dates</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DialogContentText>
              Please enter the new dates for Cover Crop Planting, Cover Crop Termination, and Cash
              Planting in the text fields below.
            </DialogContentText>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextField
              color="primary"
              value={datesDict.coverCropPlanting}
              disabled={
                datesDict.coverCropPlanting == null || datesDict.coverCropPlanting === 'undefined'
              }
              onChange={(data) => updateDate(0, data.target.value)}
              type="date"
              id="Cover Crop Planting"
              label="Cover Crop Planting"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextField
              color="primary"
              value={datesDict.coverCropTermination}
              disabled={
                datesDict.coverCropTermination == null ||
                datesDict.coverCropTermination === 'undefined'
              }
              onChange={(data) => updateDate(1, data.target.value)}
              type="date"
              id="Cover Crop Termination"
              label="Cover Crop Temination"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextField
              color="primary"
              value={datesDict.cashPlanting}
              disabled={datesDict.cashPlanting == null || datesDict.cashPlanting === 'undefined'}
              onChange={(data) => updateDate(2, data.target.value)}
              type="date"
              id="Cash Planting"
              label="Cash Planting"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              onClick={handleEditDatesModalClose}
              color="primary"
              variant="contained"
              fullWidth={true}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              onClick={handleEditDatesModalSubmit}
              color="primary"
              variant="contained"
              fullWidth={true}
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

EditDatesModal.propTypes = {
  setSnackbarDataGlobal: PropTypes.func,
};

export default EditDatesModal;
