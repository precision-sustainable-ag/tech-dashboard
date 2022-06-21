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
  Snackbar,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import MuiAlert from '@material-ui/lab/Alert';
import { setEditCashCropModalOpen } from '../../Store/actions';
import { callAzureFunction } from '../../utils/SharedFunctions';
import { useAuth0 } from '../../Auth/react-auth0-spa';
import PropTypes from 'prop-types';
import IssueDialogue from '../../Comments/IssueDialogue';
import { setValuesEdited } from '../../Store/actions';

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const EditCashCropModal = ({ setSnackbarDataGlobal }) => {
  const open = useSelector((state) => state.tableData.editCashCropModalOpen);
  const editCashCropModalData = useSelector((state) => state.tableData.editCashCropModalData);
  const [farmCode, setFarmCode] = useState();
  const [cashCrop, setCashCrop] = useState();
  const [showOtherMessage, setShowOtherMessage] = useState(false);
  const [backedCashCrop, setBackedCashCrop] = useState();
  const dispatch = useDispatch();
  const { getTokenSilently, user } = useAuth0();
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: '',
    severity: 'success',
  });

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
        dispatch(setValuesEdited(data));
        if (cashCrop === 'Other') {
          setShowOtherMessage(true);
          setSnackbarData({
            open: true,
            text: 'Successfully updated Cash Crop, but further explanation needed',
            severity: 'warning',
          });
        } else {
          handleEditCashCropModalClose(false);
          setSnackbarDataGlobal({
            open: true,
            text: 'Successfully updated Cash Crop',
            severity: 'success',
          });
        }
      } else {
        setSnackbarData({
          open: true,
          text: 'Could not update Cash Crop',
          severity: 'error',
        });
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
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={snackbarData.open}
          autoHideDuration={10000}
          onClose={() => setSnackbarData({ ...snackbarData, open: !snackbarData.open })}
        >
          <Alert severity={snackbarData.severity}>{snackbarData.text}</Alert>
        </Snackbar>
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
            <IssueDialogue
              nickname={user.nickname}
              rowData={null}
              setSnackbarData={setSnackbarData}
              labels={['cash-crop', farmCode]}
              getTokenSilently={getTokenSilently}
            />
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

EditCashCropModal.defaultProps = {
  setSnackbarDataGlobal: () => this.setSnackbarData(),
};

EditCashCropModal.propTypes = {
  setSnackbarDataGlobal: PropTypes.func.isRequired,
};

export default EditCashCropModal;
