//Dependency Imports
import React from "react";
import { withStyles, Switch, Box, Typography, Paper } from "@material-ui/core";
import Loading from "react-loading";

//Local Imports
import { primaryContactPerson } from "./api_secret";

export const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

export const BannedRoleMessage = (props) => {
  let title = props.title;
  if (title.length === 0) title = "Anything";

  return (
    <Box component={Paper} elevation={0}>
      <Typography variant={"h6"} align="center">
        Your access level does not permit this action. If you think you are
        seeing this as an error, please report this to{" "}
        {primaryContactPerson.name}{" "}
        <a
          href={`mailto:${primaryContactPerson.email}?subject=Unable to view ${title} on PSA Tech Dashboard`}
        >
          here
        </a>
      </Typography>
    </Box>
  );
};

export const CustomLoader = (props) => {
  const width = props.width || "200px";
  const height = props.height || "200px";
  const color = props.color || "#3f51b5";
  return <Loading type="bars" width={width} height={height} color={color} />;
};

export const BarsLoader = (props) => {
  const width = props.width || "200px";
  const height = props.height || "200px";
  const color = props.color || "#3f51b5";
  return (
    <div
      style={{
        fill: color,
        height: height,
        width: width,
        margin: "0 auto",
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path transform="translate(2)" d="M 0 12 V 20 H 4 V 12 Z">
          <animate
            attributeName="d"
            values="M0 12 V20 H4 V12z; M0 4 V28 H4 V4z; M0 12 V20 H4 V12z; M0 12 V20 H4 V12z"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0"
            keyTimes="0;.2;.5;1"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.8 0.4 0.8"
            calcMode="spline"
          ></animate>
        </path>
        <path transform="translate(8)" d="M 0 12 V 20 H 4 V 12 Z">
          <animate
            attributeName="d"
            values="M0 12 V20 H4 V12z; M0 4 V28 H4 V4z; M0 12 V20 H4 V12z; M0 12 V20 H4 V12z"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0.2"
            keyTimes="0;.2;.5;1"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.8 0.4 0.8"
            calcMode="spline"
          ></animate>
        </path>
        <path transform="translate(14)" d="M 0 12 V 20 H 4 V 12 Z">
          <animate
            attributeName="d"
            values="M0 12 V20 H4 V12z; M0 4 V28 H4 V4z; M0 12 V20 H4 V12z; M0 12 V20 H4 V12z"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0.4"
            keyTimes="0;.2;.5;1"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.8 0.4 0.8"
            calcMode="spline"
          ></animate>
        </path>
        <path transform="translate(20)" d="M 0 11.098 V 20.902 H 4 V 11.098 Z">
          <animate
            attributeName="d"
            values="M0 12 V20 H4 V12z; M0 4 V28 H4 V4z; M0 12 V20 H4 V12z; M0 12 V20 H4 V12z"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0.6"
            keyTimes="0;.2;.5;1"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.8 0.4 0.8"
            calcMode="spline"
          ></animate>
        </path>
        <path
          transform="translate(26)"
          d="M 0 6.98045 V 25.0195 H 4 V 6.98045 Z"
        >
          <animate
            attributeName="d"
            values="M0 12 V20 H4 V12z; M0 4 V28 H4 V4z; M0 12 V20 H4 V12z; M0 12 V20 H4 V12z"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0.8"
            keyTimes="0;.2;.5;1"
            keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.8 0.4 0.8"
            calcMode="spline"
          ></animate>
        </path>
      </svg>
    </div>
  );
};
