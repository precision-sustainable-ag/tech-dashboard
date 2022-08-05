//const crypto = require("crypto");

// export const apiPassword = crypto
//   .createHash("md5")
//   .update("uF^q/G56~WFg>FVU")
//   .digest("base64");
const {
  NODE_ENV,
  REACT_APP_ONFARM_PROD_API_URL,
  REACT_APP_ONFARM_DEV_API_URL,
  REACT_APP_GOOGLE_API_KEY_PROD,
  REACT_APP_GOOGLE_API_KEY_DEV,
  REACT_APP_GITHUB_AUTH_TOKEN,
  REACT_APP_ONFARM_OLD_API_USERNAME,
  REACT_APP_ONFARM_OLD_API_PASSWORD,
  REACT_APP_ONFARM_OLD_API_URL,
  REACT_APP_CONTACT_PERSON_NAME,
  REACT_APP_CONTACT_PERSON_EMAIL,
  REACT_APP_ONFARM_GLOBAL_API_KEY,
} = process.env;

export const apiPassword = REACT_APP_ONFARM_OLD_API_PASSWORD;

export const apiUsername = REACT_APP_ONFARM_OLD_API_USERNAME;

export const apiURL = REACT_APP_ONFARM_OLD_API_URL;

export const onfarmStaticApiKey = REACT_APP_ONFARM_GLOBAL_API_KEY;

export const onfarmAPI =
  NODE_ENV === 'production' ? REACT_APP_ONFARM_PROD_API_URL : REACT_APP_ONFARM_DEV_API_URL;

export const primaryContactPerson = {
  name: REACT_APP_CONTACT_PERSON_NAME,
  email: REACT_APP_CONTACT_PERSON_EMAIL,
};

// make sure to modify HTTP Referrers on Google Console

export const googleApiKey =
  NODE_ENV === 'production' ? REACT_APP_GOOGLE_API_KEY_PROD : REACT_APP_GOOGLE_API_KEY_DEV;

export const githubToken = REACT_APP_GITHUB_AUTH_TOKEN;
