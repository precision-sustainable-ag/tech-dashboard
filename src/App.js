// Dependency Imports
import React, { useState, useEffect, Suspense } from "react";
import {
  makeStyles,
  Box,
  createMuiTheme,
  CssBaseline,
  ThemeProvider,
  Paper,
  Typography,
  Container,
  Button,
  Grid,
  responsiveFontSizes,
} from "@material-ui/core";

// Local Imports
import { useAuth0 } from "./Auth/react-auth0-spa";
import PrivateRoute from "./utils/private-routes";

import "./Styles/App.css";

import { Switch, Route } from "react-router-dom";

import { Check, Clear, Replay, WifiOff } from "@material-ui/icons";

import DeviceEnroll from "./Devices/Device-Enroll/DeviceEnroll";
import WaterSensorByGateway from "./Devices/WaterSensorData/WaterSensorByGateway";
import SiteEnrollment from "./SiteEnrollment/SiteEnrollment";
import PageNotFound from "./PageNotFound";
import AllDataTable from "./Table/AllDataTable";

import DeviceComponent from "./Devices/Device/Device";

import Header from "./Header/Header";

import Issues from "./Issues/Issues";
import Issue from "./Issues/Issue";
import Forms from "./Forms/Forms";

// const Forms = lazy(() => "./Forms/Forms");

import StressCams from "./Devices/StressCams/StressCams";
import WaterSensors from "./Devices/WaterSensors/WaterSensors";
import DevicesWrapper from "./Devices/DevicesWrapper/DevicesWrapper";

import FormData from "./Forms/components/FormData";
import FarmDates from "./SiteInformation/FarmDates/FarmDates";
import FarmValues from "./Biomass/FarmValues";
import SensorVisuals from "./SensorVisuals/SensorVisuals";
import VisualsByCode from "./SensorVisuals/Components/VisualsByCode";
// import FarmDatesCalendar from "./SiteInformation/FarmDates/FarmDatesCalendar";
import Profile from "./Profile/Profile";

import FarmDatesCalendar from "./SiteInformation/FarmDates/FarmDatesCalendar";

import ProducerInformation from "./ProducerInformation/ProducerInformation";

import TaskTimeline from "./Landing/TaskTimeline/TaskTimeline";

import Protocols from "./Protocols/Protocols";
import DecompBag from "./DecompBag/DecompBag";
import Debug from "./Debug/Debug";
import axios from "axios";
import {
  apiPassword,
  apiURL,
  apiUsername,
  onfarmAPI,
} from "./utils/api_secret";
import { apiCorsUrl, APIURL } from "./Devices/hologramConstants";
import QueryString from "qs";

// Helper function
function useOnlineStatus() {
  const [online, setOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setOnline(true);
    }

    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return online;
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
}));

