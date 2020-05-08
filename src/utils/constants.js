import Axios from "axios";
import { apiCorsUrl } from "../Devices/hologramConstants";
import qs from "qs";
import { apiUsername, apiPassword } from "./api_secret";

// anyone with these roles are not supposed to view anything !
export const bannedRoles = ["default", "Default", "none", ""];

export const apiCall = async (url, options) => {
  return await Axios({
    method: "post",
    url: apiCorsUrl,
    data: qs.stringify({
      url: url
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    },
    auth: {
      username: apiUsername,
      password: apiPassword
    },
    responseType: "json"
  });
};
