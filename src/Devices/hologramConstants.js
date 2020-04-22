import isIP from "is-ip";
import { hologramAPIKey } from "../utils/api_secret";

export const APIURL = () => {
  let mockServerURL =
    "https://private-anon-6a91fec95a-hologram.apiary-mock.com";
  let productionServerURL = "https://dashboard.hologram.io";
  let debuggingProxyURL =
    "https://private-anon-6a91fec95a-hologram.apiary-proxy.com";
  let finalAPIURL = debuggingProxyURL;

  console.log("env: ", process.env.NODE_ENV);

  if (process.env.NODE_ENV === "development") {
    return debuggingProxyURL;
  } else if (process.env.NODE_ENV === "test") {
    return debuggingProxyURL;
  } else {
    return debuggingProxyURL;
  }
  // if (
  //   !process.env.NODE_ENV ||
  //   process.env.NODE_ENV === "development" ||
  //   isIP.v4(process.env.NODE_ENV) ||
  //   isIP.v4(window.location.hostname)
  // ) {
  //   // dev code
  //   finalAPIURL = mockServerURL;
  //   console.log("RUNNING ON MOCK SERVER", window.location.hostname);
  // } else {
  //   // production code
  //   finalAPIURL = productionServerURL;
  //   console.log("RUNNING ON LIVE SERVER", window.location.hostname);
  // }
  // return finalAPIURL;
};

export const APICreds = () => {
  const authKey = `apikey:${hologramAPIKey}`;
  let authBase64 = btoa(authKey);
  let options = {
    responseType: "json",
    headers: {
      Authorization: `Basic ${authBase64}`
    }
  };
  return options;
};
