import React, { useState, useEffect } from "react";

import {
  Paper,
  Container,
  FormControl,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Button,
  IconButton,
  TextField,
  Fab,
  InputAdornment,
  Backdrop,
  useTheme,
  useMediaQuery,
  Modal,
  Fade,
  Input,
  FormHelperText,
  FormGroup
} from "@material-ui/core";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import Axios from "axios";
import { apiUsername, apiPassword } from "../../utils/api_secret";
import {
  Add,
  CropFree,
  DoneAll,
  CheckCircle,
  Check,
  Save
} from "@material-ui/icons";
import ConfirmDialog from "./ConfirmDialog";

const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  root: {
    transform: "translateZ(0px)",
    flexGrow: 1
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  table: {
    minWidth: 650
  },
  speedDial: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

const DeviceEnroll = () => {
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [devices, setDevices] = useState([]);

  const [deviceWsensorRelations, setDeviceWsensorRelations] = useState([]);

  const [backdropOpen, setBackdropOpen] = useState(false);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogDecision, setConfirmDialogDecision] = useState(false);
  const [open, setOpen] = useState(false);

  const getDevices = async () => {
    return await Axios.get(
      "https://techdashboard.tk/api/hologram/devices/all",
      {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        auth: {
          username: apiUsername,
          password: apiPassword
        }
      }
    );
  };

  const pushGatewaySerialNo = async (deviceId, gatewaySerialNo) => {
    let formData = new FormData();
    formData.append("deviceId", deviceId);
    formData.append("gatewaySerialNo", gatewaySerialNo);
    formData.append("isActive", true);
    Axios.post(
      "https://techdashboard.tk/api/hologram/relationships/watersensor",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        auth: {
          username: apiUsername,
          password: apiPassword
        }
      }
    )
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error.response);
      });
  };
  const getWsensorRelations = async () => {
    return await Axios.get(
      "https://techdashboard.tk/api/hologram/relationships/watersensor/all",
      {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        auth: {
          username: apiUsername,
          password: apiPassword
        }
      }
    );
  };

  const doesDeviceIdExistsInRelationship = deviceId => {
    const found = deviceWsensorRelations.some(el => el.device_id === deviceId);

    return found;
  };

  const setDeviceGatewaySensorValues = deviceId => {
    if (doesDeviceIdExistsInRelationship(deviceId)) {
      const value = deviceWsensorRelations.map(el => el.device_id === deviceId);

      return value;
    }
  };
  const showGatewaySerialNumber = (sno, deviceId) => {
    let isTextFieldFilled;
    if (sno === null) {
      sno = "";
      console.log(deviceWsensorRelations);
      if (deviceWsensorRelations.length > 0) {
        for (const item of deviceWsensorRelations) {
          let deviceId = item.device_id;
          let deviceGatewaySerialNo = item.gateway_serial_no;
          //   get serial no of the specific deviceid
          var deviceIdEle = document.getElementById(deviceId);
          if (deviceIdEle != null) {
            // set serial no for a specific device id
            deviceIdEle.value = deviceGatewaySerialNo;

            isTextFieldFilled = true;
          } else {
            isTextFieldFilled = false;
            // console.log("no matching device-serial relation");
          }
        }
      } else {
        isTextFieldFilled = false;
        console.log("device sensor relationship empty");
      }
      //   console.log(deviceId, isTextFieldFilled);
      //   console.log("drawing serial no textfiels");
      return (
        <TextField
          id={deviceId}
          fullWidth
          disabled={doesDeviceIdExistsInRelationship(deviceId)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CropFree />
              </InputAdornment>
            ),
            endAdornment: !isTextFieldFilled ? (
              <InputAdornment position="end">
                {doesDeviceIdExistsInRelationship(deviceId) ? (
                  ""
                ) : (
                  <IconButton
                    aria-label="update-serial-number"
                    onClick={() => confirmAddSerialDeviceRelation(deviceId)}
                  >
                    <Check />
                  </IconButton>
                )}
              </InputAdornment>
            ) : (
              ""
            )
          }}
        />
      );
    } else return sno;
  };

  const confirmAddSerialDeviceRelation = deviceId => {
    const ele = document.getElementById(deviceId);

    if (window.confirm("Are you sure?")) {
      //   console.log(deviceId, ele.value);
      if (ele.value.length > 0) {
        if (!isNaN(ele.value)) {
          pushGatewaySerialNo(deviceId, ele.value)
            .then(response => {
              console.log(response);
              // window.location.reload();
            })
            .catch(e => {
              console.error("axios error: ", e);
            });
        }
      }
      // pushGatewaySerialNo(gatewaySerialNo);
      //   ele.disabled = true;
    } else {
      //   ele.disabled = false;
    }
    // return (
    //   <ConfirmDialog
    //     fullScreen={fullScreen}
    //     open={true}
    //     setOpen={setConfirmDialogOpen}
    //     confirmDialogDecision={setConfirmDialogDecision}
    //   />
    // );
  };
  useEffect(() => {
    let devices = getDevices();
    let wsensorRelations = getWsensorRelations();

    devices
      .then(response => {
        let data = response.data;
        const distinctDeviceIds = [];
        const map = new Map();
        for (const item of response.data.devices) {
          if (!item.device_name.startsWith("Eve")) {
            if (!map.has(item.device_id)) {
              map.set(item.device_id, true); // set any value to Map
              distinctDeviceIds.push({
                device_id: item.device_id,
                device_name: item.device_name,
                gateway_serial_no: item.gateway_serial_no
              });
            }
          }
        }
        return distinctDeviceIds;
      })
      .then(devices => {
        setDevices(devices);
      });

    wsensorRelations
      .then(response => {
        let data = response.data;
        setDeviceWsensorRelations(data.devices);
      })
      .then(() => {});

    // currently empty array, could be used to trigger new device update
  }, []);

  const speedDialActions = [
    { icon: <Add />, name: "Copy" },
    { icon: <Save />, name: "Save" }
  ];
  const handleOpen = () => {
    setBackdropOpen(true);
  };

  const handleClose = () => {
    setBackdropOpen(false);
  };

  const addNewDevicePopup = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
  };
  return (
    <div className={classes.root}>
      {/* <Backdrop open={backdropOpen} />
      <SpeedDial
        className={classes.speedDial}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={backdropOpen}
      >
        {speedDialActions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleClose}
          />
        ))}
      </SpeedDial> */}
      <Container maxWidth="xl">
        <Modal
          BackdropComponent={Backdrop}
          className={classes.modal}
          BackdropProps={{ timeout: 600 }}
          closeAfterTransition
          open={open}
          onClose={handleModalClose}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <h2 id="transition-modal-title">Add New Device Relation</h2>
              <p id="transition-modal-description">
                Enter device details below
              </p>
              <div>
                <FormGroup>
                  <FormControl>
                    <InputLabel htmlFor="deviceIdInput">Device ID</InputLabel>
                    <Input id="deviceIdInput" aria-describedby="device-id" />
                    <FormHelperText id="device-id">
                      Make sure that this id has not already been used in the
                      table
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <InputLabel htmlFor="gatewaySerialNumberInout">
                      Gateway Serial Number
                    </InputLabel>
                    <Input
                      id="gatewaySerialNumberInout"
                      aria-describedby="gateway-serial-number"
                    />
                    <FormHelperText id="gateway-serial-number"></FormHelperText>
                  </FormControl>
                  <FormControl>
                    <Button
                      color="primary"
                      variant="contained"
                      type="submit"
                      style={{ marginTop: "3em" }}
                    >
                      ADD DEVICE
                    </Button>
                  </FormControl>
                </FormGroup>
              </div>
            </div>
          </Fade>
        </Modal>
        <Grid contianer direction="row" style={{ flexGrow: 1 }}>
          <Grid item md={6}>
            <Typography variant="h4" component="h4">
              Enroll Device
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Button onClick={addNewDevicePopup}>Add New Device</Button>
          </Grid>
        </Grid>
        {/* <FormControl className={classes.formControl}>
        <InputLabel>Device ID</InputLabel>
        <Select value={selectedDeviceId} onChange={handleDeviceDropdown}>
          <MenuItem value={10}>asjdad</MenuItem>
          <MenuItem value={20}>asda</MenuItem>
          <MenuItem value={30}>dkfdsf</MenuItem>
        </Select>
      </FormControl> */}

        <div style={{ paddingTop: "2em" }}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table stickyHeader className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Device ID</TableCell>
                      <TableCell>Device Name</TableCell>
                      <TableCell>Gateway Serial Number</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {devices.map((device, index) => (
                      <TableRow key={index}>
                        <TableCell>{device.device_id}</TableCell>
                        <TableCell>{device.device_name}</TableCell>
                        <TableCell>
                          {showGatewaySerialNumber(
                            device.gateway_serial_no,
                            device.device_id
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
};

export default DeviceEnroll;
