import React, { useContext, useState, useEffect, Fragment } from "react";
import { Context } from "../Store/Store";
import Axios from "axios";
import Loading from "react-loading";
import "./Devices.scss";
import {
  Card,
  CardActionArea,
  Box,
  Typography,
  Paper
} from "@material-ui/core";
import DataParser from "./DataParser";
import * as Constants from "./hologramConstants";
import { bannedRoles } from "../utils/constants";

// import red from "@material-ui/core/colors/red";

const DevicesComponent = () => {
  const [state, dispatch] = useContext(Context);
  const [showDevices, setShowDevices] = useState(false);
  const [devicesLoadingState, setDevicesLoadingState] = useState(true);

  //   const dateTime = new Date().toDateString();

  //   let mockServerURL = "https://private-anon-3185b3b9ae-hologram.apiary-mock.com";
  let devicesData = [];
  let finalAPIURL = "";
  useEffect(() => {
    if (bannedRoles.includes(state.userRole)) {
      setShowDevices(false);
    } else {
      console.log("hello from devices");
      // let interval = setInterval(
      finalAPIURL = Constants.APIURL();
      console.log(finalAPIURL);
      fetchRecords(`${finalAPIURL}/api/1/devices?withlocation=true`).then(
        () => {
          setDevicesLoadingState(false);
          console.log(
            "This is just intended to retrieve basic info, rest of the data should technically come from websockets"
          );
        }
      );

      setShowDevices(true);
    }

    //   30 * 1000
    // );
    // return () => clearInterval(interval);
  }, [state.userRole]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRecords = async apiURL => {
    let options = Constants.APICreds();

    await apiCall(apiURL, options);
  };

  const apiCall = async (url, options) => {
    await Axios.get(url, options)
      .then(response => {
        // save whatever we get
        devicesData.push(response.data.data);

        return response;
      })
      .then(async response => {
        if (response.data.continues) {
          // recursive call to get more data
          await apiCall(`${finalAPIURL}${response.data.links.next}`, options);
        } else {
          let devicesFlatData = [];
          devicesFlatData = devicesData.flat();
          devicesFlatData = devicesFlatData.sort(compare);
          dispatch({
            type: "SET_DEVICES_INFO",
            data: devicesFlatData
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const compare = (a, b) => {
    // Use toUpperCase() to ignore character casing
    let bandA = a.name.toUpperCase();
    let bandB = b.name.toUpperCase();

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  };
  return showDevices ? (
    <div className="devicesWrapper">
      <div className="devicesListWrapper">
        {devicesLoadingState ? (
          <Loading type="cubes" width="500px" height="500px" color="#3f51b5" />
        ) : (
          <div className="devices">
            {state.devices.map((device, index) => (
              <div className="device" key={device.id}>
                <Card
                  variant="elevation"
                  elevation={3}
                  className="deviceDataWrapper"
                >
                  <DataParser deviceData={device} />
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  ) : (
    <Box component={Paper} elevation={0}>
      <Typography variant={"h6"} align="center">
        Your access level does not permit this action.
      </Typography>
    </Box>
  );
};

export default DevicesComponent;