// Default function
function App() {
  const online = useOnlineStatus();
  const {
    loading,
    isAuthenticated,
    loginWithRedirect,

    getTokenSilently,
  } = useAuth0();
  const classes = useStyles();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [theme, setTheme] = useState({
    palette: {
      primary: { main: "#2e7d32" },
      secondary: { main: "#4d4d4d" },
      type:
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : window.localStorage.getItem("theme")
          ? window.localStorage.getItem("theme")
          : "light",
    },

    typography: {
      useNextVariants: true,
      fontFamily: "bilo, sans-serif",
    },

    overrides: {
      MuiTooltip: {
        tooltip: {
          fontSize: "0.9em",
          fontWeight: "bolder",
          color: "black",
          backgroundColor: "#eee",
        },
      },
    },
  });

  let muiTheme = createMuiTheme(theme);
  muiTheme = responsiveFontSizes(muiTheme);

  const toggleThemeDarkness = () => {
    let newPaletteType = theme.palette.type === "light" ? "dark" : "light";
    setTheme({
      ...theme,
      palette: {
        ...theme.palette,
        type: newPaletteType,
      },
    });
  };

  useEffect(() => {
    if (!window.localStorage.getItem("theme")) {
      // set localstorage with a default theme
      window.localStorage.setItem("theme", "light");
    }

    if (theme.palette.type !== "light") {
      // update localstorage
      window.localStorage.setItem("theme", "dark");
      document.body.style.backgroundColor = "#333";
      document.body.style.color = "#fbfbfb";
    } else {
      // update localstorage
      window.localStorage.setItem("theme", "light");
      document.body.style.backgroundColor = "#fff";
      document.body.style.color = "#000";
      // document.body.style.backgroundColor = "rgb(247, 249, 252)";
    }

    if (!window.localStorage.getItem("font")) {
      window.localStorage.setItem("font", theme.typography.fontFamily);
    }
  }, [theme]);

  const [checkingAPIs, setCheckingAPIs] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    if (!loading) {
      checkAuth();
    }
  }, [loading, getTokenSilently, isAuthenticated]);

  return online ? (
    loading ? (
      <div className={classes.root}>
        <CssBaseline />
        <ThemeProvider theme={muiTheme}>
          <Paper
            style={{
              height: "100vh",
            }}
          >
            <Box height={"40vh"} />
            <Typography variant="h3" gutterBottom align="center">
              Loading
            </Typography>
          </Paper>
        </ThemeProvider>
      </div>
    ) : checkingAPIs ? (
      <div className={classes.root}>
        <APIChecker theme={muiTheme} setChecker={setCheckingAPIs} />
      </div>
    ) : isLoggedIn ? (
      <ThemeProvider theme={muiTheme}>
        <Container maxWidth={"xl"} className="mainContainer">
          <Header
            isDarkTheme={theme.palette.type === "light" ? false : true}
            setDarkTheme={toggleThemeDarkness}
            isLoggedIn={isLoggedIn}
          />
          {/* <DrawerComponent /> */}

          <Suspense fallback={<div>Loading...</div>}>
            <main className={classes.content}>
              <div className={`${classes.toolbar} topHead`} />

              <Switch>
                <Route
                  render={(props) => (
                    // <LandingComponent
                    //   {...props}
                    //   isDarkTheme={theme.palette.type === "light" ? false : true}
                    // />
                    <TaskTimeline
                      isDarkTheme={
                        theme.palette.type === "light" ? false : true
                      }
                      title="Task Timeline"
                    />
                  )}
                  path="/"
                  exact
                />
                <PrivateRoute
                  path="/on-farm-protocols"
                  render={(props) => (
                    <Protocols
                      isDarkTheme={
                        theme.palette.type === "light" ? false : true
                      }
                      title="On Farm Protocols"
                    />
                  )}
                />
                <PrivateRoute
                  path="/devices/stress-cams"
                  render={(props) => (
                    <StressCams
                      isDarkTheme={
                        theme.palette.type === "light" ? false : true
                      }
                      title="Devices - Stress Cams"
                    />
                  )}
                />
                <PrivateRoute
                  path="/devices/water-sensors"
                  render={(props) => (
                    <WaterSensors
                      isDarkTheme={
                        theme.palette.type === "light" ? false : true
                      }
                      title="Devices - Water Sensors"
                    />
                  )}
                />

                <PrivateRoute
                  path="/site-information/contact-enrollment"
                  render={(props) => (
                    <AllDataTable
                      isDarkTheme={
                        theme.palette.type === "light" ? false : true
                      }
                      title="Contact Information and Site Enrollment"
                    />
                  )}
                />
                <PrivateRoute
                  path="/site-information/farm-dates"
                  exact
                  render={(props) => (
                    <FarmDates
                      isDarkTheme={
                        theme.palette.type === "light" ? false : true
                      }
                      title="Farm Dates"
                    />
                  )}
                />

                <PrivateRoute
                  path="/site-information/farm-dates/calendar"
                  render={(props) => (
                    <FarmDatesCalendar
                      {...props}
                      title="Farm Dates - Calendar"
                    />
                  )}
                  exact
                />

                <PrivateRoute
                  path="/site-enroll"
                  render={(props) => <SiteEnrollment {...props} />}
                />

                <PrivateRoute
                  path="/issues"
                  render={(props) => <Issues {...props} title="Issues" />}
                  exact
                />
                <PrivateRoute
                  path="/issues/:issueNumber"
                  render={(props) => (
                    <Issue
                      {...props}
                      isDarkTheme={
                        theme.palette.type === "light" ? false : true
                      }
                      title="Issue"
                    />
                  )}
                />
                <PrivateRoute
                  path="/devices"
                  component={DevicesWrapper}
                  exact
                />
                <PrivateRoute
                  path={`/devices/:deviceId`}
                  render={(props) => (
                    <DeviceComponent
                      {...props}
                      isDarkTheme={
                        theme.palette.type === "light" ? false : true
                      }
                      title="Device Data"
                    />
                  )}
                />
                <PrivateRoute
                  path={`/kobo-forms/`}
                  exact
                  render={(props) => (
                    <Forms
                      {...props}
                      isDarkTheme={
                        theme.palette.type === "light" ? false : true
                      }
                      title="Kobo Forms"
                    />
                  )}
                />
                <PrivateRoute
                  path={`/kobo-forms/:formId`}
                  render={(props) => (
                    <FormData
                      assetId={props}
                      isDarkTheme={
                        theme.palette.type === "light" ? false : true
                      }
                      title="Kobo Forms - Data"
                    />
                  )}
                />

                <PrivateRoute
                  path={`/producers`}
                  render={(props) => (
                    <ProducerInformation
                      {...props}
                      isDarkTheme={
                        theme.palette.type === "light" ? false : true
                      }
                      title="Producer Information"
                    />
                  )}
                />

                <PrivateRoute path="/profile" component={Profile} />
                <PrivateRoute path="/device-enroll" component={DeviceEnroll} />

                {/* Decomp Bag View */}
                <PrivateRoute
                  path={`/decomp-bags`}
                  component={DecompBag}
                  exact
                />

                <PrivateRoute
                  path={`/debug`}
                  render={(props) => <Debug {...props} />}
                  exact
                />

                {/* New Sensors Page URLS */}

                <PrivateRoute
                  path={`/sensor-visuals`}
                  render={(props) => (
                    <SensorVisuals type="watersensors" {...props} />
                  )}
                  exact
                />
                <PrivateRoute
                  path={`/sensor-visuals/:year/:code`}
                  component={VisualsByCode}
                  exact
                />

                <PrivateRoute
                  path={`/water-sensors/:gatewayId`}
                  render={(props) => <WaterSensorByGateway {...props} />}
                />
                {/* Biomass URLS */}
                <PrivateRoute
                  path={`/biomass/farm-values`}
                  render={(props) => <FarmValues {...props} />}
                />
                <Route path="*">
                  <PageNotFound />
                </Route>
              </Switch>
            </main>
          </Suspense>
        </Container>
      </ThemeProvider>
    ) : (
      <div className={classes.root}>
        <CssBaseline />
        <ThemeProvider theme={muiTheme}>
          <Paper
            style={{
              height: "100vh",
            }}
          >
            <Box height={"40vh"} />
            <Typography variant="h3" gutterBottom align="center">
              Please Log In To Continue
            </Typography>
            <Typography variant="body1" gutterBottom align="center">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  let params = {};
                  loginWithRedirect(params);
                }}
              >
                Log in
              </Button>
            </Typography>
          </Paper>
        </ThemeProvider>
      </div>
    )
  ) : (
    <div className={classes.root}>
      <CssBaseline />
      <ThemeProvider theme={muiTheme}>
        <Paper
          style={{
            height: "100vh",
          }}
        >
          <Box height={"40vh"} />
          <Typography variant="h3" gutterBottom align="center">
            You are offline!
          </Typography>
          <Grid container justify="center" alignItems="center" spacing={4}>
            <Grid item>
              <WifiOff />
            </Grid>
            <Grid item>
              <Typography variant="body1" gutterBottom align="center">
                &nbsp;This app requires an active internet connection. Please
                check your network!
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </ThemeProvider>
    </div>
  );
}

