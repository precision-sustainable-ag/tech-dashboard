import React, { useState, useEffect, Fragment } from "react";
import { APIURL, APICreds, apiCorsUrl } from "./hologramConstants";
import Axios from "axios";

import { Map, TileLayer, Marker, Popup } from "react-leaflet";
// import Loading from "react-loading";
import Skeleton from "@material-ui/lab/Skeleton";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import qs from "qs";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  GridList,
  GridListTile,
  GridListTileBar,
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
  Typography,
  TableBody,
  withStyles,
  TablePagination
} from "@material-ui/core";
import {
  Create,
  SimCard,
  Phone,
  Business,
  Category,
  SimCardTwoTone,
  NetworkCell,
  Router,
  SignalCellularConnectedNoInternet0Bar,
  FastForward,
  Label,
  ArrowBackIosOutlined
} from "@material-ui/icons";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import { apiUsername, apiPassword } from "../utils/api_secret";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover
    }
  }
}))(TableRow);

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: "100%",
    height: 300,
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)"
  },
  titleBar: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"
  },
  icon: {
    color: "white"
  },
  paper: {
    // padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));
const DeviceComponent = props => {
  const classes = useStyles();
  // console.log(props.location.state);
  const [deviceData, setDeviceData] = useState({ name: "" });
  const [latLng, setLatLng] = useState({ flag: false, data: {} });
  const [mostRecentData, setMostRecentData] = useState({});
  const [userTimezone, setUserTimezone] = useState("America/New_York");

  useEffect(() => {
    setUserTimezone(moment.tz.guess);
    if (props.location.state === undefined) {
      console.log("undefined !");
      // get data from api
      setDeviceData({ name: "Loading" });
      Axios.get(
        `${APIURL()}/api/1/devices/${
          props.match.params.deviceId
        }/?withlocation=true`,
        APICreds()
      ).then(response => {
        if (response.data.success) {
          setDeviceData(response.data.data);
          setLatLng({
            flag: true,
            // data: [35.764221, -78.69976]
            data: [
              response.data.data.lastsession.latitude,
              response.data.data.lastsession.longitude
            ]
          });
        } else {
        }
      });
    } else {
      // data passed from component via prop
      setDeviceData(props.location.state);

      Axios({
        method: "post",
        url: apiCorsUrl,
        data: qs.stringify({
          url: `${APIURL()}/api/1/csr/rdm?deviceid=${
            props.location.state.id
          }&withlocation=true`
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        auth: {
          username: apiUsername,
          password: apiPassword
        },
        responseType: "json"
      })
        .then(response => {
          // console.log("most recent data", response);
          setMostRecentData(response.data.data);
        })
        .then(() => {
          setLatLng({
            flag: true,
            data: [
              props.location.state.lastsession.latitude,
              props.location.state.lastsession.longitude
            ]
          });
        });
    }
  }, []);
  const renderCard = () => {
    return (
      <Card>
        <CardHeader
          title={deviceData.name}
          subheader={`Device ID: ${deviceData.id}`}
          action={
            <Link to="/devices">
              <IconButton aria-label="options">
                <ArrowBackIosOutlined />
              </IconButton>
            </Link>
          }
        />

        <CardContent>
          <Map center={latLng.data} style={{ height: "300px" }} zoom={13}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={latLng.data}>
              <Popup>Last Active Location</Popup>
            </Marker>
          </Map>
          <div className="belowMapContent"></div>
        </CardContent>
      </Card>
    );
  };

  const renderGridListMap = () => {
    return (
      <GridList spacing={1} className={classes.gridList}>
        <GridListTile
          key={deviceData.id}
          style={{ width: "100%", height: "300px" }}
        >
          <Map
            center={latLng.data}
            style={{ height: "300px" }}
            zoom={13}
            zoomControl={false}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={latLng.data}>
              <Popup>Last Active Location</Popup>
            </Marker>
          </Map>
          <GridListTileBar
            title={deviceData.name}
            style={{
              zIndex: "999"
            }}
            titlePosition="top"
            actionIcon={
              <Link to="/devices">
                <IconButton
                  aria-label={`All Devices`}
                  tooltip="All Devices"
                  className={classes.icon}
                  to="/devices"
                >
                  <ArrowBackIosOutlined />
                </IconButton>
              </Link>
            }
            actionPosition="left"
            className={classes.titleBar}
          />
        </GridListTile>
      </GridList>
    );
  };
  const renderDataTable = () => {
    return (
      <TableContainer component={Paper} className={classes.paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>SNO</StyledTableCell>
              <StyledTableCell>Data</StyledTableCell>
              <StyledTableCell>Tags</StyledTableCell>
              <StyledTableCell>Time Stamp</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mostRecentData.map(
              (data, index) => (
                // index <= 8 ? (
                <StyledTableRow key={`row-${index}`}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {getDataFromJSON(data.data, "dataString")}
                  </TableCell>
                  <TableCell>{getDataFromJSON(data.data, "tags")}</TableCell>
                  <TableCell>
                    {getDataFromJSON(data.data, "timestamp")}
                  </TableCell>
                </StyledTableRow>
              )
              // ) : (
              //   ""
              // )
            )}
          </TableBody>
        </Table>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, mostRecentData.length]}
          component="div"
          count={mostRecentData.length}
        /> */}
      </TableContainer>
    );
    // return <span>Data Table Here</span>;
    // let jdata = JSON.parse(mostRecentData.data);
    // jdata = jdata.data;
    // let part1 = jdata.substring(0, 100);
    // let part2 = jdata.substring(100);
    // jdata = atob(jdata);
    // return (
    //   <span style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
    //     {jdata}
    //     {/* <br />
    //     {part2} */}
    //   </span>
    // );
  };

  const getDataFromJSON = (jsonData, type) => {
    // console.log(jsonData);

    jsonData = JSON.parse(jsonData);
    let dataStringParsed = atob(jsonData.data);
    switch (type) {
      case "dataString":
        return dataStringParsed;
      case "tags":
        return renderTags(jsonData.tags);
      case "timestamp":
        return moment
          .tz(jsonData.received, "UTC")
          .tz(userTimezone)
          .format("dddd, MMMM Do YYYY, h:mm:ss a");
      default:
        return "";
    }
  };
  const renderTags = chipsArray => {
    // console.log(mostRecentData);
    // let allData = JSON.parse(mostRecentData[index]);
    let chips = chipsArray;
    // chips = allData.tags;

    return chips.map((chip, index) => (
      <Chip
        key={`chip${index}`}
        style={{ marginRight: "1em", marginBottom: "1em" }}
        label={chip}
      />
    ));
  };

  const renderGridListData = () => {
    return (
      <Fragment key="griddata">
        <GridList
          cols={3}
          style={{
            flexWrap: "nowrap",
            transform: "translateZ(0)",
            height: "auto"
          }}
        >
          <GridListTile style={{ height: "auto" }}>
            <Card>
              {/* <CardHeader title="General Info"></CardHeader> */}
              <CardContent>
                <List>
                  <ListItem alignItems="flex-start" key="created">
                    <ListItemIcon>
                      <Create />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Created"}
                      secondary={deviceData.whencreated}
                    />
                  </ListItem>

                  {/* <Divider /> */}

                  <ListItem alignItems="flex-start" key="imei">
                    <ListItemIcon>
                      <SimCard />
                    </ListItemIcon>
                    <ListItemText
                      primary={"IMEI"}
                      secondary={deviceData.imei}
                    />
                  </ListItem>
                  {/* <Divider /> */}
                  <ListItem alignItems="flex-start" key="phone">
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Phone Number"}
                      secondary={
                        deviceData.phonenumber ? deviceData.phonenumber : "None"
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </GridListTile>
          <GridListTile style={{ height: "auto" }}>
            <Card>
              {/* <CardHeader title="General Info"></CardHeader> */}
              <CardContent>
                <List>
                  <ListItem alignItems="flex-start" key="orgid">
                    <ListItemIcon>
                      <Business />
                    </ListItemIcon>
                    <ListItemText
                      primary={"ORG ID"}
                      secondary={deviceData.orgid}
                    />
                  </ListItem>
                  <ListItem alignItems="flex-start" key="imeisv">
                    <ListItemIcon>
                      <SimCardTwoTone />
                    </ListItemIcon>
                    <ListItemText
                      primary={"IMEI SV"}
                      secondary={deviceData.imei_sv}
                    />
                  </ListItem>
                  <ListItem alignItems="flex-start" key="type">
                    <ListItemIcon>
                      <Category />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Type"}
                      secondary={deviceData.type}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </GridListTile>
          <GridListTile style={{ height: "auto" }}>
            <Card>
              {/* <CardHeader title="General Info"></CardHeader> */}
              <CardContent>
                <List>
                  <ListItem alignItems="flex-start" key="network">
                    <ListItemIcon>
                      <NetworkCell />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Network"}
                      secondary={deviceData.links.cellular[0].last_network_used}
                    />
                  </ListItem>
                  <ListItem alignItems="flex-start" key="lastconnect">
                    <ListItemIcon>
                      <Router />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Last Connection"}
                      secondary={moment
                        .tz(
                          deviceData.links.cellular[0].last_connect_time,
                          "UTC"
                        )
                        .tz(userTimezone)
                        .format("MM/DD/YYYY hh:mm A")
                        .toString()}
                    />
                  </ListItem>
                  <ListItem alignItems="flex-start" key="expires">
                    <ListItemIcon>
                      <SignalCellularConnectedNoInternet0Bar />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Expires"}
                      secondary={moment
                        .tz(deviceData.links.cellular[0].whenexpires, "UTC")
                        .tz(userTimezone)
                        .format("MM/DD/YYYY")
                        .toString()}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </GridListTile>
        </GridList>
        <Grid container>
          <Grid item md={12}>
            <Typography
              variant="h5"
              style={{ paddingTop: "24px", paddingBottom: "24px" }}
            >
              Data
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={12}>
            {renderDataTable()}
          </Grid>
        </Grid>
        {/* <GridList row={1}>
          <GridListTile style={{ height: "auto", width: "100%" }}>
            <Card>
              <CardHeader title="Most Recent Connection"></CardHeader>
              <CardContent>
                <List>
                  <ListItem alignItems="flex-start" key={"data"}>
                    <ListItemIcon>
                      <FastForward />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Data"}
                      secondary={renderDataTable()}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </GridListTile>
        </GridList> */}
        {/* <GridList row={1}>
          <GridListTile style={{ height: "auto", width: "100%" }}>
            <Card>
              <CardHeader title="Tags" />
              <CardContent>
                <List>
                  <ListItem alignItems="flex-start" key="tags">
                    <ListItemIcon>
                      <Label />
                    </ListItemIcon>
                    <ListItemText primary={renderTags(0)} title={"Tags"} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </GridListTile>
        </GridList> */}
      </Fragment>
    );
  };
  return latLng.flag ? (
    <div>
      {renderGridListMap()}
      {renderGridListData()}
    </div>
  ) : (
    // <Loading width="500px" height="500px" type="cubes" />
    <Skeleton variant="rect" width="100%" height="300px" animation="wave" />
  );
};

export default DeviceComponent;
