import React, { Fragment, useState, useEffect } from "react";
import { red, grey, green } from "@material-ui/core/colors";
import { NavLink, Redirect } from "react-router-dom";
import { CardActionArea } from "@material-ui/core";
import moment from "moment-timezone";

const deadDeviceBG = red[300];
// const deadDeviceCol = red[50];
const deadDeviceCol = "#360000 !important";
const activeDeviceBG = green[100];
// const activeDeviceCol = green[50];
const activeDeviceCol = "#114C2A !important";

const DataParser = props => {
  const [deviceId, setDeviceId] = useState(0);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const setDeviceState = deviceId => {
    setDeviceId(deviceId);
    setShouldRedirect(true);
  };

  let device = props.deviceData;

  let dateStatus = "";
  let deviceDateStr = "";
  let today = false;
  if (device.lastsession) {
    let deviceSessionBegin = device.links.cellular[0].last_connect_time;
    let deviceDateFormatted = moment
      .tz(deviceSessionBegin, "Africa/Abidjan")
      .tz("America/New_York")
      .format("MM/DD/YYYY hh:mm A");

    deviceDateStr = deviceDateFormatted.toString();
    let deviceDay = moment
      .tz(deviceSessionBegin, "Africa/Abidjan")
      .tz("America/New_York")
      .date();

    let deviceMonth =
      moment
        .tz(deviceSessionBegin, "Africa/Abidjan")
        .tz("America/New_York")
        .month() + 1;

    let deviceYear = moment
      .tz(deviceSessionBegin, "Africa/Abidjan")
      .tz("America/New_York")
      .year();

    let now = moment();
    let todayDay = now.date();
    let todayMonth = now.month() + 1;
    let todayYear = now.year();

    if (todayYear === deviceYear && todayMonth === deviceMonth) {
      // active this month
      if (todayDay === deviceDay) {
        // active today
        dateStatus = "Active Today";
        today = true;
      } else {
        dateStatus = "Active this month";
      }
    } else {
      // not active this month
      dateStatus = "Not active this month";
    }
  }

  return shouldRedirect ? (
    <Redirect
      to={{
        pathname: `/devices/${deviceId}`,
        state: device
      }}
    />
  ) : (
    <CardActionArea
      className={
        !device.lastsession
          ? "deviceActionArea deadDevice"
          : "deviceActionArea aliveDevice"
      }
      style={{
        backgroundColor: device.lastsession
          ? today
            ? activeDeviceBG
            : ""
          : deadDeviceBG,
        color: device.lastsession
          ? today
            ? activeDeviceCol
            : ""
          : deadDeviceCol
      }}
      disabled={!device.lastsession ? true : false}
      onClick={() => {
        setDeviceState(device.id);
      }}
    >
      <p style={{ fontWeight: "bold" }}>{device.name}</p>
      {device.lastsession ? (
        <Fragment>
          <p>Last Session: {deviceDateStr}</p>
          <p style={{ fontWeight: "bold" }}>{dateStatus}</p>
        </Fragment>
      ) : (
        <Fragment>
          <p style={{ fontWeight: "bold" }}>Last Session: Not Available</p>
          <p style={{ fontWeight: "bold" }}>Device Dead</p>
        </Fragment>
      )}
    </CardActionArea>
  );
};

export default DataParser;
