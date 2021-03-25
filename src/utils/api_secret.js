//const crypto = require("crypto");

// export const apiPassword = crypto
//   .createHash("md5")
//   .update("uF^q/G56~WFg>FVU")
//   .digest("base64");
const {
  NODE_ENV,
  REACT_APP_ONFARM_PROD_API_URL,
  REACT_APP_ONFARM_DEV_API_URL,
  REACT_APP_HOLOGRAM_WATER_SENSOR_API_KEY,
  REACT_APP_HOLOGRAM_STRESS_CAM_API_KEY,
  REACT_APP_GOOGLE_API_KEY,
  REACT_APP_GITHUB_AUTH_TOKEN,
  REACT_APP_ONFARM_OLD_API_USERNAME,
  REACT_APP_ONFARM_OLD_API_PASSWORD,
  REACT_APP_ONFARM_OLD_API_URL,
  REACT_APP_CONTACT_PERSON_NAME,
  REACT_APP_CONTACT_PERSON_EMAIL,
} = process.env;

export const apiPassword = REACT_APP_ONFARM_OLD_API_PASSWORD;

export const apiUsername = REACT_APP_ONFARM_OLD_API_USERNAME;

export const apiURL = REACT_APP_ONFARM_OLD_API_URL;

export const onfarmAPI =
  NODE_ENV === "production"
    ? REACT_APP_ONFARM_PROD_API_URL
    : REACT_APP_ONFARM_DEV_API_URL;

export const hologramAPIKey = REACT_APP_HOLOGRAM_WATER_SENSOR_API_KEY;
export const hologramStressCamAPIKey = REACT_APP_HOLOGRAM_STRESS_CAM_API_KEY;

export const primaryContactPerson = {
  name: REACT_APP_CONTACT_PERSON_NAME,
  email: REACT_APP_CONTACT_PERSON_EMAIL,
};

// make sure to modify HTTP Referrers on Google Console

export const googleApiKey = REACT_APP_GOOGLE_API_KEY;

export const githubToken = REACT_APP_GITHUB_AUTH_TOKEN;