const APIChecker = (props) => {
  const { theme, setChecker } = props;

  const [checkingApis, setCheckingApis] = useState({
    phpAPI: true,
    hologramAPI: true,
    onfarmAPI: true,
  });
  const [apisWorking, setApisWorking] = useState({
    phpAPI: false,
    hologramAPI: false,
    onfarmAPI: false,
  });
  useEffect(() => {
    const hologramAPI = "/api/1/users/me";

    // const onfarmAPI =
    //   "https://api.precisionsustainableag.org/onfarm/raw?table=biomass_in_field&affiliation=MD";
    // setCheckingApis((a) => ({ ...a, phpAPI: true }));
    axios({
      method: "post",
      url: apiCorsUrl + `/watersensors`,
      data: QueryString.stringify({
        url: `${APIURL()}${hologramAPI}`,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
      responseType: "json",
    })
      .then(sleeper())
      .then((response) => {
        if (response.status === 200) {
          setApisWorking((a) => ({ ...a, phpAPI: true }));
          setCheckingApis((a) => ({ ...a, phpAPI: false, hologramAPI: true }));
        }
      })
      .then(sleeper())
      .then(() => {
        axios({
          method: "post",
          url: apiCorsUrl + `/watersensors`,
          data: QueryString.stringify({
            url: `${APIURL()}${hologramAPI}`,
          }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
          auth: {
            username: apiUsername,
            password: apiPassword,
          },
          responseType: "json",
        })
          .then((response) => {
            if (Object.keys(response.data.data).length > 0) {
              setApisWorking((a) => ({ ...a, hologramAPI: true }));
              setCheckingApis((a) => ({
                ...a,
                phpAPI: false,
                hologramAPI: false,
              }));
            }
          })
          .then(sleeper())
          .then(() => {
            setCheckingApis((a) => ({ ...a, onfarmAPI: true }));
            fetch(
              onfarmAPI + `/raw?table=biomass_in_field&affiliation=MD`
            ).then((r) => {
              if (r.headers.get("content-type").split(";")[0] === "text/html") {
                setApisWorking((a) => ({ ...a, onfarmAPI: true }));
                setCheckingApis((a) => ({ ...a, onfarmAPI: false }));
              }
            });

            //  fetch(onfarmAPI + `/raw?table=biomass_in_field&affiliation=MD`, {
            //   headers: {
            //     "Content-Type": "application/json",
            //     "x-api-key": apiKey,
            //   },
            // }).then((res) => {
          });
      })

      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    const { setChecker } = props;
    if (Object.values(apisWorking).every(Boolean)) setChecker(false);
  }, [apisWorking, props]);

  const StatusChecker = ({ checkingApis, apisWorking, type }) => {
    switch (type) {
      case "phpAPI":
        return (
          <>
            {checkingApis.phpAPI ? (
              "checking.."
            ) : apisWorking.phpAPI ? (
              <Check color="primary" />
            ) : (
              <Clear />
            )}
          </>
        );
      case "hologramAPI":
        return (
          <>
            {checkingApis.hologramAPI ? (
              "checking.."
            ) : apisWorking.hologramAPI ? (
              <Check color="primary" />
            ) : (
              <Clear />
            )}
          </>
        );
      case "onfarmAPI":
        return (
          <>
            {checkingApis.onfarmAPI ? (
              "checking.."
            ) : apisWorking.onfarmAPI ? (
              <Check color="primary" />
            ) : (
              <Clear />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Paper
          style={{
            height: "100vh",
          }}
        >
          <Box height={"40vh"} />
          <Box margin="0 auto" width="50%">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4" gutterBottom align="center">
                  Verifying api status
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="center"
                >
                  Tech Dashboard API{" "}
                  <StatusChecker
                    checkingApis={checkingApis}
                    apisWorking={apisWorking}
                    type={"phpAPI"}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="center"
                >
                  Hologram API{" "}
                  <StatusChecker
                    checkingApis={checkingApis}
                    apisWorking={apisWorking}
                    type={"hologramAPI"}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="center"
                >
                  Onfarm API{" "}
                  <StatusChecker
                    checkingApis={checkingApis}
                    apisWorking={apisWorking}
                    type={"onfarmAPI"}
                  />
                </Grid>
              </Grid>
              {Object.values(apisWorking).some((v, i, a) =>
                a.includes(false)
              ) &&
                !Object.values(checkingApis).some((v, i, a) =>
                  a.includes(true)
                ) && (
                  <Grid
                    item
                    container
                    spacing={3}
                    direction="row"
                    alignItems="center"
                    justify="center"
                  >
                    <Button
                      startIcon={<Replay />}
                      size="small"
                      color="primary"
                      variant="contained"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </Grid>
                )}
            </Grid>
          </Box>
        </Paper>
      </ThemeProvider>
    </>
  );
};

const sleeper = (ms = 500) => {
  return function (x) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms));
  };
};

export default App;
