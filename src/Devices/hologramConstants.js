//Dependency Imports
import isIP from "is-ip";
import { FlipRounded } from "@material-ui/icons";

//Local Imports
import { hologramAPIKey, apiURL } from "../utils/api_secret";

export const apiCorsUrl = `${apiURL}/api/hologram/remote/devices`;

// export const apiCorsCreds = () => {
//   const authKey = `psaadmin:${hologramAPIKey}`;
//   let authBase64 = btoa(authKey);
//   let options = {
//     responseType: "json",
//     headers: {
//       Authorization: `Basic ${authBase64}`
//     }
//   };
//   return options;
// };
export const APIURL = () => {
  let mockServerURL =
    "https://private-anon-6a91fec95a-hologram.apiary-mock.com";
  let productionServerURL = "https://dashboard.hologram.io";
  let debuggingProxyURL =
    "https://private-anon-6a91fec95a-hologram.apiary-proxy.com";
  let finalAPIURL = debuggingProxyURL;

  console.log("env: ", process.env.NODE_ENV);

  // if (process.env.NODE_ENV === "development") {
  //   return debuggingProxyURL;
  // } else if (process.env.NODE_ENV === "test") {
  //   return debuggingProxyURL;
  // } else {
  //   return debuggingProxyURL;
  // }

  return productionServerURL;
};

export const APICreds = () => {
  const authKey = `apikey:${hologramAPIKey}`;
  let authBase64 = btoa(authKey);
  let options = {
    responseType: "json",
    headers: {
      Authorization: `Basic ${authBase64}`,
    },
  };
  return options;
};
