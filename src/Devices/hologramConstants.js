import isIP from "is-ip";

export const APIURL = () => {
  let mockServerURL =
    "https://private-anon-3185b3b9ae-hologram.apiary-proxy.com";
  let productionServerURL = "https://dashboard.hologram.io";
  let finalAPIURL = mockServerURL;

  console.log("env: ", process.env.NODE_ENV);
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
  return finalAPIURL;
};

export const APICreds = () => {
  const authKey = "apikey:8Lcx29Nrqf6LqcWjqhYI9w4EHPHnCZ";
  let authBase64 = btoa(authKey);
  let options = {
    responseType: "json",
    headers: {
      Authorization: `Basic ${authBase64}`
    }
  };
  return options;
};
