// Dependency Imports
import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
// import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import Skeleton from "@material-ui/lab/Skeleton";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";

import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light";
import dark from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark";
import DateFnsUtils from "@date-io/date-fns";
import qs from "qs";
import {
  makeStyles,
  ListItem,
  ListItemIcon,
  List,
  ListItemText,
  Chip,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Grid,
  TableBody,
  withStyles,
  Typography,
  Fab,
  Button,
  TextField,
  Tooltip,
} from "@material-ui/core";
import {
  Create,
  NetworkCell,
  Router,
  ArrowBackIosOutlined,
  KeyboardArrowUp,
  CalendarToday,
} from "@material-ui/icons";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

// Local Imports
import { apiUsername, apiPassword } from "../../utils/api_secret";
import { APIURL, APICreds, apiCorsUrl } from "../hologramConstants";
import GoogleMap from "../../Location/GoogleMap";
import {
  ScrollTop,
  useAutoRefresh,
  useInfiniteScroll,
} from "../../utils/CustomComponents";
import Loading from "react-loading";
// import { theme } from "highcharts";

SyntaxHighlighter.registerLanguage("json", json);

// Styles
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: "100%",
    height: 300,
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  titleBar: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },

  paper: {
    // padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

// Default function
const DeviceComponent = (props) => {
  const classes = useStyles();
  const [deviceData, setDeviceData] = useState({ name: "" });
  const [latLng, setLatLng] = useState({ flag: false, data: {} });
  const [mostRecentData, setMostRecentData] = useState([]);
  const [userTimezone, setUserTimezone] = useState("America/New_York");
  const [pagesLoaded, setPagesLoaded] = useState(0);
  const [loadMoreDataURI, setLoadMoreDataURI] = useState("");
  const [timeEnd, setTimeEnd] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    setUserTimezone(moment.tz.guess);
    if (props.location.state === undefined) {
      // console.log("undefined !");
      // get data from api
      setDeviceData({ name: "Loading" });
      Axios.get(
        `${APIURL()}/api/1/devices/${
          props.match.params.deviceId
        }/?withlocation=true&timeend=${timeEnd}`,
        APICreds()
      )
        .then((response) => {
          if (response.data.success) {
            setDeviceData(response.data.data);
            setLatLng({
              flag: true,
              // data: [35.764221, -78.69976]
              data: [
                response.data.data.lastsession.latitude,
                response.data.data.lastsession.longitude,
              ],
            });
          } else {
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      // data passed from component via prop
      setDeviceData(props.location.state);

      Axios({
        method: "post",
        url: apiCorsUrl + `/${props.location.state.for}`,
        data: qs.stringify({
          url: `${APIURL()}/api/1/csr/rdm?deviceid=${
            props.location.state.id
          }&withlocation=true&timeend=${timeEnd}`,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        auth: {
          username: apiUsername,
          password: apiPassword,
        },
        responseType: "json",
      })
        .then((response) => {
          setMostRecentData(response.data.data);
          if (response.data.continues) {
            setLoadMoreDataURI(response.data.links.next);
            setPagesLoaded(pagesLoaded + 1);
          }
        })
        .then(() => {
          setLatLng({
            flag: true,
            data: [
              props.location.state.lastsession.latitude,
              props.location.state.lastsession.longitude,
            ],
          });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [timeEnd]);

  const RenderGridListMap = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color={props.isDarkTheme ? "primary" : "default"}
            aria-label={`All Devices`}
            component={Link}
            tooltip="All Devices"
            to={
              props.location.state.for === "watersensors"
                ? "/devices/water-sensors"
                : "/devices/stress-cams"
            }
            startIcon={<ArrowBackIosOutlined />}
          >
            All Devices
          </Button>
        </Grid>
        <Grid item xs={12}>
          <div style={{ height: "350px" }}>
            <GoogleMap
              lat={latLng.data[0]}
              lng={latLng.data[1]}
              from={"device"}
            />
          </div>
        </Grid>
      </Grid>
    );
  };

  //TODO: Auto Reload data
  // const [timer, setTimer] = useState(0);

  // const interval = useAutoRefresh(() => {
  //   setTimer(timer + 1);
  // }, 1000);

  // useEffect(() => {
  //   console.log(timer);
  // }, [timer]);

  const RenderDataTable = () => {
    return (
      <TableContainer component={Paper} className={classes.paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>SNo</StyledTableCell>
              <StyledTableCell>Data</StyledTableCell>
              {/* <StyledTableCell>Tags</StyledTableCell> */}
              <StyledTableCell>Time Stamp</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mostRecentData.length > 0 ? (
              mostRecentData.map((data, index) => (
                <StyledTableRow key={`row-${index}`}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {props.location.state.for !== "watersensors" ? (
                      isBase64(
                        getDataFromJSON(
                          data.data,
                          "dataString",
                          props.location.state.for
                        )
                      ) ? (
                        <Tooltip
                          title={
                            <code style={{ minHeight: "50px", width: "300px" }}>
                              {atob(
                                getDataFromJSON(
                                  data.data,
                                  "dataString",
                                  props.location.state.for
                                )
                              )}
                            </code>
                          }
                        >
                          <code>
                            {getDataFromJSON(
                              data.data,
                              "dataString",
                              props.location.state.for
                            )}
                          </code>
                        </Tooltip>
                      ) : (
                        <SyntaxHighlighter
                          language="json"
                          style={props.isDarkTheme ? dark : docco}
                        >
                          {getDataFromJSON(
                            data.data,
                            "dataString",
                            props.location.state.for
                          )}
                        </SyntaxHighlighter>
                      )
                    ) : (
                      <code>
                        {getDataFromJSON(
                          data.data,
                          "dataString",
                          props.location.state.for
                        )}
                      </code>
                    )}
                  </TableCell>
                  {/* <TableCell>{getDataFromJSON(data.data, "tags")}</TableCell> */}
                  <TableCell datatype="">
                    {getDataFromJSON(
                      data.data,
                      "timestamp",
                      props.location.state.for
                    )}
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body1">No Data</Typography>
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const getDataFromJSON = (jsonData, type, sensorType) => {
    jsonData = JSON.parse(jsonData);

    let dataStringParsed =
      sensorType === "watersensors"
        ? atob(jsonData.data)
        : isValidJson(jsonData.data)
        ? JSON.stringify(JSON.parse(jsonData.data), null, 2)
        : jsonData.data;
    switch (type) {
      case "dataString":
        return dataStringParsed;
      case "tags":
        return <RenderTags chipsArray={jsonData.tags} />;
      case "timestamp":
        return moment
          .tz(jsonData.received, "UTC")
          .tz(userTimezone)
          .format("dddd, MMMM Do YYYY, h:mm:ss A");
      default:
        return "";
    }
  };
  const RenderTags = ({ chipsArray }) => {
    let chips = chipsArray;

    return chips.map((chip, index) => (
      <Chip
        key={`chip${index}`}
        style={{ marginRight: "1em", marginBottom: "1em" }}
        label={chip}
      />
    ));
  };

  const DateProvider = () => {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          disableFuture
          autoOk
          label="Show records from"
          format="MM/dd/yyyy"
          value={moment.unix(timeEnd)}
          onChange={(date) => {
            setTimeEnd(moment(date).unix());
          }}
          animateYearScrolling
        />
      </MuiPickersUtilsProvider>
    );
  };

  const RenderGridListData = () => {
    return (
      <Grid container spacing={3}>
        <Grid item>
          <List>
            <ListItem alignItems="center" key="last-date">
              <ListItemIcon>
                <CalendarToday />
              </ListItemIcon>
              <ListItemText primary={<DateProvider />} />
            </ListItem>
          </List>
        </Grid>
        {deviceData.links && deviceData.links.cellular && (
          <Grid item xs={12} md={4}>
            <List>
              <ListItem alignItems="center" key="lastconnect">
                <ListItemIcon>
                  <Router />
                </ListItemIcon>
                <ListItemText
                  primary={"Last Connection"}
                  secondary={moment
                    .tz(deviceData.links.cellular[0].last_connect_time, "UTC")
                    .tz(userTimezone)
                    .format("MM/DD/YYYY hh:mm A")
                    .toString()}
                />
              </ListItem>
            </List>
          </Grid>
        )}
        <Grid item xs={12} md={4}>
          <List>
            <ListItem alignItems="center" key="network">
              <ListItemIcon>
                <NetworkCell />
              </ListItemIcon>
              <ListItemText
                primary={"Network"}
                secondary={deviceData.links.cellular[0].last_network_used}
              />
            </ListItem>
          </List>
        </Grid>

        <Grid item xs={12}>
          <RenderDataTable />
        </Grid>
        {isFetching && (
          <Grid item xs={12}>
            <Grid container justify="center" alignItems="center" spacing={3}>
              <Grid item>
                <Loading
                  className="scrollLoadingSpinner"
                  width={50}
                  height={50}
                  type="spinningBubbles"
                  color="#2d2d2d"
                />
              </Grid>
              <Grid item>
                <Typography variant="h5">
                  Fetching Page {pagesLoaded + 1}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  };

  const fetchMoreData = async () => {
    if (loadMoreDataURI) {
      console.log("Fetching..");
      await Axios({
        method: "post",
        url: apiCorsUrl + `/${props.location.state.for}`,
        data: qs.stringify({
          url: `${APIURL()}${loadMoreDataURI}`,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        auth: {
          username: apiUsername,
          password: apiPassword,
        },
        responseType: "json",
      }).then((response) => {
        // console.log(response);
        let deviceDataShadow = mostRecentData || [];
        deviceDataShadow.push(response.data.data);

        let devicesFlatData = deviceDataShadow.flat();
        setMostRecentData(devicesFlatData);
        if (response.data.continues) {
          setLoadMoreDataURI(response.data.links.next);
          setPagesLoaded(pagesLoaded + 1);
        } else {
          setLoadMoreDataURI("");
        }
        setIsFetching(false);
      });
    } else {
      return false;
    }
  };
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreData);

  return latLng.flag ? (
    <div>
      <RenderGridListMap />
      <RenderGridListData />
      <ScrollTop {...props}>
        <Fab color={`primary`} size="medium" aria-label="scroll back to top">
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
    </div>
  ) : (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Skeleton variant="rect" width="100%" height="300px" animation="wave" />
      </Grid>
      <Grid item xs={12}>
        <Skeleton variant="rect" width="100%" height="50vh" animation="pulse" />
      </Grid>
    </Grid>
  );
};

const isValidJson = (json) => {
  if (!(json && typeof json === "string")) {
    return false;
  }

  try {
    JSON.parse(json);
    return true;
  } catch (error) {
    return false;
  }
};

const isBase64 = (str = "") => {
  const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

  return base64regex.test(str);
};
export default DeviceComponent;
