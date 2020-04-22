import React, { useState, useEffect, Fragment } from "react";
import { APIURL, APICreds } from "./hologramConstants";
import Axios from "axios";

import { Map, TileLayer, Marker, Popup } from "react-leaflet";
// import Loading from "react-loading";
import Skeleton from "@material-ui/lab/Skeleton";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
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
  Chip
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

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

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
  }
}));
const DeviceComponent = props => {
  const classes = useStyles();
  console.log(props.location.state);
  const [deviceData, setDeviceData] = useState({ name: "" });
  const [latLng, setLatLng] = useState({ flag: false, data: {} });
  const [mostRecentData, setMostRecentData] = useState({});
  useEffect(() => {
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
            data: [35.764221, -78.69976]
            // data: [
            //   response.data.data.lastsession.latitude,
            //   response.data.data.lastsession.longitude
            // ]
          });
        } else {
        }
      });
    } else {
      // data passed from component
      setDeviceData(props.location.state);
      Axios.get(
        `${APIURL()}/api/1/csr/rdm?deviceid=${
          props.location.state.id
        }&withlocation=true`,
        APICreds()
      )
        .then(response => {
          console.log("most recent data", response);
          setMostRecentData(response.data.data[0]);
        })
        .then(() => {
          setLatLng({
            flag: true,
            data: [
              35.764221,
              -78.69976
              // props.location.state.lastsession.latitude,
              // props.location.state.lastsession.longitude
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
        <GridListTile key={deviceData.id} style={{ width: "100%" }}>
          {/* <Map
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
          </Map> */}
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
  const renderJSON = () => {
    let jdata = JSON.parse(mostRecentData.data);
    jdata = jdata.data;
    let part1 = jdata.substring(0, 100);
    let part2 = jdata.substring(100);
    jdata = atob(jdata);
    return (
      <span style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {jdata}
        {/* <br />
        {part2} */}
      </span>
    );
  };
  const renderTimestamp = () => {
    let jdata = JSON.parse(mostRecentData.data);
    console.log(jdata);
    let ts = jdata.timestamp;
    return <span>{ts}</span>;
  };

  const renderErrorCode = () => {
    let jdata = JSON.parse(mostRecentData.data);
    let ecd = jdata.errorcode;
    return <span>{ecd}</span>;
  };

  const renderTags = () => {
    let allData = JSON.parse(mostRecentData.data);
    let chips = [];
    chips = allData.tags;

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
                        .tz("America/New_York")
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
                        .tz("America/New_York")
                        .format("MM/DD/YYYY")
                        .toString()}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </GridListTile>
        </GridList>
        <GridList row={1}>
          <GridListTile style={{ height: "auto", width: "100%" }}>
            <Card>
              <CardHeader title="Most Recent Connection"></CardHeader>
              <CardContent>
                <List>
                  <ListItem alignItems="flex-start" key={"data"}>
                    <ListItemIcon>
                      <FastForward />
                    </ListItemIcon>
                    <ListItemText primary={"Data"} secondary={renderJSON()} />
                  </ListItem>

                  <ListItem alignItems="flex-start" key="timestamp">
                    <ListItemIcon>
                      <FastForward />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Timestamp"}
                      secondary={renderTimestamp()}
                    />
                  </ListItem>
                  <ListItem alignItems="flex-start" key="errorcode">
                    <ListItemIcon>
                      <FastForward />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Error Code"}
                      secondary={renderErrorCode()}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </GridListTile>
        </GridList>
        <GridList row={1}>
          <GridListTile style={{ height: "auto", width: "100%" }}>
            <Card>
              <CardHeader title="Tags" />
              <CardContent>
                <List>
                  <ListItem alignItems="flex-start" key="tags">
                    <ListItemIcon>
                      <Label />
                    </ListItemIcon>
                    <ListItemText primary={renderTags()} title={"Tags"} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </GridListTile>
        </GridList>
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
