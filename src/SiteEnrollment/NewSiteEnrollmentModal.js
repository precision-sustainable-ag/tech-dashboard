import React, { useState, Fragment, useEffect } from "react";
import {
  Modal,
  Fade,
  Backdrop,
  makeStyles,
  Button,
  Dialog,
  AppBar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Toolbar,
  Slide,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Switch,
  Input,
  TextField,
  InputAdornment,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  CardActions,
} from "@material-ui/core";
import { Close, Search, Save } from "@material-ui/icons";
import { Alert, AlertTitle, Skeleton } from "@material-ui/lab";
import Axios from "axios";
import { apiURL, apiUsername, apiPassword } from "../utils/api_secret";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { statesHash, fetchGrowerByLastName } from "../utils/constants";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
// import { AntSwitch } from "../utils/CustomComponents";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  grid: {
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    marginTop: theme.spacing(2),
  },
}));

const NewSiteEnrollmentModal = (props) => {
  const classes = useStyles();

  const [year, setYear] = useState(props.defaultYear);
  const [irrigation, setIrrigation] = useState(false);
  const [growerInfo, setGrowerInfo] = useState([{}]);
  const [growerLastNameEntry, setGrowerLastNameEntry] = useState("");
  const [addNewGrower, setAddNewGrower] = useState(false);

  const [growerLatLng, setGrowerLatLng] = useState([35.7796, -78.6382]);
  const [growerState, setGrowerState] = useState("");

  const [alert, setAlert] = useState({
    severity: "error",
    title: "Error",
    body: "Please check the error",
    show: false,
  });

  const [growerExists, setGrowerExists] = useState(false);

  const [growerLastNameLoading, setGrowerLastNameLoading] = useState(false);

  const [siteCodesArray, setSiteCodesArray] = useState([]);

  const getGrowerInfoByLastName = (lastNameVal) => {
    if (alert.show) {
      setAlert({
        ...alert,
        show: false,
      });
    }

    // check if last name is NAN and length > 0
    if (lastNameVal !== "" && isNaN(lastNameVal)) {
      console.log("looks good");
      setGrowerLastNameLoading(true);

      let growerSyncObj = fetchGrowerByLastName(lastNameVal);

      growerSyncObj
        .then((resp) => {
          let response = resp.data;

          if (response.data.length > 0) {
            setGrowerExists(true);
            setGrowerInfo(response.data);
            setGrowerLastNameLoading(false);
          } else {
            setGrowerExists(false);
            setGrowerLastNameLoading(false);
          }
        })
        .catch((e) => {
          console.error(e);
          setAlert({
            ...alert,
            show: true,
            body: e,
          });
        });
    } else {
      if (lastNameVal === "") {
        setAlert({
          ...alert,
          show: false,
        });
      } else {
        setAlert({
          title: "Error",
          body: "Grower Last Name not entered or incorrectly formatted!",
          show: true,
          severity: "error",
        });
      }
    }
  };

  const handleYearChange = (el) => {
    setYear(el.target.value);
  };

  const handleGrowerStateChange = (el) => {
    setGrowerState(el.target.value);
  };

  const handleIrrigationChange = (event) => {
    setIrrigation(event.target.checked);
  };
  const renderYears = () => {
    let yearsArray = [props.defaultYear - 2, props.defaultYear - 1];

    yearsArray.push(
      props.defaultYear,
      props.defaultYear + 1,
      props.defaultYear + 2
    );

    return yearsArray.map((year, index) => (
      <MenuItem value={year} key={index}>
        {year}
      </MenuItem>
    ));

    const renderAffiliations = () => {};
  };

  const renderStates = () => {
    let states = statesHash;
    const statesArray = Object.keys(states).map((i) => states[i]);

    return statesArray.map((state, index) => (
      <MenuItem value={state} key={index}>
        {state}
      </MenuItem>
    ));
  };

  const handleFinalSave = () => {
    if (growerLastNameEntry !== "" || growerLastNameEntry.length === 0) {
      setAlert({
        ...alert,
        show: true,
        body: "Last Name Not Entered",
      });
    } else {
      props.handleClose();
    }
  };

  const fetchSiteCodesForProducer = async (producerId) => {
    return await Axios({
      url: `${apiURL}/api/retrieve/site/codes/by/producer/${producerId}`,
      method: "get",
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
    });
  };
  const getSiteCodesForProducer = async (producerId) => {
    let fetchSitesPromise = await fetchSiteCodesForProducer(producerId);
    let responseArr = await [];

    let data = fetchSitesPromise.data.data;
    responseArr = data.map((r, i) => {
      return r.code;
    });

    console.log(responseArr);

    //  responseArr.map((el, i) => {
    //   return <span key={i}>{el}</span>;
    // });
    return <span key={0}>{"hi"}</span>;
    // let responseArrCodes = await fetchSitesPromise
    //   .then((resp) => {
    //     let data = resp.data.data;
    //     // console.log(data);
    //     responseArr = data.map((r, i) => {
    //       return r.code;
    //     });
    //   })
    //   .catch((e) => {
    //     console.error(e);
    //     responseArr = ["Error.."];
    //   });
    // console.log(responseArr);

    // responseArr.map((el, i) => {
    //   return <span key={i}>{el}</span>;
    // });
  };

  //   useEffect(() => {}, [growerState]);

  return (
    <div>
      <Dialog
        fullScreen
        open={props.open}
        onClose={props.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={props.handleClose}
              aria-label="close"
            >
              <Close />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Enroll New Site
            </Typography>
            <Button autoFocus color="inherit" onClick={handleFinalSave}>
              save
            </Button>
          </Toolbar>
        </AppBar>

        <Grid container className={classes.grid}>
          <Grid item lg={12} style={{ marginBottom: "2em" }}>
            <Typography variant="h4">Basic Information</Typography>
            <Divider />
          </Grid>
          <Grid item lg={3} sm={12}>
            <InputLabel id="select-year-helper-label">
              Enrollment Year
            </InputLabel>
            <Select
              labelId="select-year-helper-label"
              id="select-year-helper"
              value={year}
              onChange={handleYearChange}
            >
              {renderYears()}
            </Select>
            <FormHelperText>Select enrollment year</FormHelperText>
          </Grid>
          <Grid item lg={3} sm={12}>
            <InputLabel id="check-site-irrigation-label">
              Irrigation on site?
            </InputLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={irrigation}
                  onChange={handleIrrigationChange}
                  color="primary"
                />
              }
              label={irrigation ? "Yes" : "No"}
            />
          </Grid>
          <Grid item lg={3} sm={12}>
            <InputLabel id="select-partner-code-label">Affiliation</InputLabel>
            <Select
              labelId="select-partner-code-label"
              id="select-partner-code"
              value={year}
              onChange={handleYearChange}
            >
              {renderYears()}
            </Select>
            {/* pull data from affiliation table */}
            <FormHelperText>Lab or partner code</FormHelperText>
          </Grid>
          <Grid item lg={3} sm={12}></Grid>
          <Grid item lg={12} style={{ marginBottom: "2em", marginTop: "2em" }}>
            <Typography variant="h4">Grower Information</Typography>
            <Divider />
          </Grid>
          <Grid item lg={12} style={{ marginBottom: "2em" }}>
            <Typography variant="body1">
              Search for grower last name and add if not available
            </Typography>

            <TextField
              label="Grower Last Name"
              value={growerLastNameEntry}
              onChange={(evt) => {
                setGrowerLastNameEntry(evt.target.value);
                getGrowerInfoByLastName(evt.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {alert.show ? (
              <Alert severity={alert.severity}>
                <AlertTitle>{alert.title}</AlertTitle>
                {alert.body}
              </Alert>
            ) : (
              ""
            )}
            {growerLastNameLoading ? (
              <Grid container style={{ marginTop: "2em" }}>
                <Grid item lg={3}>
                  <Skeleton variant="rect" height="150px"></Skeleton>
                </Grid>
              </Grid>
            ) : growerExists && growerLastNameEntry.length > 0 ? (
              <Grid container style={{ marginTop: "2em" }}>
                {growerInfo.map((grower, index) => (
                  <Grid item lg={3} key={index} style={{ marginRight: "1em" }}>
                    <Card>
                      <CardHeader
                        avatar={
                          <Avatar aria-label="grower-last-name-initial">
                            {grower.last_name.charAt(0)}
                          </Avatar>
                        }
                        title={grower.last_name}
                        //   subheader="September 14, 2016"
                      />
                      <CardContent>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          {/* get rid of email, keep phone? add all sites( site code) that belong to the farmer */}
                          Phone: {grower.phone} <br />
                          Producer ID: {grower.producer_id} <br />
                          {/* Sites: {getSiteCodesForProducer(grower.producer_id)} */}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small">Select</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              ""
            )}
            {growerLastNameLoading ? (
              ""
            ) : growerExists ? (
              ""
            ) : (
              <Grid container style={{ marginTop: "2em" }}>
                <Grid item lg={12}>
                  <Button onClick={() => setAddNewGrower(!addNewGrower)}>
                    Add New Grower
                  </Button>
                </Grid>
                {addNewGrower ? (
                  <Grid item lg={12}>
                    <Grid container>
                      <Grid item lg={4} style={{ paddingRight: "1em" }}>
                        <Grid container spacing={2}>
                          <Grid item lg={12}>
                            <TextField
                              style={{ width: "100%" }}
                              label="Last Name"
                              value={growerLastNameEntry}
                              onChange={(evt) => {
                                // setGrowerLastNameEntry(evt.target.value);
                                // getGrowerInfoByLastName(evt.target.value);
                              }}
                            />
                          </Grid>
                          <Grid item lg={12}>
                            <InputLabel id="select-total-sites-label">
                              How Many Sites?
                            </InputLabel>
                            <Select
                              labelId="select-total-sites-label"
                              id="select-total-sites"
                              value={1}
                              defaultValue={1}
                              onChange={(e) => {}}
                              name="totalSites"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                (val, index) => (
                                  <MenuItem value={val} key={index}>
                                    {val}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                            {/* pull data from affiliation table */}
                            <FormHelperText>
                              Total number of sites for this grower
                            </FormHelperText>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item lg={8} style={{ paddingLeft: "1em" }}></Grid>
                    </Grid>
                  </Grid>
                ) : (
                  ""
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
};

export default NewSiteEnrollmentModal;
