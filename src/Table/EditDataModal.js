// Dependency Imports
import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  IconButton,
  Dialog,
  TextField,
  DialogContent,
  DialogTitle,
  DialogActions,
  makeStyles,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  FormLabel,
} from "@material-ui/core";
import { GpsFixed } from "@material-ui/icons";
import Axios from "axios";

// Local Imports
import { apiURL, apiUsername, apiPassword } from "../utils/api_secret";
import Location from "../Location/Location";

//Global Vars
const qs = require("qs");

// Styles
// County is not being passed on to the server as that would need API modification, and Rick is developing a new API
const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "fit-content",
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
}));

// Default function
const EditDataModal = (props) => {
  const open = props.open;
  const classes = useStyles();
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("md");
  const [locationMsg, setLocationMsg] = useState("");
  const [locationErr, setLocationErr] = useState(false);
  const [showMap, setShowMap] = useState(false);
  //   const [currentLatLng, setCurrentLatLng] = useState(null);
  const [newData, setNewData] = useState({
    cid: props.data.cid,
    code: props.data.code,
    year: props.data.year,
    affiliation: props.data.affiliation,
    county: props.data.county,
    longitude: props.data.longitude,
    latitude: props.data.latitude,
    notes: props.data.notes,
    additional_contact: props.data.additional_contact,
    producer_id: props.data.producer_id,
    address: props.data.address,
    state: props.data.state,
    last_name: props.data.last_name,
    email: props.data.email,
    phone: props.data.phone,
    latlng: props.data.latlng,
    tableData: {
      id: props.data.tableData ? props.data.tableData.id : 0,
    },
  });

  const positionError = (e) => {
    console.log(e);
    setLocationMsg(e.message);
    setLocationErr(true);
  };

  const getCurrentLatLng = () => {
    setLocationMsg("Locating...");
    setLocationErr(false);
    if (navigator.geolocation) {
      try {
        navigator.geolocation.getCurrentPosition(setPosition, positionError);
      } catch (e) {
        console.log("Location catch", e);
        setLocationErr(true);
      }
    } else {
      console.error("Location unavailable");
      setLocationMsg("Location unavailable");
      setLocationErr(true);
    }
  };

  const setPosition = (position) => {
    console.log("Server received: " + position);

    setNewData({
      ...newData,
      latlng: `${position.coords.latitude},${position.coords.longitude}`,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    let time = new Date(position.timestamp).toLocaleTimeString("en-US");
    setLocationMsg(`Location updated on ${time}`);
    setLocationErr(false);
  };

  const checkLatLng = () => {
    let testcase = new RegExp("^-?([1-8]?[1-9]|[1-9]0).{1}d{1,6}");
    // TODO:Check LatLng pattern?
    return true;
  };
  const validateData = () => {
    if (checkLatLng) {
      //   call update api
      let resp = postModalUpdate(newData);
      if (resp) {
        props.handleEditModalClose();
        props.setValuesEdited(!props.valuesEdited);
        console.log(newData);
      } else {
        console.error("AJAX Error!");
      }
    } else {
      setLocationErr(true);
      setLocationMsg("Incorrect format");
    }
  };
  const handleMaxWidthChange = (event) => {
    setMaxWidth(event.target.value);
  };

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };

  const [selectedToEditSite, setSelectedToEditSite] = useState({
    address: "",
    county: "",
    latitude: "",
    longitude: "",
  });
  useEffect(() => {
    setNewData({
      ...newData,
      address: selectedToEditSite.address ? selectedToEditSite.address : "",
      latitude: selectedToEditSite.latitude ? selectedToEditSite.latitude : "",
      longitude: selectedToEditSite.longitude
        ? selectedToEditSite.longitude
        : "",
      county: selectedToEditSite.county ? selectedToEditSite.county : "",
      latlng:
        selectedToEditSite.latitude && selectedToEditSite.longitude
          ? `${selectedToEditSite.latitude},${selectedToEditSite.longitude}`
          : "",
    });
  }, [selectedToEditSite]);
  useEffect(() => {
    setNewData({
      cid: props.data.cid,
      code: props.data.code,
      year: props.data.year,
      affiliation: props.data.affiliation,
      county: props.data.county,
      longitude: props.data.longitude,
      latitude: props.data.latitude,
      notes: props.data.notes,
      additional_contact: props.data.additional_contact,
      producer_id: props.data.producer_id,
      address: props.data.address,
      state: props.data.state,
      last_name: props.data.last_name,
      email: props.data.email,
      phone: props.data.phone,
      latlng: props.data.latlng,
      tableData: {
        id: props.data.tableData ? props.data.tableData.id : 0,
      },
    });
    return () => {
      setNewData({
        cid: "",
        code: "",
        year: "",
        affiliation: "",
        county: "",
        longitude: "",
        latitude: "",
        notes: "",
        additional_contact: "",
        producer_id: "",
        address: "",
        state: "",
        last_name: "",
        email: "",
        phone: "",
        latlng: "",
        tableData: {
          id: null,
        },
      });
    };
  }, [open]);
  return (
    <Dialog
      open={open}
      onClose={props.handleEditModalClose}
      aria-labelledby="form-dialog-title"
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle id="form-dialog-title">
        <Grid container justify="space-between">
          <Grid item>
            Site <mark>{props.data.code}</mark> of producer:{" "}
            <strong>{props.data.last_name}</strong> [{props.data.producer_id}]
          </Grid>
          <Grid item>
            <Select
              autoFocus
              value={maxWidth}
              onChange={handleMaxWidthChange}
              inputProps={{
                name: "max-width",
                id: "max-width",
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
                newData.county
                  ? newData.county
                  : props.data.county
                  ? props.data.county
                  : ""
              }
              type="text"
              fullWidth
              onChange={(e) => {
                setNewData({ ...newData, county: e.target.value });
              }}
            />
          </Grid>
          <Grid item sm={12}>
            <TextField
              label="Latitude"
              fullWidth
              id="editLat"
              margin="dense"
              value={newData.latitude ?? ""}
              type="number"
              onChange={(e) =>
                setNewData({
                  ...newData,
                  latitude: parseFloat(e.target.value),
                })
              }
              inputProps={{ step: 0.0001 }}
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <TextField
              label="Longitude"
              fullWidth
              id="editLon"
              margin="dense"
              value={newData.longitude ?? ""}
              type="number"
              onChange={(e) =>
                setNewData({
                  ...newData,
                  longitude: parseFloat(e.target.value),
                })
              }
              inputProps={{ step: 0.0001 }}
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
                  : props.data.address
                  ? props.data.address
                  : ""
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
              value={
                newData.notes
                  ? newData.notes
                  : props.data.notes
                  ? props.data.notes
                  : ""
              }
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
                  : props.data.additional_contact
                  ? props.data.additional_contact
                  : ""
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
              value={props.data.code}
              disabled
              label="Code"
              type="text"
              fullWidth
            />
          </Grid>
          <Grid item sm={12} lg={12}>
            <TextField
              value={props.data.year ? props.data.year : ""}
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
              value={props.data.email ? props.data.email : ""}
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
          onClick={props.handleEditModalClose}
          color="primary"
          variant={
            window.localStorage.getItem("theme") === "dark"
              ? "contained"
              : "text"
          }
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
  let req = await Axios({
    method: "POST",
    url: `${apiURL}/api/update/alldata`,
    data: dataString,
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  }).catch((e) => {
    console.error(e);
  });
  if (req.status) {
    if (req.status === 200) {
      return true;
    } else {
      console.error("AJAX Error");
      return false;
    }
  } else {
    return false;
  }
};

export default EditDataModal;
