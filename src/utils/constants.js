// Dependency Imports
import Axios from "axios";
import qs from "qs";

// Local Imports
import { apiUsername, apiPassword, apiURL } from "./api_secret";
import { apiCorsUrl } from "../Devices/hologramConstants";

// anyone with these roles are not supposed to view anything !
export const bannedRoles = ["default", "Default", "none", ""];

export const apiCall = async (url, options) => {
  return await Axios({
    method: "post",
    url: apiCorsUrl,
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
  });
};

export const statesHash = {
  AL: "Alabama",
  AK: "Alaska",
  AS: "American Samoa",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District Of Columbia",
  FM: "Federated States Of Micronesia",
  FL: "Florida",
  GA: "Georgia",
  GU: "Guam",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MH: "Marshall Islands",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  MP: "Northern Mariana Islands",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PW: "Palau",
  PA: "Pennsylvania",
  PR: "Puerto Rico",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VI: "Virgin Islands",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

export const fetchGrowerByLastName = async (query) => {
  return await Axios({
    url: `${apiURL}/api/retrieve/grower/lastname/${query}`,
    method: "get",
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  });
};

export const ucFirst = (str) => {
  if (str === null) {
    return "Not Provided";
  } else {
    if (str.length > 0) return str.charAt(0).toUpperCase() + str.slice(1);
    else return str.toUpperCase();
  }
};

export const format_AM_PM = (date) => {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};
