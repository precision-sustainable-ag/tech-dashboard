// Dependency Imports
import React, { useContext, useState, useEffect } from "react";
import Loading from "react-loading";
import { Card, Chip, Grid, Typography } from "@material-ui/core";

// Local Imports
import DataParser from "./DataParser";
import { BannedRoleMessage } from "../utils/CustomComponents";
import "./Devices.scss";
import PropTypes from "prop-types";

const deviceCardStyle = {
  height: "200px",
};

// Default function
const DevicesComponent = (props) => {
  const [validDevices, setValidDevices] = useState([]);
  const [deviceTags, setDeviceTags] = useState([]);
  const [activeTag, setActiveTag] = useState("All");

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
      const tags = getAllTags(props.devices);
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
            <Grid item>
              <Chip
                color={activeTag === "Untagged" ? "primary" : "default"}
                label={"Untagged"}
                onClick={() => setActiveTag("Untagged")}
              />
            </Grid>
          </Grid>
          {validDevices.length > 0 ? (
            validDevices.map((device) =>
              device.lastsession ? (
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
                    />
                  </Card>
                </Grid>
              ) : (
                ""
              )
            )
          ) : (
            <Typography variant="body1">No Devices Found</Typography>
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
    else if (device.tags.includes("PSA_GLOBAL") && device.tags.length === 1)
      return true;
    else return false;
  });
  return devicesWithoutTags;
};
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
};

export default DevicesComponent;
