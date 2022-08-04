// Dependency Imports
import React, { useEffect } from 'react';
import Axios from 'axios';
import qs from 'qs';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Local Imports

import * as Constants from '../../shared/hologramConstants';
import { bannedRoles, apiCall, compareStrings } from '../../../utils/constants';
import { apiUsername, apiPassword } from '../../../utils/api_secret';

import '../../Devices.scss';
// import { Context } from '../../../Store/Store';
import DevicesComponent from '../../Devices';
import { useDispatch } from 'react-redux';
import { setDevices, setDevicesLoadingState, setShowDevices } from '../../../Store/actions';

// Default function
const WaterSensors = () => {
  // const [state] = useContext(Context);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  // const [devices, setDevices] = useState([]);
  // const [showDevices, setShowDevices] = useState(false);
  // const [devicesLoadingState, setDevicesLoadingState] = useState(true);
  const { location } = useHistory();

  let devicesData = [];
  let finalAPIURL = '';
  useEffect(() => {
    if (Reflect.ownKeys(userInfo).length > 0) {
      if (bannedRoles.includes(userInfo.role)) {
        dispatch(setShowDevices(false));
      } else {
        // get tag id for
        // eslint-disable-next-line react-hooks/exhaustive-deps
        finalAPIURL = Constants.APIURL();
        // Check user state or retrieve all devices
        let apiParams;

        // check if the string has commas and split it into an array
        if (userInfo) {
          let deviceState = userInfo.state;
          deviceState = deviceState.split(',');

          if (deviceState[0] === 'all') {
            apiParams = '';
            fetchRecords(`${finalAPIURL}/api/1/devices?withlocation=true${apiParams}`).then(() => {
              dispatch(setDevicesLoadingState(false));
            });
          } else {
            getTags(`${finalAPIURL}/api/1/devices/tags?limit=1000&withlocation=true`).then(
              (tagsObject) => {
                // console.log("Tags Object: ", tagsObject);
                let tags = tagsObject.data.tags;
                if (tags.length === 0) dispatch(setDevicesLoadingState(false));

                let matchedResult = tags.filter((obj) => {
                  if (deviceState.includes(obj.name)) return obj;
                });
                // console.log(matchedResult);

                let tagsId = matchedResult.map((val) => {
                  // console.log(val);
                  // console.log(val.id);
                  // let tagId = val.id;
                  return val.id;
                });
                // console.log(tagsId);
                tagsId.forEach((tagId) => {
                  fetchRecords(
                    `${finalAPIURL}/api/1/devices?tagid=${tagId}&withlocation=true`,
                  ).then(() => {
                    dispatch(setDevicesLoadingState(false));
                  });
                });
                // get tag ids from matched objects
              },
            );
          }

          // var result = jsObjects.filter(obj => {
          //   return obj.b === 6
          // })
          // }

          // get tag id from hologram for this specific
        }

        dispatch(setShowDevices(true));
      }
    }

    //   30 * 1000
    // );
    // return () => clearInterval(interval);
  }, [userInfo.apikey]); // eslint-disable-line react-hooks/exhaustive-deps

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

    await apiCall(apiURL, options, 'watersensors')
      .then((response) => {
        // save whatever we get for a specific state or "all"
        // console.log(response.data.data);
        // TODO: Set a model to be used for devices
        // let device = new Devices(response.data.data);
        // console.log(device);
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
          devicesFlatData = devicesFlatData.sort(compareStrings);

          dispatch(setDevices(devicesFlatData));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const tagsApiCall = async (url) => {
    let tagsData = [];

    await Axios({
      method: 'post',
      url: Constants.apiCorsUrl + '/watersensors',
      data: qs.stringify({
        url: url,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
      responseType: 'json',
    }).then((response) => {
      // console.log(response.data);
      tagsData = response.data;
    });
    return tagsData;
  };
  return (
    <DevicesComponent
      // showDevices={showDevices}
      // devices={devices}
      // loading={devicesLoadingState}
      for={'watersensors'}
      // userInfo={userInfo}
      activeTag={location.state ? location.state.activeTag : null}
    />
  );
};

export default WaterSensors;
