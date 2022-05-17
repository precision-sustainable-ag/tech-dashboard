// Dependency Imports
import React, { useState, useEffect } from 'react';
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
  FormControl,
  FormControlLabel,
  Checkbox,
  Snackbar,
  FormLabel,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

// Local Imports
import { apiURL, apiUsername, apiPassword } from '../utils/api_secret';
import Location from '../Location/Location';
// import PropTypes from 'prop-types';
// import { Context } from '../Store/Store';
import { setEditModalOpen, setValuesEdited } from '../Store/actions';

//Global Vars
const qs = require('qs');

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// Styles
// County is not being passed on to the server as that would need API modification, and Rick is developing a new API
// const useStyles = makeStyles((theme) => ({
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     margin: "auto",
//     width: "fit-content",
//   },
//   formControl: {
//     marginTop: theme.spacing(2),
//     minWidth: 120,
//   },
//   formControlLabel: {
//     marginTop: theme.spacing(1),
//   },
// }));

const fullWidth = true;
// Default function
const EditDataModal = () => {
  // const [state, dispatch] = useContext(Context);
  const dispatch = useDispatch();
  const valuesEdited = useSelector((state) => state.tableData.valuesEdited);
  // const open = state.tableData.editModalOpen;
  const open = useSelector((state) => state.tableData.editModalOpen);

  // const editModalData = state.tableData.editModalData;
  const editModalData = useSelector((state) => state.tableData.editModalData);

  const handleEditModalClose = () => {
    // dispatch({
    //   type: 'SET_EDIT_MODAL_OPEN',
    //       data: {
    //         editModalOpen: !state.tableData.editModalOpen,
    //       },
    // });
    dispatch(setEditModalOpen(!open));
  };
  // const classes = useStyles();

  const [maxWidth, setMaxWidth] = useState('md');
  const [locationMsg, setLocationMsg] = useState('');
  const [locationErr, setLocationErr] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: '',
    severity: 'success',
  });
  //   const [currentLatLng, setCurrentLatLng] = useState(null);

  useEffect(() => {
    console.log(locationMsg, locationErr);
  }, [locationMsg, locationErr]);

  const [newData, setNewData] = useState({
    cid: editModalData.cid,
    code: editModalData.code,
    year: editModalData.year,
    affiliation: editModalData.affiliation,
    county: editModalData.county,
    longitude: editModalData.longitude,
    latitude: editModalData.latitude,
    notes: editModalData.notes,
    additional_contact: editModalData.additional_contact,
    producer_id: editModalData.producer_id,
    address: editModalData.address,
    state: editModalData.state,
    last_name: editModalData.last_name,
    email: editModalData.email,
    phone: editModalData.phone,
    latlng: editModalData.latlng,
    tableData: {
      id: editModalData.tableData ? editModalData.tableData.id : 0,
    },
  });

  // const positionError = (e) => {
  //   console.log(e);
  //   setLocationMsg(e.message);
  //   setLocationErr(true);
  // };

  // const getCurrentLatLng = () => {
  //   setLocationMsg("Locating...");
  //   setLocationErr(false);
  //   if (navigator.geolocation) {
  //     try {
  //       navigator.geolocation.getCurrentPosition(setPosition, positionError);
  //     } catch (e) {
  //       console.log("Location catch", e);
  //       setLocationErr(true);
  //     }
  //   } else {
  //     console.error("Location unavailable");
  //     setLocationMsg("Location unavailable");
  //     setLocationErr(true);
  //   }
  // };

  // const setPosition = (position) => {
  //   console.log("Server received: " + position);

  //   setNewData({
  //     ...newData,
  //     latlng: `${position.coords.latitude},${position.coords.longitude}`,
  //     latitude: position.coords.latitude,
  //     longitude: position.coords.longitude,
  //   });
  //   let time = new Date(position.timestamp).toLocaleTimeString("en-US");
  //   setLocationMsg(`Location updated on ${time}`);
  //   setLocationErr(false);
  // };

  const checkLatitude = (arg) => {
    console.log('lat: ', arg);
    return /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(arg)
      ? true
      : false;
  };

  const checkLongitude = (arg) => {
    console.log('lon: ', arg);
    return /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/.test(
      arg,
    )
      ? true
      : false;
  };

  const validateData = () => {
    if (
      checkLatitude(Math.ceil(newData.latitude)) &&
      checkLongitude(Math.ceil(newData.longitude))
    ) {
      //   call update api
      console.log('both');
      postModalUpdate(newData).then(() => {
        // props.handleEditModalClose();
        // dispatch({
        //   type: 'SET_EDIT_MODAL_OPEN',
        //   data: {
        //     editModalOpen: !state.tableData.editModalOpen,
        //   },
        // });
        dispatch(setEditModalOpen(!open));
        // dispatch({
        //   type: 'SET_VALUES_EDITED',
        //   data: {
        //     valuesEdited: !state.tableData.valuesEdited,
        //   },
        // });
        console.log('edit data edited');
        dispatch(setValuesEdited(!valuesEdited));
        // props.setValuesEdited(!props.valuesEdited);

        setNewData({
          cid: '',
          code: '',
          year: '',
          affiliation: '',
          county: '',
          longitude: '',
          latitude: '',
          notes: '',
          additional_contact: '',
          producer_id: '',
          address: '',
          state: '',
          last_name: '',
          email: '',
          phone: '',
          latlng: '',
          tableData: {
            id: null,
          },
        });
        // console.log(res);
      });
      // .then(() => {
      //   setTimeout(window.location.reload(), 4000);
      // });
    } else {
      console.log('neither');
      setLocationErr(true);
      if (
        !checkLatitude(Math.ceil(newData.latitude)) &&
        !checkLongitude(Math.ceil(newData.longitude))
      ) {
        setSnackbarData({
          open: true,
          text: `Wrong value for latitude and longitude, should be between -90 to 90 and -180 to 180 respectively`,
          severity: 'error',
        });
      } else if (!checkLatitude(Math.ceil(newData.latitude))) {
        setSnackbarData({
          open: true,
          text: `Wrong value for latitude, should be between -90 to 90`,
          severity: 'error',
        });
      } else if (!checkLongitude(Math.ceil(newData.longitude))) {
        setSnackbarData({
          open: true,
          text: `Wrong value for longitude, should be between -180 to 180`,
          severity: 'error',
        });
      }
      setLocationMsg('Incorrect format of latitude or longitude');
    }
  };

  const handleMaxWidthChange = (event) => {
    setMaxWidth(event.target.value);
  };

  // const handleFullWidthChange = (event) => {
  //   setFullWidth(event.target.checked);
  // };

  const [selectedToEditSite, setSelectedToEditSite] = useState({
    address: '',
    state: '',
    county: '',
    latitude: '',
    longitude: '',
  });
  useEffect(() => {
    setNewData((newData) => ({
      ...newData,
      address: selectedToEditSite.address ? selectedToEditSite.address : '',
      latitude: selectedToEditSite.latitude ? selectedToEditSite.latitude : '',
      longitude: selectedToEditSite.longitude ? selectedToEditSite.longitude : '',
      county: selectedToEditSite.county ? selectedToEditSite.county : '',
      state: selectedToEditSite.state ? selectedToEditSite.state : '',
      latlng:
        selectedToEditSite.latitude && selectedToEditSite.longitude
          ? `${selectedToEditSite.latitude},${selectedToEditSite.longitude}`
          : '',
    }));
  }, [selectedToEditSite]);
  useEffect(() => {
    setNewData({
      cid: editModalData.cid,
      code: editModalData.code,
      year: editModalData.year,
      affiliation: editModalData.affiliation,
      county: editModalData.county,
      longitude: editModalData.longitude,
      latitude: editModalData.latitude,
      notes: editModalData.notes,
      additional_contact: editModalData.additional_contact,
      producer_id: editModalData.producer_id,
      address: editModalData.address,
      state: editModalData.state,
      last_name: editModalData.last_name,
      email: editModalData.email,
      phone: editModalData.phone,
      latlng: editModalData.latlng,
      tableData: {
        id: editModalData.tableData ? editModalData.tableData.id : 0,
      },
    });
    return () => {
      setNewData({
        cid: '',
        code: '',
        year: '',
        affiliation: '',
        county: '',
        longitude: '',
        latitude: '',
        notes: '',
        additional_contact: '',
        producer_id: '',
        address: '',
        state: '',
        last_name: '',
        email: '',
        phone: '',
        latlng: '',
        tableData: {
          id: null,
        },
      });
    };
  }, [open, editModalData]);
  return (
    <Dialog
      open={open}
      onClose={handleEditModalClose}
      aria-labelledby="form-dialog-title"
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      disableEscapeKeyDown
    >
      <DialogTitle id="form-dialog-title">
        <Grid container justifyContent="space-between">
          <Grid item>
            Site <mark>{editModalData.code}</mark> of producer:{' '}
            <strong>{editModalData.last_name}</strong> [{editModalData.producer_id}]
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
          <Grid item xs>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                You can now use Google Maps to find address, location and county
              </FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={showMap}
                    onChange={(e) => setShowMap(e.target.checked)}
                    name="showMap"
                  />
                }
                label="Show Map"
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {showMap && (
            <Grid item xs={12}>
              <Location
                searchLabel="Search for an address"
                setSelectedToEditSite={setSelectedToEditSite}
                selectedToEditSite={selectedToEditSite}
                markerLatLng={{
                  lat: newData.latitude
                    ? parseFloat(newData.latitude)
                    : selectedToEditSite.latitude,
                  lng: newData.longitude
                    ? parseFloat(newData.longitude)
                    : selectedToEditSite.longitude,
                }}
              />
            </Grid>
          )}
          {/* <Grid item sm={12}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<GpsFixed />}
              onClick={getCurrentLatLng}
            >
              Locate Me
            </Button>
          </Grid> */}

          <Grid item sm={12} lg={12}>
            <TextField
              label="County"
              margin="dense"
              name="county"
              value={
                newData.county ? newData.county : editModalData.county ? editModalData.county : ''
              }
              type="text"
              fullWidth
              onChange={(e) => {
                setNewData({ ...newData, county: e.target.value });
              }}
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <TextField
              label="State"
              margin="dense"
              name="state"
              value={newData.state ? newData.state : editModalData.state ? editModalData.state : ''}
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
              defaultValue={newData.latitude || ''}
              value={newData.latitude || ''}
              type="text"
              onChange={(e) => {
                setNewData({
                  ...newData,
                  latitude: e.target.value,
                  latlng: `${e.target.value}, ${newData.longitude}`,
                });
              }}
              // inputProps={{ step: 0.0001 }}
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <TextField
              label="Longitude"
              fullWidth
              id="editLon"
              margin="dense"
              defaultValue={newData.longitude || ''}
              value={newData.longitude || ''}
              type="text"
              onChange={(e) => {
                setNewData({
                  ...newData,
                  longitude: e.target.value,
                  latlng: `${newData.latitude}, ${e.target.value}`,
                });
              }}
              // inputProps={{ step: 0.0001 }}
            />
          </Grid>

          <Grid item sm={12} lg={12}>
            <TextField
              id="editAddress"
              label="Field Address"
              margin="dense"
              name="address"
              value={
                newData.address
                  ? newData.address
                  : editModalData.address
                  ? editModalData.address
                  : ''
              }
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
              value={newData.notes ? newData.notes : editModalData.notes ? editModalData.notes : ''}
              onChange={(e) => {
                setNewData({ ...newData, notes: e.target.value });
              }}
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <TextField
              id="editAdditionalContact"
              value={
                newData.additional_contact
                  ? newData.additional_contact
                  : editModalData.additional_contact
                  ? editModalData.additional_contact
                  : ''
              }
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
          <Grid item sm={12} lg={12}>
            <TextField
              id="editCode"
              margin="dense"
              name="code"
              value={editModalData.code}
              disabled
              label="Code"
              type="text"
              fullWidth
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <TextField
              value={editModalData.year ? editModalData.year : ''}
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
              value={editModalData.email ? editModalData.email : ''}
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
          onClick={handleEditModalClose}
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

const postModalUpdate = async (data) => {
  const dataString = qs.stringify(data);
  console.log(data);
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

export default EditDataModal;

// EditDataModal.propTypes = {
//   open: PropTypes.bool.isRequired,
//   data: PropTypes.shape({
//     cid: PropTypes.any,
//     code: PropTypes.any,
//     year: PropTypes.any,
//     affiliation: PropTypes.any,
//     county: PropTypes.any,
//     longitude: PropTypes.any,
//     latitude: PropTypes.any,
//     notes: PropTypes.any,
//     additional_contact: PropTypes.any,
//     address: PropTypes.any,
//     producer_id: PropTypes.any,
//     state: PropTypes.any,
//     last_name: PropTypes.any,
//     email: PropTypes.any,
//     phone: PropTypes.any,
//     latlng: PropTypes.any,
//     tableData: PropTypes.any,
//   }),
//   handleEditModalClose: PropTypes.func,
//   setValuesEdited: PropTypes.func,
//   valuesEdited: PropTypes.bool,
// };
