// Dependency Imports
import React, { useEffect } from 'react';
import Axios from 'axios';
import qs from 'qs';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Local Imports

import { hologramApiUrl, apiCorsUrl } from '../../shared/hologramConstants';
import { bannedRoles, apiCall, compareStrings } from '../../../utils/constants';
import { apiUsername, apiPassword } from '../../../utils/api_secret';

import Devices from '../../Devices';
import { useDispatch } from 'react-redux';
import { setDevices, setDevicesLoadingState, setShowDevices } from '../../../Store/actions';

// Default function
const WaterSensors = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
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
        finalAPIURL = hologramApiUrl;
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
                let tags = tagsObject.data.tags;
                if (tags.length === 0) dispatch(setDevicesLoadingState(false));

                let matchedResult = tags.filter((obj) => {
                  if (deviceState.includes(obj.name)) return obj;
                });

                let tagsId = matchedResult.map((val) => {
                  return val.id;
                });
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

          // get tag id from hologram for this specific
        }

        dispatch(setShowDevices(true));
      }
    }
  }, [userInfo.apikey]); // eslint-disable-line react-hooks/exhaustive-deps

  const getTags = async (apiURL) => {
    let tagsData = [];
    await tagsApiCall(apiURL).then((response) => {
      tagsData = response;
    });
    return tagsData;
  };

  const fetchRecords = async (apiURL) => {
    await apiCall(apiURL, 'watersensors')
      .then((response) => {
        // save whatever we get for a specific state or "all"
        // TODO: Set a model to be used for devices
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
      url: apiCorsUrl + '/watersensors',
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
      tagsData = response.data;
    });
    return tagsData;
  };
  return (
    <Devices for={'watersensors'} activeTag={location.state ? location.state.activeTag : null} />
  );
};

export default WaterSensors;
