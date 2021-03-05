// Dependency Imports
import React, { useContext, useState, useEffect } from "react";
import Loading from "react-loading";
import { Card, Grid, Typography } from "@material-ui/core";

// Local Imports
import DataParser from "./DataParser";
import { BannedRoleMessage } from "../utils/CustomComponents";
import "./Devices.scss";
import PropTypes from "prop-types";

// Default function
const DevicesComponent = (props) => {
  useEffect(() => {
    console.log(props.devices);
  }, [props.devices]);
  return props.showDevices ? (
    <div className="devicesWrapper">
      <div className="devicesListWrapper">
        {props.loading ? (
          <Loading type="bars" width="200px" height="200px" color="#3f51b5" />
        ) : (
          <>
            <div className="devices">
              {props.devices.length > 0 ? (
                props.devices.map((device) =>
                  device.lastsession ? (
                    <div className="device" key={device.id}>
                      <Card
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
                    </div>
                  ) : (
                    ""
                  )
                )
              ) : (
                <Typography variant="body1">No Devices Found</Typography>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  ) : (
    <BannedRoleMessage title="Devices" />
  );
};

DevicesComponent.propTypes = {
  showDevices: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  devices: PropTypes.array.isRequired,
};

export default DevicesComponent;
