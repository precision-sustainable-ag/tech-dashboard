// Dependency Imports
import React, { useState, useEffect } from 'react';
import { green, yellow, grey } from '@material-ui/core/colors';
import { Redirect, useHistory } from 'react-router-dom';
import {
  Button,
  CardContent,
  Divider,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import moment from 'moment-timezone';
import { Cancel, Edit, Save } from '@material-ui/icons';
import Axios from 'axios';
import qs from 'qs';
import { apiPassword, apiURL, apiUsername } from '../utils/api_secret';
import PropTypes from 'prop-types';

// Styles
const deviceColors = {
  withinLastHour: green[800],
  lastFourHours: green[400],
  lastThirtySixHours: yellow[400],
  lastMonth: grey[400],
  default: 'white',
};

// Default function
const DataParser = (props) => {
  const history = useHistory();
  const [deviceId, setDeviceId] = useState(0);
  const [shouldRedirect] = useState(false);
  const [deviceBGColor, setDeviceBGColor] = useState('white');
  const [deviceDateStr, setDeviceDateStr] = useState('');
  const [dateStatus, setDateStatus] = useState('');
  const [dateStringFormatted, setDateStringFormatted] = useState('');
  let device = props.deviceData;
  device.for = props.for;
  const { lastSession, setRefreshDevices } = props;
  // console.log("deviceData", props.deviceData);
  const setDeviceState = (deviceId) => {
    setDeviceId(deviceId);
    history.push(`/devices/${deviceId}`, {
      ...device,
      activeTag: props.activeTag,
    });
    // to={{
    //     pathname: ,
    //     state: device,
    //     activeTag: props.activeTag,
    //   }}
    //setShouldRedirect(true);
  };

  useEffect(() => {
    // let now = moment();
    // let todayDay = now.date();
    // let todayMonth = now.month() + 1;
    // let todayYear = now.year();
    // let today = false;

    if (device.lastsession) {
      // guess user's timezone
      let tz = moment.tz.guess();

      let deviceSessionBegin = device.links.cellular[0].last_connect_time;
      // get device session begin as user local time
      let deviceDateLocal = moment.tz(deviceSessionBegin, 'Africa/Abidjan').tz(tz);

      setDateStringFormatted(deviceDateLocal.format('MM/DD/YYYY hh:mm A'));

      let deviceDateFormatted = deviceDateLocal.fromNow();

      let dateDiff = moment.duration(moment().diff(deviceDateLocal)).asHours();
      // console.log(dateDiff);

      setDeviceDateStr(deviceDateFormatted.toString());
      // let deviceDay = moment
      //   .tz(deviceSessionBegin, "Africa/Abidjan")
      //   .tz(tz)
      //   .date();

      // let deviceMonth =
      //   moment
      //     .tz(deviceSessionBegin, "Africa/Abidjan")
      //     .tz(tz)
      //     .month() + 1;

      // let deviceYear = moment
      //   .tz(deviceSessionBegin, "Africa/Abidjan")
      //   .tz(tz)
      //   .year();

      // if (todayYear === deviceYear && todayMonth === deviceMonth) {
      //   // active this month
      //   if (todayDay === deviceDay) {
      //     // active today
      //     dateStatus = "Active Today";
      //     today = true;
      //   } else {
      //     dateStatus = "Active this month";
      //   }
      // } else {
      //   // not active this month
      //   dateStatus = "Not active this month";
      // }
      if (Math.round(dateDiff) <= 1) {
        setDateStatus('Active within last hour');
        setDeviceBGColor(deviceColors.withinLastHour);
      } else if (dateDiff > 1 && dateDiff <= 4) {
        setDateStatus('Active within last 4 hours');
        setDeviceBGColor(deviceColors.lastFourHours);
      } else if (dateDiff > 4 && dateDiff <= 36) {
        setDateStatus('Active within last 36 hours');
        setDeviceBGColor(deviceColors.lastThirtySixHours);
      } else if (dateDiff > 36 && dateDiff <= 730) {
        setDateStatus('Active last month');
        setDeviceBGColor(deviceColors.lastMonth);
      } else {
        setDateStatus('Last active ' + deviceDateLocal.format('MM/DD/Y'));
        setDeviceBGColor(deviceColors.default);
      }
    }
  }, [device.lastsession, device.links]);
  const [showEditBtn, setShowEditBtn] = useState(false);
  const [isDeviceNameBeingEdited, setIsDeviceNameBeingEdited] = useState(false);
  const [deviceActualName, setDeviceActualName] = useState(device.nickname || device.name);

  const handleMouseEnter = (deviceName) => {
    setShowEditBtn(true);
    setDeviceActualName(deviceName);
  };
  const handleMouseLeave = () => {
    if (isDeviceNameBeingEdited) {
      setShowEditBtn(true);
    } else {
      setShowEditBtn(false);
    }
  };
  const publishDeviceNickname = () => {
    setRefreshDevices(true);
    updateDeviceNickname()
      .then((r) => {
        if (r.data.status === 'success') {
          // setDeviceNickname(deviceActualName);
          device['nickname'] = deviceActualName;
          setIsDeviceNameBeingEdited(false);
          setShowEditBtn(false);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const updateDeviceNickname = () => {
    // send a put/post request
    let type = '';
    if (props.for === 'watersensors') {
      type = 'gateway';
    } else if (props.for === 'stresscams') {
      type = 'stresscam';
    }
    return Axios({
      method: device.nicknameDeviceID ? 'put' : 'post',
      url: `${apiURL}/api/hologram/device/nicknames`,
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
      data: qs.stringify({ deviceId: device.id, nickname: deviceActualName, type: type }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
  };

  return shouldRedirect ? (
    <Redirect
      to={{
        pathname: `/devices/${deviceId}`,
        state: device,
        activeTag: props.activeTag,
      }}
    />
  ) : (
    <>
      <CardContent
        onMouseEnter={() =>
          handleMouseEnter(
            deviceActualName ? deviceActualName : device.nickname ? device.nickname : device.name,
          )
        }
        onMouseLeave={() =>
          handleMouseLeave(
            deviceActualName ? deviceActualName : device.nickname ? device.nickname : device.name,
          )
        }
      >
        <Typography component="div" align="center" variant="body1" className="cardTitle">
          {isDeviceNameBeingEdited ? (
            <TextField
              type="text"
              placeholder="Enter device name"
              variant="standard"
              value={deviceActualName}
              onChange={(e) => setDeviceActualName(e.target.value)}
            />
          ) : device.nickname ? (
            device.nickname
          ) : (
            device.name
          )}
          {showEditBtn ? (
            isDeviceNameBeingEdited ? (
              <Grid container spacing={2} component="span">
                <Grid item xs={6} component="span">
                  <Button
                    onClick={publishDeviceNickname}
                    variant="text"
                    size="small"
                    startIcon={<Save fontSize="small" />}
                  >
                    Save
                  </Button>
                </Grid>
                <Grid item xs={6} component="span">
                  <Button
                    size="small"
                    onClick={() => setIsDeviceNameBeingEdited(false)}
                    startIcon={<Cancel fontSize="small" />}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <IconButton size="small" onClick={() => setIsDeviceNameBeingEdited(true)}>
                <Edit fontSize="small" />
              </IconButton>
            )
          ) : (
            ''
          )}
        </Typography>
      </CardContent>
      <Divider />
      <CardContent
        style={
          deviceBGColor === 'white'
            ? {
                backgroundColor: 'white',
                color: 'black',
                height: '100%',
                cursor: 'pointer',
              }
            : deviceBGColor === '#fdd835'
            ? {
                backgroundColor: deviceBGColor,
                color: 'black',
                height: '100%',
                cursor: 'pointer',
              }
            : {
                backgroundColor: deviceBGColor,
                height: '100%',
                cursor: 'pointer',
              }
        }
        onClick={() => {
          if (lastSession) setDeviceState(device.id);
        }}
      >
        <Tooltip
          title={lastSession ? `Last Update: ${dateStringFormatted}` : 'Last session unavailable'}
          arrow
          placeholder="top-right"
        >
          <Grid
            container
            className={
              !device.lastsession ? 'deviceActionArea deadDevice' : 'deviceActionArea aliveDevice'
            }
            // style={{ height: "100%" }}
            disabled={!device.lastsession ? true : false}
            onClick={() => {
              if (lastSession) setDeviceState(device.id);
            }}
          >
            {device.lastsession ? (
              <Grid item xs={12}>
                {device.nickname && <Typography variant="body1">{device.name}</Typography>}
                <Typography variant="body1">Last Session: {deviceDateStr}</Typography>
                <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                  {dateStatus}
                </Typography>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                  Last Session: Not Available
                </Typography>
                {/* <Typography variant="body2" style={{ fontWeight: "bold" }}>
                  Device Dead
                </Typography> */}
              </Grid>
            )}
          </Grid>
        </Tooltip>
      </CardContent>
      {/* <CardActions>
        <Button
          variant="text"
          size="small"
          onClick={() => {
            setDeviceState(device.id);
          }}
        >
          View Device
        </Button>
      </CardActions> */}
    </>
  );
};

export default DataParser;

DataParser.propTypes = {
  activeTag: PropTypes.string,
  lastSession: PropTypes.any,
  deviceData: PropTypes.any,
  for: PropTypes.string,
  setRefreshDevices: PropTypes.func,
};
