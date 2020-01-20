export const APIURL = () => {
  let mockServerURL =
    "https://private-anon-3185b3b9ae-hologram.apiary-proxy.com";
  let productionServerURL = "https://dashboard.hologram.io";
  let finalAPIURL = "";

  console.log("env: ", process.env.NODE_ENV);
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    // dev code
    finalAPIURL = mockServerURL;
  } else {
    // production code
    finalAPIURL = productionServerURL;
  }
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
