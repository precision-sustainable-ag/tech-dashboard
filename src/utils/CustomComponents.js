// Dependency Imports
import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  withStyles,
  Switch,
  Box,
  Typography,
  Paper,
  Zoom,
  useScrollTrigger,
  makeStyles,
  Grid,
  Button,
} from "@material-ui/core";
import Loading from "react-loading";

// Local Imports
import { primaryContactPerson } from "./api_secret";
import { Context } from "../Store/Store";
import YearsChips from "./YearsChips";
import AffiliationsChips from "./AffiliationsChips";

import PropTypes from "prop-types";

// Styles
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

// Helper functions
export const BannedRoleMessage = ({ title }) => {
  const [state] = useContext(Context);
  return (
    <Box component={Paper} elevation={1} p={2}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="column"
        style={{ minHeight: "50vh" }}
        spacing={3}
      >
        <Grid item>
          <Typography variant={"h4"}>
            Your access level does not permit this action
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            If you think you are seeing this as an error, please report this to{" "}
            {primaryContactPerson.name}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            target="_top"
            href={`mailto:${primaryContactPerson.email}?subject=Unable%20to%20view%20${title}%20on%20PSA%20Tech%20Dashboard&body=I%20am%20unable%20to%20view%20${title}.%20Please verify my permissions. My login email for the dashboard is ${state.userInfo.email}`}
          >
            Report Error
          </Button>
        </Grid>
      </Grid>{" "}
      {/* <a
        href={`mailto:${primaryContactPerson.email}?subject=Unable to view ${title} on PSA Tech Dashboard`}
      >
        here
      </a> */}
    </Box>
  );
};

BannedRoleMessage.propTypes = {
  title: PropTypes.string.isRequired,
};

export const CustomLoader = ({ width, height, color }) => {
  return <Loading type="bars" width={width} height={height} color={color} />;
};

CustomLoader.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};
CustomLoader.defaultProps = {
  width: "200px",
  height: "200px",
  color: "#3f51b5",
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

BarsLoader.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
};
BarsLoader.defaultProps = {
  width: "200px",
  height: "200px",
  color: "#3f51b5",
};

export const useAutoRefresh = (callback = () => {}, delay = 1000) => {
  const intervalId = React.useRef(null);
  const savedCallback = React.useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  });

  React.useEffect(() => {
    const tick = () => savedCallback.current();
    if (typeof delay === "number") {
      intervalId.current = window.setInterval(tick, delay);
      return () => window.clearInterval(intervalId.current);
    }
  }, [delay]);

  return intervalId.current;
};

export const useInfiniteScroll = (
  callback = () => {},
  hologramApiFunctional = true
) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const isScrolling = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop <=
          0.9 * document.documentElement.offsetHeight ||
        isFetching
      )
        return;

      setIsFetching(true);
    };
    window.addEventListener("scroll", isScrolling);
    return () => window.removeEventListener("scroll", isScrolling);
  }, [isFetching]);

  useEffect(() => {
    if (!isFetching || !hologramApiFunctional) return;
    callback();
  }, [isFetching, callback, hologramApiFunctional]);

  return [isFetching, setIsFetching];
};

export const ScrollTop = (props) => {
  const { children } = props;
  const useStyles = makeStyles((theme) => ({
    root: {
      position: "fixed",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }));
  const classes = useStyles();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 180,
  });
  const handleBackToTopClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      ".topHead"
    );
    console.log(anchor);
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  return (
    <Zoom in={trigger}>
      <div
        onClick={handleBackToTopClick}
        role="presentation"
        className={classes.root}
      >
        {children}
      </div>
    </Zoom>
  );
};
ScrollTop.propTypes = {
  children: PropTypes.node.isRequired,
};

export const YearsAndAffiliations = (props) => {
  const {
    title,
    years,
    affiliations,
    handleActiveAffiliation,
    handleActiveYear,
    showYears,
  } = props;

  const activeAffiliation = () => {
    return (
      affiliations
        .filter((rec) => rec.active)
        .map((rec) => rec.affiliation)
        .toString() || "all"
    );
  };

  return (
    <Fragment>
      {title !== "none" && (
        <Grid item xs={12}>
          <Typography variant="h4">{title}</Typography>
        </Grid>
      )}

      {showYears && (
        <Grid item container spacing={3} xs={12}>
          <Grid item sm={2} md={1} xs={12}>
            <Typography variant="body1">Years</Typography>
          </Grid>
          <YearsChips years={years} handleActiveYear={handleActiveYear} />
        </Grid>
      )}

      {affiliations.length > 1 && (
        <Grid item container spacing={2} xs={12}>
          <Grid item sm={2} md={1} xs={12}>
            <Typography variant="body1">Affiliations</Typography>
          </Grid>
          <AffiliationsChips
            activeAffiliation={activeAffiliation() || "all"}
            affiliations={affiliations}
            handleActiveAffiliation={handleActiveAffiliation}
          />
        </Grid>
      )}
    </Fragment>
  );
};

YearsAndAffiliations.defaultProps = {
  title: "Farm Values",
  years: [],
  affiliations: [],
  handleActiveAffiliation: () => {},
  handleActiveYear: () => {},
  showYears: true,
};

YearsAndAffiliations.propTypes = {
  title: PropTypes.string,
  years: PropTypes.array,
  affiliations: PropTypes.array,
  handleActiveAffiliation: PropTypes.func,
  handleActiveYear: PropTypes.func,
  showYears: PropTypes.bool,
};
