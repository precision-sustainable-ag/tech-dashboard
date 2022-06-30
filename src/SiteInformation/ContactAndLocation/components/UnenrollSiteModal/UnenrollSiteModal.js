// Dependency Imports
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  Grid,
  Typography,
} from '@material-ui/core';
import Axios from 'axios';
// Local Imports
import { apiURL, apiUsername, apiPassword } from '../../../../utils/api_secret';
import { useSelector, useDispatch } from 'react-redux';
import { setUnenrollOpen, setEnrollmentValuesEdited } from '../../../../Store/actions';

//Global Vars
const qs = require('qs');

// Default function
const UnenrollSiteModal = () => {
  const open = useSelector((state) => state.tableData.unenrollOpen);
  const unenrollRowData = useSelector((state) => state.tableData.unenrollRowData);
  const enrollmentValuesEdited = useSelector(
    (state) => state.sharedSiteInfo.enrollmentValuesEdited,
  );
  const [confirmText, setConfirmText] = useState('');
  const [confirmBtnStatus, setConfirmBtnStatus] = useState('Confirm');
  const dispatch = useDispatch();
  const handleUnenroll = () => {
    // disenroll and close
    setConfirmBtnStatus('Please Wait..');
    const site = new SiteEnrollment(unenrollRowData);
    site.unenrollSite();
    const dataString = qs.stringify(site);

    Axios({
      url: `${apiURL}/api/sites/disenroll`,
      method: 'post',
      data: dataString,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
    })
      .then((response) => {
        if (response.data.data) {
          dispatch(setUnenrollOpen(!open));
          dispatch(setEnrollmentValuesEdited(!enrollmentValuesEdited));
        } else {
          console.error(response.data);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const closeModal = () => {
    setConfirmText('');
    dispatch(setUnenrollOpen(!open));
  };

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{`Disenroll site`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You are about to{' '}
          {`Disenroll site '${unenrollRowData.code}' for producer '${unenrollRowData.last_name}'`}.
          Please note that this action can not be undone.
        </DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1">
              To disenroll this site please type the site code{' '}
              <strong>{unenrollRowData.code}</strong> below.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={confirmText}
              label="Site Code"
              fullWidth
              onChange={(e) => {
                setConfirmText(e.target.value.toUpperCase());
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeModal}
          color="primary"
          autoFocus
          variant={window.localStorage.getItem('theme') === 'dark' ? 'contained' : 'text'}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUnenroll}
          color="primary"
          disabled={unenrollRowData.code === confirmText ? false : true}
          variant={window.localStorage.getItem('theme') === 'dark' ? 'contained' : 'text'}
        >
          {confirmBtnStatus}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnenrollSiteModal;

class SiteEnrollment {
  constructor(obj) {
    //   unmutable
    this.cid = obj.cid;
    this.code = obj.code;
    this.year = obj.year;
    this.affiliation = obj.affiliation;
    this.producer_id = obj.producer_id;

    // mutable
    this.county = obj.county;
    this.longitude = parseFloat(obj.longitude);
    this.latitude = parseFloat(obj.latitude);
    this.notes = obj.notes;
    this.additional_contact = obj.additional_contact;
    this.address = obj.address;
    this.state = obj.state;
  }

  unenrollSite() {
    this.protocols_enrolled = '-999';
  }
}
