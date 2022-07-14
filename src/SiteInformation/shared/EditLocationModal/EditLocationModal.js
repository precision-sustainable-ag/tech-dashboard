// Dependency Imports
import React, { useState, useEffect, Fragment } from 'react';
import {
  Grid,
  Button,
  Dialog,
  TextField,
  DialogContent,
  DialogTitle,
  DialogActions,
  Select,
  MenuItem,
  Typography,
  Switch,
} from '@material-ui/core';
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setSnackbarData } from '../../../Store/actions';
// Local Imports
import { apiURL, apiUsername, apiPassword } from '../../../utils/api_secret';
import Location from '../../../Location/Location';
import {
  setEditLocationModalOpen,
  setEnrollmentData,
  setEnrollmentValuesEdited,
} from '../../../Store/actions';

//Global Vars
const qs = require('qs');

const fullWidth = true;

// Default function
const EditLocationModal = ({ action }) => {
  const dispatch = useDispatch();

  const enrollmentValuesEdited = useSelector(
    (state) => state.sharedSiteInfo.enrollmentValuesEdited,
  );
  const open = useSelector((state) => state.sharedSiteInfo.editLocationModalOpen);
  const editLocationModalData = useSelector((state) => state.sharedSiteInfo.editLocationModalData);
  const enrollmentData = useSelector((state) => state.enrollmentData.data);

  const handleEditLocationModalClose = () => {
    dispatch(setEditLocationModalOpen(!open));
  };

  const [maxWidth, setMaxWidth] = useState('md');

  const [newData, setNewData] = useState({
    county: editLocationModalData.county,
    state: editLocationModalData.state,
    latitude: editLocationModalData.latitude,
    longitude: editLocationModalData.longitude,
    address: editLocationModalData.address,
    notes: editLocationModalData.notes,
    additional_contact: editLocationModalData.additional_contact,
    irrigation: editLocationModalData.irrigation,
  });

  const checkLatitude = (arg) => {
    return /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(arg)
      ? true
      : false;
  };

  const checkLongitude = (arg) => {
    return /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(
      arg,
    )
      ? true
      : false;
  };

  const validateData = () => {
    if (!(newData.latitude && newData.longitude)) {
      setSnackbarData({
        open: true,
        text: `Latitdue and longitude are required`,
        severity: 'error',
      });
    } else if (
      checkLatitude(Math.ceil(newData.latitude)) &&
      checkLongitude(Math.ceil(newData.longitude))
    ) {
      //   call update api
      const updateData = {
        ...newData,
        code: editLocationModalData.code,
        year: editLocationModalData.year,
        affiliation: editLocationModalData.affiliation,
        producer_id: editLocationModalData.producer_id,
        last_name: editLocationModalData.last_name,
        email: editLocationModalData.email,
        cid: editLocationModalData.cid,
        latlng:
          newData.latitude && newData.longitude ? `${newData.latitude},${newData.longitude}` : '',
      };
      if (action === 'update')
        updateSite(updateData).then(() => {
          dispatch(setEditLocationModalOpen(!open));
          dispatch(setEnrollmentValuesEdited(!enrollmentValuesEdited));

          setNewData({
            county: '',
            state: '',
            latitude: '',
            longitude: '',
            address: '',
            notes: '',
            additional_contact: '',
            irrigation: '',
          });
        });
      else {
        const updatedData = enrollmentData.growerInfo.sites.map((site) => {
          if (site.code === editLocationModalData.code) {
            return { ...newData, code: site.code };
          } else return site;
        });
        let finalData = enrollmentData;
        finalData.growerInfo.sites = updatedData;
        dispatch(setEnrollmentData(finalData));
        dispatch(setEditLocationModalOpen(!open));
        dispatch(setEnrollmentValuesEdited(!enrollmentValuesEdited));
      }
    } else {
      if (
        !checkLatitude(Math.ceil(newData.latitude)) &&
        !checkLongitude(Math.ceil(newData.longitude))
      ) {
        dispatch(
          setSnackbarData({
            open: true,
            text: `Wrong value for latitude and longitude, should be between -90 to 90 and -180 to 180 respectively`,
            severity: 'error',
          }),
        );
      } else if (!checkLatitude(Math.ceil(newData.latitude))) {
        dispatch(
          setSnackbarData({
            open: true,
            text: `Wrong value for latitude, should be between -90 to 90`,
            severity: 'error',
          }),
        );
      } else if (!checkLongitude(Math.ceil(newData.longitude))) {
        dispatch(
          setSnackbarData({
            open: true,
            text: `Wrong value for longitude, should be between -180 to 180`,
            severity: 'error',
          }),
        );
      }
    }
  };

  const handleMaxWidthChange = (event) => {
    setMaxWidth(event.target.value);
  };

  useEffect(() => {
    setNewData({
      county: editLocationModalData.county,
      state: editLocationModalData.state,
      latitude: editLocationModalData.latitude,
      longitude: editLocationModalData.longitude,
      address: editLocationModalData.address,
      notes: editLocationModalData.notes,
      additional_contact: editLocationModalData.additional_contact,
      irrigation: editLocationModalData.irrigation,
    });
    return () => {
      setNewData({
        county: '',
        state: '',
        latitude: '',
        longitude: '',
        address: '',
        notes: '',
        additional_contact: '',
        irrigation: '',
      });
    };
  }, [open, editLocationModalData]);

  return (
    <Dialog
      open={open}
      onClose={handleEditLocationModalClose}
      aria-labelledby="form-dialog-title"
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle id="form-dialog-title">
        <Grid container justifyContent="space-between">
          <Grid item>
            Site <mark>{editLocationModalData.code}</mark> of producer:{' '}
            <strong>{editLocationModalData.last_name}</strong> [{editLocationModalData.producer_id}]
          </Grid>
          <Grid item>
            <Select
              autoFocus
              value={maxWidth}
              onChange={handleMaxWidthChange}
              inputProps={{
                name: 'max-width',
                id: 'max-width',
              }}
            >
              <MenuItem value={false}>regular</MenuItem>
              <MenuItem value="xs">x-small</MenuItem>
              <MenuItem value="sm">small</MenuItem>
              <MenuItem value="md">medium</MenuItem>
              <MenuItem value="lg">large</MenuItem>
              <MenuItem value="xl">x-large</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs>
            <Typography variant="h6">
              Click on the map below to select your site location
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Location
              searchLabel="Search for an address"
              setSelectedToEditSite={setNewData}
              selectedToEditSite={newData}
              markerLatLng={{
                lat: newData.latitude ? parseFloat(newData.latitude) : newData.latitude,
                lng: newData.longitude ? parseFloat(newData.longitude) : newData.longitude,
              }}
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <TextField
              label="County"
              margin="dense"
              name="county"
              value={newData.county || ''}
              type="text"
              fullWidth
              onChange={(e) => {
                setNewData({ ...newData, county: e.target.value ? e.target.value : '' });
              }}
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <TextField
              label="State"
              margin="dense"
              name="state"
              value={newData.state || ''}
              type="text"
              fullWidth
              onChange={(e) => {
                setNewData({ ...newData, state: e.target.value });
              }}
            />
          </Grid>
          <Grid item sm={12}>
            <TextField
              label="Latitude"
              fullWidth
              id="editLat"
              margin="dense"
              required
              defaultValue={newData.latitude || ''}
              value={newData.latitude || ''}
              type="text"
              onChange={(e) => {
                setNewData({
                  ...newData,
                  latitude: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <TextField
              label="Longitude"
              fullWidth
              id="editLon"
              margin="dense"
              required
              defaultValue={newData.longitude || ''}
              value={newData.longitude || ''}
              type="text"
              onChange={(e) => {
                setNewData({
                  ...newData,
                  longitude: e.target.value,
                });
              }}
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <TextField
              id="editAddress"
              label="Field Address"
              margin="dense"
              name="address"
              value={newData.address || ''}
              type="text"
              fullWidth
              onChange={(e) => {
                setNewData({ ...newData, address: e.target.value });
              }}
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <TextField
              id="editNotes"
              margin="dense"
              name="notes"
              label="Notes"
              multiline
              type="text"
              fullWidth
              value={newData.notes || ''}
              onChange={(e) => {
                setNewData({ ...newData, notes: e.target.value });
              }}
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <TextField
              id="editAdditionalContact"
              value={newData.additional_contact || ''}
              margin="dense"
              label="Additional Contact"
              name="additionalContact"
              multiline
              type="text"
              fullWidth
              onChange={(e) => {
                setNewData({ ...newData, additional_contact: e.target.value });
              }}
            />
          </Grid>
          {action === 'create' && (
            <Fragment>
              <Grid item>
                <Typography variant="body1">Irrigation</Typography>
              </Grid>
              <Grid item>
                <Switch
                  color={newData.irrigation ? 'primary' : 'secondary'}
                  checked={newData.irrigation}
                  onChange={(e) => {
                    setNewData({
                      ...newData,
                      irrigation: e.target.checked,
                    });
                  }}
                  name="checkedA"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              </Grid>
            </Fragment>
          )}
          <Grid item sm={12} lg={12}>
            <TextField
              id="editCode"
              margin="dense"
              name="code"
              value={editLocationModalData.code || ''}
              disabled
              label="Code"
              type="text"
              fullWidth
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <TextField
              value={editLocationModalData.year || ''}
              margin="dense"
              name="email"
              label="Year"
              type="text"
              disabled
              fullWidth
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <TextField
              id="editEmail"
              value={editLocationModalData.email || ''}
              margin="dense"
              name="email"
              label="Email Address"
              type="email"
              disabled
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleEditLocationModalClose}
          color="primary"
          variant={window.localStorage.getItem('theme') === 'dark' ? 'contained' : 'text'}
        >
          Cancel
        </Button>
        <Button onClick={validateData} color="primary" variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const updateSite = async (data) => {
  const dataString = qs.stringify(data);
  let req = await Axios({
    method: 'POST',
    url: `${apiURL}/api/update/alldata`,
    data: dataString,
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  }).catch((e) => {
    console.error(e);
  });
  if (req.status) {
    if (req.status === 200) {
      return true;
    } else {
      console.error('AJAX Error');
      return false;
    }
  } else {
    return false;
  }
};

EditLocationModal.propTypes = {
  action: PropTypes.string,
};

export default EditLocationModal;
