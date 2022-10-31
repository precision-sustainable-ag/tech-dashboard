import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  Grid,
  DialogContent,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  DialogActions,
  Button,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { setEditCashCropModalOpen } from '../../../../Store/actions';
import { setSnackbarData } from '../../../../Store/actions';
import { callAzureFunction } from '../../../../utils/SharedFunctions';
import { useAuth0 } from '../../../../Auth/react-auth0-spa';
import IssueDialogue from '../../../../Comments/components/IssueDialogue/IssueDialogue';
import { setEnrollmentValuesEdited } from '../../../../Store/actions';
import { setIssueDialogueData } from '../../../../Store/actions';

const EditCashCropModal = () => {
  const open = useSelector((state) => state.tableData.editCashCropModalOpen);
  const editCashCropModalData = useSelector((state) => state.tableData.editCashCropModalData);
  const [farmCode, setFarmCode] = useState();
  const [cashCrop, setCashCrop] = useState();
  const [showOtherMessage, setShowOtherMessage] = useState(false);
  const [backedCashCrop, setBackedCashCrop] = useState();
  const dispatch = useDispatch();
  const { getTokenSilently, user } = useAuth0();

  useEffect(() => {
    if (Object.keys(editCashCropModalData).length !== 0) {
      setFarmCode(editCashCropModalData.code);
      const cashCrop = editCashCropModalData.cash_crop;
      setCashCrop(cashCrop);
      setBackedCashCrop(cashCrop);
    }
  }, [editCashCropModalData]);

  const handleEditCashCropModalClose = (wipeInfo) => {
    if (wipeInfo) {
      setCashCrop(backedCashCrop);
    } else {
      setBackedCashCrop(cashCrop);
    }
    setShowOtherMessage(false);
    dispatch(setEditCashCropModalOpen(!open));
  };

  const handleSelectChange = (event) => {
    setCashCrop(event.target.value);
  };

  const handleUpdateCashCrop = () => {
    const data = {
      values: {
        next_cash_crop: cashCrop,
      },
      conditions: {
        code: farmCode,
      },
    };

    callAzureFunction(data, 'crowndb/farm_history', 'POST', getTokenSilently).then((res) => {
      if (res.response && res.response.status === 201) {
        dispatch(setEnrollmentValuesEdited(data));
        if (cashCrop === 'Other') {
          setShowOtherMessage(true);
          dispatch(
            setIssueDialogueData({
              nickname: user.nickname,
              setShowNewIssueDialogue: true,
            }),
          );
          dispatch(
            setSnackbarData({
              open: true,
              text: 'Successfully updated Cash Crop, but further explanation needed',
              severity: 'warning',
            }),
          );
        } else {
          handleEditCashCropModalClose(false);
          dispatch(
            setSnackbarData({
              open: true,
              text: 'Successfully updated Cash Crop',
              severity: 'success',
            }),
          );
        }
      } else {
        dispatch(
          setSnackbarData({
            open: true,
            text: 'Could not update Cash Crop',
            severity: 'error',
          }),
        );
      }
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleEditCashCropModalClose()}
      maxWidth={'md'}
      fullWidth={true}
    >
      <DialogTitle>
        <Grid container justifyContent="space-between">
          <Grid item>Edit Cash Crop for Site {farmCode}</Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        {cashCrop === null ? (
          <Grid container justifyContent="center">
            <Grid item>
              <h1>
                Have you submitted your farm history form yet? If yes, please leave a comment below
              </h1>
            </Grid>
          </Grid>
        ) : (
          <>
            <FormControl fullWidth>
              <InputLabel id="cash_crop_select_label">Cash Crop</InputLabel>
              <Select
                labelId="cash_crop_select_label"
                defaultValue={cashCrop}
                value={cashCrop}
                onChange={handleSelectChange}
              >
                <MenuItem value={'Corn'} disabled={backedCashCrop === 'Corn'}>
                  Corn
                </MenuItem>
                <MenuItem value={'Soybeans'} disabled={backedCashCrop === 'Soybeans'}>
                  Soybeans
                </MenuItem>
                <MenuItem value={'Cotton'} disabled={backedCashCrop === 'Cotton'}>
                  Cotton
                </MenuItem>
                <MenuItem value={'Other'} disabled={backedCashCrop === 'Other'}>
                  Other
                </MenuItem>
              </Select>
            </FormControl>
            {showOtherMessage ? (
              <DialogContent>
                <h1>Please leave a comment to let us know what is happening</h1>
              </DialogContent>
            ) : null}
          </>
        )}
        {showOtherMessage || cashCrop === null ? (
          <DialogContent>
            <IssueDialogue rowData={null} labels={['cash-crop', farmCode]} />
          </DialogContent>
        ) : null}
      </DialogContent>
      <DialogActions>
        {cashCrop !== null && !showOtherMessage ? null : (
          <Button
            onClick={() => handleEditCashCropModalClose(false)}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        )}
        <Button
          onClick={() => handleEditCashCropModalClose(true)}
          disabled={cashCrop === null || showOtherMessage}
          color="primary"
          variant="contained"
        >
          Cancel
        </Button>
        <Button
          disabled={cashCrop === null || showOtherMessage || cashCrop === backedCashCrop}
          onClick={() => handleUpdateCashCrop()}
          color="primary"
          variant="contained"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCashCropModal;
