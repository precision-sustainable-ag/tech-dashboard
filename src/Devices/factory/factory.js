import { apiPassword, apiUsername } from "../../utils/api_secret";
import { apiCall } from "../../utils/constants";
import * as Constants from "../hologramConstants";
import { Devices } from "../model/devices";

const finalAPIURL = Constants.APIURL();
const apiParams = "";
export const getDevices = async () => {
  let devicesData = [];
  let apiURL = `${finalAPIURL}/api/1/devices?withlocation=true${apiParams}`;
  let options = Constants.APICreds();

  await apiCall(apiURL, options)
    .then((response) => {
      let deviceInfo = new Devices(response.data.data);
      devicesData.push(deviceInfo);
      console.log("response", response.data.data);
      return response;
    })
    .then(async (response) => {
      if (response.data.continues) {
        // recursive call to get more data
        await getDevices(`${finalAPIURL}${response.data.links.next}`);
      } else {
        let devicesFlatData = [];
        devicesFlatData = devicesData.flat();
        devicesFlatData = devicesFlatData.sort(compare);
        // console.log("devicesFlatData", devicesFlatData);
        //   dispatch({
        //     type: "SET_DEVICES_INFO",
        //     data: devicesFlatData,
        //   });
      }
    })
    .catch((error) => {
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
