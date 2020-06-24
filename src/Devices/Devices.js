import React, { useContext, useState, useEffect, Fragment } from "react";
import { Context } from "../Store/Store";
import Axios from "axios";
import Loading from "react-loading";
import "./Devices.scss";
import qs from "qs";
import {
  Card,
  CardActionArea,
  Box,
  Typography,
  Paper,
} from "@material-ui/core";
import DataParser from "./DataParser";
import * as Constants from "./hologramConstants";
import { bannedRoles, apiCall } from "../utils/constants";
import { apiUsername, apiPassword } from "../utils/api_secret";
import { BannedRoleMessage } from "../utils/CustomComponents";

// import moment from "moment-timezone";

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
    // console.log(moment)
    if (Reflect.ownKeys(state.userInfo).length > 0) {
      if (bannedRoles.includes(state.userInfo.role)) {
        setShowDevices(false);
      } else {
        console.log("hello from devices");

        // get tag id for

        // let interval = setInterval(
        finalAPIURL = Constants.APIURL();
        // console.log(finalAPIURL);
        // Check user state or retrieve all devices
        let apiParams;
        // if (state.userInfo.role === "all") {
        //   apiParams = "";
        //   fetchRecords(
        //     `${finalAPIURL}/api/1/devices?withlocation=true${apiParams}`
        //   ).then(() => {
        //     setDevicesLoadingState(false);
        //     console.log(
        //       "This is just intended to retrieve basic info, rest of the data should technically come from websockets"
        //     );
        //   });
        // } else {
        // console.log('user role !== all');

        // // check if the string has commas and split it into an array
        if (state.userInfo) {
          let deviceState = state.userInfo.state;
          deviceState = deviceState.toUpperCase();
          deviceState = deviceState.split(",");
          if (deviceState[0] === "ALL") {
            apiParams = "";
            fetchRecords(
              `${finalAPIURL}/api/1/devices?withlocation=true${apiParams}`
            ).then(() => {
              setDevicesLoadingState(false);
            });
          } else {
            getTags(
              `${finalAPIURL}/api/1/devices/tags?limit=1000&withlocation=true`
            ).then((tagsObject) => {
              // console.log("Tags Object: ", tagsObject);
              let tags = tagsObject.data.tags;
              let matchedResult = tags.filter((obj) => {
                if (deviceState.includes(obj.name)) return obj;
              });
              // console.log(matchedResult);
              let tagsIdArray = [];
              let tagsId = matchedResult.map((val, index) => {
                // console.log(val);
                // console.log(val.id);
                // let tagId = val.id;
                return val.id;
              });
              // console.log(tagsId);
              tagsId.forEach((tagId) => {
                fetchRecords(
                  `${finalAPIURL}/api/1/devices?tagid=${tagId}&withlocation=true`
                ).then(() => {
                  setDevicesLoadingState(false);
                });
              });
              // get tag ids from matched objects
            });
          }

          // var result = jsObjects.filter(obj => {
          //   return obj.b === 6
          // })
          // }

          // get tag id from hologram for this specific
        }

        setShowDevices(true);
      }
    }

    //   30 * 1000
    // );
    // return () => clearInterval(interval);
  }, [state.userInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  const getTags = async (apiURL) => {
    let options = Constants.APICreds();
    let tagsData = [];
    await tagsApiCall(apiURL, options).then((response) => {
      // console.log(response);
      tagsData = response;
    });
    return tagsData;
  };

  const fetchRecords = async (apiURL) => {
    let options = Constants.APICreds();

    await apiCall(apiURL, options)
      .then((response) => {
        // save whatever we get for a specific state or "all"

        devicesData.push(response.data.data);

        return response;
      })
      .then(async (response) => {
        if (response.data.continues) {
          // recursive call to get more data
          await fetchRecords(`${finalAPIURL}${response.data.links.next}`);
        } else {
          let devicesFlatData = [];
          devicesFlatData = devicesData.flat();
          devicesFlatData = devicesFlatData.sort(compare);
          // console.log("devicesFlatData", devicesFlatData);
          dispatch({
            type: "SET_DEVICES_INFO",
            data: devicesFlatData,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const tagsApiCall = async (url, options) => {
    let tagsData = [];

    await Axios({
      method: "post",
      url: Constants.apiCorsUrl,
      data: qs.stringify({
        url: url,
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
      // console.log(response.data);
      tagsData = response.data;
    });
    return tagsData;
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
          <Loading type="bars" width="200px" height="200px" color="#3f51b5" />
        ) : (
          <div className="devices">
            {state.devices.map((device, index) =>
              device.lastsession ? (
                <div className="device" key={device.id}>
                  <Card
                    variant="elevation"
                    elevation={3}
                    className="deviceDataWrapper"
                  >
                    <DataParser deviceData={device} />
                  </Card>
                </div>
              ) : (
                ""
              )
            )}
          </div>
        )}
      </div>
    </div>
  ) : (
    <BannedRoleMessage title="Devices" />
  );
};

export default DevicesComponent;
