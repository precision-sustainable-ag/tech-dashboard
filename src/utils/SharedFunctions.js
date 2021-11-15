import { useContext, useState, useEffect } from "react";
import { Context } from "../Store/Store";
import { apiPassword, apiURL, apiUsername } from "../utils/api_secret";
import Axios from "axios";
import qs from "qs";
import Platform from "react-platform-js";

export const UserIsEditor = (permissions) => {
  const [state] = useContext(Context);
  const userPermissions = permissions
    ? permissions
    : state.userInfo.permissions;
  if (
    userPermissions.split(",").includes("all") ||
    userPermissions.split(",").includes("edit") ||
    userPermissions.split(",").includes("update")
  )
    return true;
  else return false;
};

// hook to fetch window size with no debounce
// unused
export function useWindowResize() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const listener = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  return {
    width,
    height,
  };
}

// debounce function delays function call
// called by useWindowDimensions hook
function debounce(fn, ms) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

// hook to fetch window dimensions using debounce, called in AllDataTable
// unused
export function useWindowDimensions() {
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }, 1500);

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });

  return dimensions;
}

export const createGithubIssue = async (
  issueTitle,
  body,
  labels,
  assignees,
  nickname,
  getTokenSilently
) => {
  const data = {
    action: "create",
    user: nickname,
    title: issueTitle,
    assignees: assignees,
    labels: labels,
    body: body,
  };

  return callAzureFunction(data, "GithubIssues", getTokenSilently);
};
export const createGithubComment = async (
  nickname,
  newComment,
  number,
  getTokenSilently
) => {
  const data = {
    action: "comment",
    user: nickname,
    comment: newComment,
    number: number,
  };

  return callAzureFunction(data, "GithubIssues", getTokenSilently);
};

export const addToTechnicians = async (nickname, getTokenSilently) => {
  const data = {
    action: "add_to_technicians",
    user: nickname,
  };

  return callAzureFunction(data, "GithubIssues", getTokenSilently);
};

export const callAzureFunction = async (data, endpoint, getTokenSilently) => {
  let token = await getTokenSilently({
    audience: `https://precision-sustaibale-ag/tech-dashboard`,
  });

  data = { ...data, token: token };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    mode: "cors", // no-cors, *cors, same-origin
  };

  let githubIssuesResponse;

  try {
    githubIssuesResponse = await fetch(
      `https://correctionsapi.azurewebsites.net/api/${endpoint}`,
      options
    );
  } catch (err) {
    console.log(err);
    githubIssuesResponse = null;
  }

  let githubIssuesResponseJSON = null;

  if (githubIssuesResponse)
    githubIssuesResponseJSON = await githubIssuesResponse
      .json()
      .catch((err) => {
        console.log(err);
        githubIssuesResponseJSON = githubIssuesResponse;
      });

  console.log(githubIssuesResponse);

  const dataString = qs.stringify({
    params: data,
    os: Platform.OS,
    osVersion: Platform.OSVersion,
    browser: Platform.Browser,
    browserVersion: Platform.BrowserVersion,
    githubIssuesResponse: githubIssuesResponseJSON
      ? githubIssuesResponseJSON
      : "No response from function likely cors",
  });

  await Axios({
    method: "POST",
    url: `${apiURL}/api/incoming/azurecloud/psa`,
    data: dataString,
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  }).catch((e) => {
    console.error(e);
  });

  return {
    jsonResponse: githubIssuesResponseJSON,
    response: githubIssuesResponse
  };
};

export const sendCommandToHologram = async (
  deviceId,
  farmCode,
  rep,
  action,
  crop
) => {
  let data;
  if (action === "start") {
    data = {
      device_id: deviceId,
      farm_code: farmCode,
      rep: rep,
      action: action,
      crop: crop,
    };
  } else {
    data = {
      device_id: deviceId,
      action: action,
    };
  }

  const dataString = qs.stringify(data);

  let req = await Axios({
    method: "POST",
    url: `${apiURL}/api/stress-cameras-test/commands`,
    data: dataString,
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  }).catch((e) => {
    console.error(e);
  });
  if (req.status) {
    if (req.status === 200) {
      return true;
    } else {
      console.error("AJAX Error");
      return false;
    }
  } else {
    return false;
  }
};

export const getDeviceMessages = async (deviceId) => {
  console.log(deviceId);

  const data = {
    device_id: deviceId,
  };
  const dataString = qs.stringify(data);

  let req = await Axios({
    method: "POST",
    url: `${apiURL}/api/get-hologram-device-message`,
    data: dataString,
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  }).catch((e) => {
    console.error(e);
  });
  if (req.status) {
    if (req.status === 200) {
      return req;
    } else {
      console.error("AJAX Error");
      return false;
    }
  } else {
    return false;
  }
};

export const tableOptions = (tableDataLength) => ({
  padding: "dense",
  exportButton: true,
  exportFileName: "Producer Information",
  addRowPosition: "first",
  exportAllData: false,
  pageSizeOptions: [5, 10, 20, tableDataLength],
  pageSize: tableDataLength,
  groupRowSeparator: "  ",
  grouping: true,
  headerStyle: {
    fontWeight: "bold",
    fontFamily: "Bilo, sans-serif",
    fontSize: "0.8em",
    textAlign: "left",
    position: "sticky",
    top: 0,
  },
  rowStyle: {
    fontFamily: "Roboto, sans-serif",
    fontSize: "0.8em",
    textAlign: "left",
  },
  selection: false,
  searchAutoFocus: true,
  toolbarButtonAlignment: "left",
  actionsColumnIndex: 0,
});

//   get unique years, sort by highest to lowest and activate highest year
export const uniqueYears = (allYears) => {
  const currentYear = new Date().getFullYear().toString();
  return allYears
    .filter((year) => year !== undefined)
    .filter((val, index, arr) => arr.indexOf(val) === index)
    .sort((a, b) => b - a)
    .map((year) => {
      return { active: currentYear === year ? true : false, year: year };
  });
};
