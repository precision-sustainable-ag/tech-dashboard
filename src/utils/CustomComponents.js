import React from "react";
import { withStyles, Switch, Box, Typography, Paper } from "@material-ui/core";
import { primaryContactPerson } from "./api_secret";
import Loading from "react-loading";

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
          href={`mailto:${primaryContactPerson.email}?subject=Unable To See ${title} on Tech Dashboard`}
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
