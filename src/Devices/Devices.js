// Dependency Imports
import React, { useState, useEffect } from "react";
import Loading from "react-loading";
import {
  Card,
  Chip,
  Grid,
  Icon,
  InputAdornment,
  Typography,
  TextField,
} from "@material-ui/core";

// Local Imports
import DataParser from "./DataParser";
import { BannedRoleMessage } from "../utils/CustomComponents";
// import "./Devices.scss";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { Search } from "@material-ui/icons";
import { apiPassword, apiUsername } from "../utils/api_secret";

const deviceCardStyle = {
  height: "210px",
};

// Default function
const DevicesComponent = (props) => {
  const [validDevices, setValidDevices] = useState([]);
  const [devicesWithNicknames, setDevicesWithNicknames] = useState([]);
  const [searchedDevices, setSearchedDevices] = useState([]);
  const [deviceTags, setDeviceTags] = useState([]);
  const [deviceSearchText, setDeviceSearchText] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const history = useHistory();

  // const tag = props.activeTag
  //   ? props.activeTag
  //   : history.location.state.activeTag
  //   ? history.location.state.activeTag
  //   : "All";

  useEffect(() => {
    if (validDevices.length === 0) return false;

    // console.log(validDevices);

    const initNicknamesFetch = async () => {
      const deviceIds = validDevices.reduce((acc, device) => {
        if (acc.length === 0) return [device.id];
        else {
          if (!acc.includes(device.id)) acc.push(device.id);
        }
        return acc;
      }, []);
      const fetchNicknamesURL = `https://admin.onfarmtech.org/api/hologram/device/nicknames/bulk`;

      // const response = await axios({
      //   url: fetchNicknamesURL,
      //   method: "post",
      //   auth: {
      //     username: apiUsername,
      //     password: apiPassword,
      //   },
      //   data: JSON.stringify(deviceIds),
      // });

      const response = await fetch(fetchNicknamesURL, {
        method: "post",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(apiUsername + ":" + apiPassword, "binary").toString(
              "base64"
            ),
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: `q=${deviceIds.toString()}`,
      });

      const nicknameRecords = await response.json();

      const devicesWithNicknames = validDevices.map((device) => {
        return {
          ...device,
          nickname:
            nicknameRecords.data
              .filter((rec) => parseInt(rec.device_id) === parseInt(device.id))
              .map((r) => r.nickname)
              .toString() || null,
        };
      });

      setDevicesWithNicknames(devicesWithNicknames);
    };

    initNicknamesFetch();
  }, [validDevices]);

  useEffect(() => {
    if (deviceSearchText) {
      const likeExp = deviceSearchText.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(`w*${likeExp}w*`, "gi");
      const filtered = devicesWithNicknames.filter(
        (device) =>
          regex.test(device.nickname) ||
          regex.test(device.name) ||
          regex.test(device.id)
      );

      setSearchedDevices(filtered);
    } else {
      setSearchedDevices(devicesWithNicknames);
    }
  }, [deviceSearchText, devicesWithNicknames]);

  useEffect(() => {
    if (history.location.state) {
      if (history.location.state.activeTag) {
        setActiveTag(history.location.state.activeTag);
      }
    } else if (props.activeTag) {
      setActiveTag(props.activeTag);
    } else {
      setActiveTag("All");
    }
  }, [history.location, props.activeTag]);

  useEffect(() => {
    if (activeTag === "All" && props.devices.length > 0) {
      if (props.from === "watersensors") {
        const devicesWithTags = filterAllDevices(props.devices);
        setValidDevices(devicesWithTags);
      } else {
        setValidDevices(props.devices);
      }
    } else {
      if (props.devices.length > 0) {
        if (activeTag === "All") {
          if (props.from === "watersensors") {
            const devicesWithTags = filterAllDevices(props.devices);
            setValidDevices(devicesWithTags);
          } else {
            setValidDevices(props.devices);
          }
        } else if (activeTag === "Untagged") {
          const devicesWithoutTags = filterAllDevicesWithoutTags(props.devices);
          setValidDevices(devicesWithoutTags);
        } else {
          const filteredDevices = filterDevicesByTags(props.devices, activeTag);
          setValidDevices(filteredDevices);
        }
      }
    }
  }, [activeTag, props]);

  useEffect(() => {
    if (props.devices.length > 0) {
      const tags = getAllTags(props.devices).sort();
      setDeviceTags(tags);
    }
  }, [props]);

  return props.showDevices ? (
    <Grid container>
      {props.loading ? (
        <Grid item xs={12}>
          <Loading type="bars" width="200px" height="200px" color="#3f51b5" />
        </Grid>
      ) : (
        <Grid item container spacing={3}>
          <Grid container item xs={12} spacing={3}>
            <Grid item>
              <Chip
                color={activeTag === "All" ? "primary" : "default"}
                label={"All"}
                onClick={() => setActiveTag("All")}
              />
            </Grid>

            {deviceTags.length > 0
              ? deviceTags.map((tag) => (
                  <Grid item key={`tag-${tag}`}>
                    <Chip
                      color={activeTag === tag ? "primary" : "default"}
                      label={tag}
                      onClick={() => setActiveTag(tag)}
                    />
                  </Grid>
                ))
              : ""}
            {props.userInfo.state === "all" ||
            props.userInfo.state === "All" ? (
              <Grid item>
                <Chip
                  color={activeTag === "Untagged" ? "primary" : "default"}
                  label={"Untagged"}
                  onClick={() => setActiveTag("Untagged")}
                />
              </Grid>
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              label="Search Devices"
              value={deviceSearchText}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>
                      <Search />
                    </Icon>
                  </InputAdornment>
                ),
              }}
              helperText="Enter device id or name"
              onChange={(e) => setDeviceSearchText(e.target.value)}
            />
          </Grid>
          {searchedDevices.length > 0 ? (
            searchedDevices.map((device) =>
              device.lastsession ? (
                <Grid item xs={12} md={3} lg={2} sm={6} key={device.id}>
                  <Card
                    style={deviceCardStyle}
                    variant="elevation"
                    elevation={3}
                    className="deviceDataWrapper"
                  >
                    <DataParser
                      for={props.for}
                      key={device.id}
                      deviceData={device}
                      lastSession={true}
                      activeTag={activeTag}
                    />
                  </Card>
                </Grid>
              ) : (
                <Grid item xs={12} md={2} key={device.id}>
                  <Card
                    style={deviceCardStyle}
                    variant="elevation"
                    elevation={3}
                    className="deviceDataWrapper"
                  >
                    <DataParser
                      for={props.for}
                      key={device.id}
                      deviceData={device}
                      lastSession={false}
                    />
                  </Card>
                </Grid>
              )
            )
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6">
                No Devices Found{" "}
                {deviceSearchText &&
                  `with nickname | device id | device name  "${deviceSearchText.toUpperCase()}"`}
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  ) : (
    <BannedRoleMessage title="Devices" />
  );
};

const getAllTags = (devices) => {
  const uniqueTags = [];
  const devicesWithTags = devices.filter(
    (device) => device.tags.length > 0 && device.tags.filter((tag) => tag.name)
  );
  const tags = devicesWithTags.map((device) => {
    return [...device.tags];
  });

  const tagsArray = tags.flat();

  tagsArray.forEach((tag) => {
    if (uniqueTags.includes(tag.name) || tag.name === "PSA_GLOBAL") {
    } else {
      uniqueTags.push(tag.name);
    }
  });

  return uniqueTags;
};
const filterDevicesByTags = (devices = [], activeTag) => {
  let tagSpecificDevices = [];

  devices.forEach((device) => {
    if (device.tags.length > 0) {
      device.tags.forEach((tag) => {
        if (tag.name === activeTag) {
          tagSpecificDevices.push(device);
        }
      });
    }
  });

  // console.log(tagSpecificDevices);
  return tagSpecificDevices;
};

const filterAllDevicesWithoutTags = (devices) => {
  const devicesWithoutTags = devices.filter((device) => {
    if (device.tags.length === 0) return true;
    else if (
      device.tags.length === 1 &&
      device.tags.filter((tag) => tag.name === "PSA_GLOBAL").length !== 0
    ) {
      return true;
    } else return false;
  });

  return devicesWithoutTags;
};

// not being invoked
const filterAllDevices = (devices) => {
  const devicesWithTags = devices.filter((device) => {
    if (device.tags.length > 0) {
      let globalTag = device.tags.filter((tag) => tag.name === "PSA_GLOBAL");

      if (globalTag.length > 0) {
        return true;
      } else return false;
    } else return false;
  });

  return devicesWithTags;
};

DevicesComponent.propTypes = {
  showDevices: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  devices: PropTypes.array.isRequired,
  userInfo: PropTypes.object,
  activeTag: PropTypes.string,
};

export default DevicesComponent;
