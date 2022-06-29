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
    biomassHarvest: 'undefined',
    coverCropTermination: 'undefined',
    cashPlanting: 'undefined',
  });
  const [farmCode, setFarmCode] = useState();
  //const [updatesSuccessful, setUpdatesSuccessful] = useState(false);
  const { getTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  //set all values when first loaded
  useEffect(() => {
    setFarmCode(editDatesModalData.code);
    setDatesDict({
      coverCropPlanting: editDatesModalData.cover_planting,
      biomassHarvest: editDatesModalData.biomass_harvest,
      coverCropTermination: editDatesModalData.cover_termination,
      cashPlanting: editDatesModalData.cash_planting,
    });
  }, [editDatesModalData]);

  //updates the dictionary with the passed data based on which column is selected
  //0=coverCropPlanting, 1=biomassHarvest, 2=coverCropTermination, 3=cashPlanting
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
          biomassHarvest: data,
        });
        break;
      case 2:
        setDatesDict({
          ...datesDict,
          coverCropTermination: data,
        });
        break;
      case 3:
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
    setSnackbarDataGlobal({
      open: true,
      text: 'Submitting...',
      severity: 'info',
    });
    const biomassData1A = {
      values: {
        recovery_date: datesDict.biomassHarvest,
      },
      conditions: {
        code: farmCode,
        subplot: 1,
        subsample: 'A',
        time: 0,
      },
    };
    const biomassData1B = {
      values: {
        recovery_date: datesDict.biomassHarvest,
      },
      conditions: {
        code: farmCode,
        subplot: 1,
        subsample: 'B',
        time: 0,
      },
    };
    const biomassData2A = {
      values: {
        recovery_date: datesDict.biomassHarvest,
      },
      conditions: {
        code: farmCode,
        subplot: 2,
        subsample: 'A',
        time: 0,
      },
    };
    const biomassData2B = {
      values: {
        recovery_date: datesDict.biomassHarvest,
      },
      conditions: {
        code: farmCode,
        subplot: 2,
        subsample: 'B',
        time: 0,
      },
    };
    const farmHistoryData = {
      values: {
        cc_planting_date: datesDict.coverCropPlanting,
        cc_termination_date: datesDict.coverCropTermination,
        cash_crop_planting_date: datesDict.cashPlanting,
      },
      conditions: {
        code: farmCode,
      },
    };

    Promise.all([
      callAzureFunction(biomassData1A, 'crowndb/decomp_biomass_dry', 'POST', getTokenSilently),
      callAzureFunction(biomassData1B, 'crowndb/decomp_biomass_dry', 'POST', getTokenSilently),
      callAzureFunction(biomassData2A, 'crowndb/decomp_biomass_dry', 'POST', getTokenSilently),
      callAzureFunction(biomassData2B, 'crowndb/decomp_biomass_dry', 'POST', getTokenSilently),
      callAzureFunction(farmHistoryData, 'crowndb/farm_history', 'POST', getTokenSilently),
    ]).then((values) => {
      if (values[0].response && values[0].response.status === 201) {
        if (values[1].response && values[1].response.status === 201) {
          if (values[2].response && values[2].response.status === 201) {
            if (values[3].response && values[3].response.status === 201) {
              if (values[4].response && values[4].response.status === 201) {
                setSnackbarDataGlobal({
                  open: true,
                  text: 'Dates Edit Was Successful!',
                  severity: 'success',
                });
                dispatch(setFarmDatesValuesEdited(!farmDatesValuesEdited));
                handleEditDatesModalClose();
              } else {
                setSnackbarDataGlobal({
                  open: true,
                  text: 'ERROR. All biomass dates added. Update failed at farm history dates',
                  severity: 'error',
                });
              }
            } else {
              setSnackbarDataGlobal({
                open: true,
                text: 'ERROR. Biomass subplots/subtables 1A,1B,2A added. Update failed at subplot/subtable 2B',
                severity: 'error',
              });
            }
          } else {
            setSnackbarDataGlobal({
              open: true,
              text: 'ERROR. Biomass subplots/subtables 1A,1B added. Update failed at subplot/subtable 2A',
              severity: 'error',
            });
          }
        } else {
          setSnackbarDataGlobal({
            open: true,
            text: 'ERROR. Biomass subplot/subtable 1A added. Update failed at subplot/subtable 1B',
            severity: 'error',
          });
        }
      } else {
        setSnackbarDataGlobal({
          open: true,
          text: 'ERROR. No dates added. Update failed at biomass subplot/subtable 1A',
          severity: 'error',
        });
      }
    });
  };

  return (
    <Dialog open={editDatesModalOpen} onClose={handleEditDatesModalClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Dates</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid container item xs={12} md={12} lg={12} xl={12} spacing={1}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <DialogContentText>
                Please enter the new dates for Cover Crop Planting, Biomass Harvest, Cover Crop
                Termination, and Cash Planting in the text fields below. If you need to change a bag
                pickup timing, leave a comment.
              </DialogContentText>
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs={12}
            md={12}
            lg={12}
            xl={12}
            spacing={1}
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Grid item>
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
            <Grid item>
              <TextField
                color="primary"
                value={datesDict.biomassHarvest}
                disabled={
                  datesDict.biomassHarvest == null || datesDict.biomassHarvest === 'undefined'
                }
                onChange={(data) => updateDate(1, data.target.value)}
                type="date"
                id="Biomass Harvest"
                label="Biomass Harvest"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item>
              <TextField
                color="primary"
                value={datesDict.coverCropTermination}
                disabled={
                  datesDict.coverCropTermination == null ||
                  datesDict.coverCropTermination === 'undefined'
                }
                onChange={(data) => updateDate(2, data.target.value)}
                type="date"
                id="Cover Crop Termination"
                label="Cover Crop Temination"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item>
              <TextField
                color="primary"
                value={datesDict.cashPlanting}
                disabled={datesDict.cashPlanting == null || datesDict.cashPlanting === 'undefined'}
                onChange={(data) => updateDate(3, data.target.value)}
                type="date"
                id="Cash Planting"
                label="Cash Planting"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} md={12} lg={12} xl={12} spacing={1}>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <Button
                onClick={handleEditDatesModalClose}
                color="primary"
                variant="contained"
                fullWidth={true}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6}>
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
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

EditDatesModal.propTypes = {
  setSnackbarDataGlobal: PropTypes.func,
};

export default EditDatesModal;
