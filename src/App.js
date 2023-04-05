// Dependency Imports
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import {
  makeStyles,
  Box,
  CssBaseline,
  ThemeProvider,
  Paper,
  Typography,
  Container,
  Button,
  Grid,
  responsiveFontSizes,
  createTheme,
  Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import { setSnackbarData } from './Store/actions';
import { useSelector } from 'react-redux';

// Local Imports
import { useAuth0 } from './Auth/react-auth0-spa';
import PrivateRoute from './utils/private-routes';

import './Styles/App.css';

import { Switch, Route } from 'react-router-dom';

import { Check, Clear, Replay, WifiOff } from '@material-ui/icons';

import DeviceEnroll from './Devices/components/DeviceEnroll/DeviceEnroll';
import WaterSensorByGateway from './Devices/components/WaterSensorByGateway/WaterSensorByGateway';
import SiteEnrollment from './SiteInformation/Enrollment/SiteEnrollment';
import PageNotFound from './PageNotFound';
import AllDataTable from './SiteInformation/ContactAndLocation/AllDataTable';
import FarmerReport from './SiteInformation/FarmerReport/FarmerReport';

import Device from './Devices/components/Device/Device';

import Header from './Header/Header';

import Issues from './Issues/Issues';
import Issue from './Issues/components/Issue/Issue';
import Forms from './Forms/Forms';

import StressCams from './Devices/components/StressCams/StressCams';
import WaterSensors from './Devices/components/WaterSensors/WaterSensors';
import DevicesWrapper from './Devices/components/DevicesWrapper/DevicesWrapper';

import FormData from './Forms/components/FormData/FormData';
import FarmDates from './SiteInformation/FarmDates/FarmDates';
import FarmValues from './Biomass/FarmValues/FarmValues';
import SensorVisuals from './SensorVisuals/SensorVisuals';
import VisualsByCode from './SensorVisuals/components/VisualsByCode/VisualsByCode';
import Profile from './Profile/Profile';
import YieldPage from './Yield/YieldPage';

import FarmDatesCalendar from './SiteInformation/FarmDates/components/FarmDatesCalendar/FarmDatesCalendar';

import ProducerInformation from './ProducerInformation/ProducerInformation';

import TaskTracker from './TaskTracker/TaskTracker';

import Protocols from './Protocols/Protocols';
import DecompBag from './DecompBag/DecompBag';
import Debug from './Debug/Debug';
import axios from 'axios';
import { apiPassword, apiUsername, onfarmAPI, onfarmStaticApiKey } from './utils/api_secret';
import { apiCorsUrl, hologramApiUrl } from './Devices/shared/hologramConstants';
import QueryString from 'qs';
import StressCamVisuals from './StressCamVisuals/StressCamVisuals';
import { toggleIsDarkTheme, setWindowHeight, setWindowWidth } from './Store/actions';
import { useDispatch } from 'react-redux';
import Weeds3dViewer from './Weeds3dViewer/Weeds3dViewer';
// Helper function

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useOnFarmApiStatus = (manualRetry = false) => {
  const [status, setStatus] = useState({ checking: true, working: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    const url = `${onfarmAPI}/raw?table=cc_mixture`;

    const fetchApi = async () => {
      try {
        setStatus({ checking: true, working: false });
        const response = await fetch(url, {
          headers: {
            'x-api-key': onfarmStaticApiKey,
          },
        });

        const records = await response.json();

        if (Array.isArray(records) && response.status === 200) {
          setStatus({ checking: false, working: true });
        } else {
          setStatus({ checking: false, working: false });
        }
      } catch (e) {
        console.error(e);
        setStatus({ checking: false, working: false });
      }
    };

    // run every 2 minutes
    const apiTimer = setTimeout(() => {
      setCount((c) => c + 1);
      fetchApi();
    }, 2 * 60000);

    // run immediately on homepage
    if (window.location.pathname === '/' || manualRetry) fetchApi();

    return () => clearTimeout(apiTimer);
  }, [count, manualRetry]);
  return status;
};

function useOnlineStatus() {
  const [online, setOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setOnline(true);
    }

    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
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
  const classes = useStyles();
  const online = useOnlineStatus();
  const [onFarmManualCheck, setOnFarmManualCheck] = useState(false);
  const snackbarData = useSelector((state) => state.appData.snackbarData);
  const { checking: onfarmApiChecking, working: onfarmApiWorking } =
    useOnFarmApiStatus(onFarmManualCheck);

  const { loading, isAuthenticated, loginWithRedirect, getTokenSilently } = useAuth0();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();

  const [theme, setTheme] = useState({
    palette: {
      primary: { main: '#2e7d32' },
      secondary: { main: '#4d4d4d' },
      type:
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : window.localStorage.getItem('theme')
          ? window.localStorage.getItem('theme')
          : 'light',
    },

    typography: {
      useNextVariants: true,
      fontFamily: 'bilo, sans-serif',
    },

    overrides: {
      MuiTooltip: {
        tooltip: {
          fontSize: '0.9em',
          fontWeight: 'bolder',
          color: 'black',
          backgroundColor: '#eee',
        },
      },
    },
  });

  let muiTheme = createTheme(theme);
  muiTheme = responsiveFontSizes(muiTheme);

  useEffect(() => {
    dispatch(toggleIsDarkTheme(theme.palette.type === 'light' ? false : true));
  }, []);

  const toggleThemeDarkness = () => {
    let newPaletteType = theme.palette.type === 'light' ? 'dark' : 'light';
    setTheme({
      ...theme,
      palette: {
        ...theme.palette,
        type: newPaletteType,
      },
    });
    dispatch(toggleIsDarkTheme(newPaletteType === 'light' ? false : true));
  };

  const handleResize = () => {
    dispatch(setWindowHeight(window.innerHeight));
    dispatch(setWindowWidth(window.innerWidth));
  };

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        (timer = null), func.apply(context, args);
      }, 500);
    };
  };

  const debouncedHandleResize = useCallback(debounce(handleResize), []);

  useEffect(() => {
    window.addEventListener('resize', debouncedHandleResize, false);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize, false);
    };
  }, []);

  useEffect(() => {
    if (!window.localStorage.getItem('theme')) {
      // set localstorage with a default theme
      window.localStorage.setItem('theme', 'light');
    }

    if (theme.palette.type !== 'light') {
      // update localstorage
      window.localStorage.setItem('theme', 'dark');
      document.body.style.backgroundColor = '#121212';
      document.body.style.color = '#fbfbfb';
    } else {
      // update localstorage
      window.localStorage.setItem('theme', 'light');
      document.body.style.backgroundColor = '#fff';
      document.body.style.color = '#000';
      // document.body.style.backgroundColor = "rgb(247, 249, 252)";
    }

    if (!window.localStorage.getItem('font')) {
      window.localStorage.setItem('font', theme.typography.fontFamily);
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

  return online && (onfarmApiWorking || onfarmApiChecking) ? (
    loading ? (
      <div className={classes.root}>
        <CssBaseline />
        <ThemeProvider theme={muiTheme}>
          <Box
            style={{
              height: '100vh',
            }}
          >
            <Box height={'40vh'} />
            <Typography variant="h3" gutterBottom align="center">
              Loading
            </Typography>
          </Box>
        </ThemeProvider>
      </div>
    ) : checkingAPIs ? (
      <div className={classes.root}>
        <APIChecker theme={muiTheme} setChecker={setCheckingAPIs} />
      </div>
    ) : isLoggedIn ? (
      <ThemeProvider theme={muiTheme}>
        <Container maxWidth={'xl'} className="mainContainer">
          <Header setDarkTheme={toggleThemeDarkness} isLoggedIn={isLoggedIn} />
          {/* <DrawerComponent /> */}

          <Suspense fallback={<div>Loading...</div>}>
            <main className={classes.content}>
              <div className={`${classes.toolbar} topHead`} />

              <Switch>
                <PrivateRoute
                  path="/on-farm-protocols"
                  render={() => <Protocols title="On Farm Protocols" />}
                />
                <PrivateRoute
                  path="/devices/stress-cams"
                  render={() => <StressCams title="Devices - Stress Cams" />}
                />
                <PrivateRoute
                  path="/devices/water-sensors"
                  render={() => <WaterSensors title="Devices - Water Sensors" />}
                />

                <PrivateRoute
                  path="/site-information/contact-enrollment"
                  render={() => <AllDataTable active={true} />}
                />

                <PrivateRoute
                  path="/site-information/inactive-sites"
                  render={() => <AllDataTable active={false} />}
                />

                <PrivateRoute
                  path="/site-information/farmer-report"
                  render={() => <FarmerReport title="Farmer Report" />}
                />

                <PrivateRoute
                  path="/site-information/farm-dates"
                  exact
                  render={() => <FarmDates title="Farm Dates" />}
                />

                <PrivateRoute
                  path="/site-information/farm-dates/calendar"
                  render={(props) => <FarmDatesCalendar {...props} title="Farm Dates - Calendar" />}
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
                  render={(props) => <Issue {...props} title="Issue" />}
                />
                <PrivateRoute path="/devices" component={DevicesWrapper} exact />
                <PrivateRoute
                  path={`/devices/:deviceId`}
                  render={(props) => <Device {...props} title="Device Data" />}
                />
                <PrivateRoute
                  path={`/kobo-forms/`}
                  exact
                  render={(props) => <Forms {...props} title="Kobo Forms" />}
                />
                <PrivateRoute
                  path={`/kobo-forms/:formId`}
                  render={() => (
                    <FormData
                      // assetId={props}
                      title="Kobo Forms - Data"
                    />
                  )}
                />

                <PrivateRoute
                  path={`/producers`}
                  render={(props) => (
                    <ProducerInformation {...props} title="Producer Information" />
                  )}
                />

                <PrivateRoute path="/profile" component={Profile} />
                <PrivateRoute path="/device-enroll" component={DeviceEnroll} />

                {/* New Sensors Page URLS */}

                <PrivateRoute
                  path={`/decomp-bags`}
                  render={(props) => <SensorVisuals type="decompbags" {...props} />}
                  exact
                />
                <PrivateRoute path={`/decomp-bags/:year/:code`} component={DecompBag} exact />

                <PrivateRoute path={`/debug`} render={(props) => <Debug {...props} />} exact />

                {/* New Sensors Page URLS */}

                <PrivateRoute
                  path={`/sensor-visuals`}
                  render={(props) => <SensorVisuals type="watersensors" {...props} />}
                  exact
                />
                <PrivateRoute
                  path={`/sensor-visuals/:year/:code`}
                  component={VisualsByCode}
                  exact
                />

                {/* Stress Cam visuals Page URLS */}

                <PrivateRoute
                  path={`/stress-cam-visuals`}
                  render={(props) => <SensorVisuals type="stresscams" {...props} />}
                  exact
                />
                <PrivateRoute
                  path={`/stress-cam-visuals/:year/:code`}
                  component={StressCamVisuals}
                  exact
                />

                {/* Water sensor Page URLS */}
                <PrivateRoute
                  path={`/water-sensors/:gatewayId`}
                  render={(props) => <WaterSensorByGateway {...props} />}
                />

                {/* Biomass URLS */}
                <PrivateRoute
                  path={`/biomass/farm-values`}
                  render={(props) => <FarmValues {...props} />}
                />

                {/* Yield URLS */}
                <PrivateRoute path={`/yield`} render={(props) => <YieldPage {...props} />} />

                {/* Task Tracker View */}
                <PrivateRoute path={"/"} exact component={TaskTracker} />
                <PrivateRoute path={`/weeds-3d-viewer`} component={Weeds3dViewer} exact />
                <Route path="*">
                  <PageNotFound />
                </Route>
              </Switch>
              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                open={snackbarData.open}
                autoHideDuration={10000}
                onClose={() =>
                  dispatch(setSnackbarData({ ...snackbarData, open: !snackbarData.open }))
                }
              >
                <Alert severity={snackbarData.severity}>{snackbarData.text}</Alert>
              </Snackbar>
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
              height: '100vh',
            }}
          >
            <Box height={'40vh'} />
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
            height: '100vh',
          }}
        >
          <Box height={'40vh'} />

          {!online ? (
            <Typography variant="h4" gutterBottom align="center">
              You are Offline!
            </Typography>
          ) : (
            <Typography variant="h4" gutterBottom align="center">
              {!onfarmApiChecking && !onfarmApiWorking
                ? `On Farm API is currently down!`
                : `You are offline!`}
            </Typography>
          )}

          <Grid container justifyContent="center" alignItems="center" spacing={4}>
            <Grid item>
              <WifiOff />
            </Grid>
            <Grid item>
              {!online ? (
                <Typography variant="body1" gutterBottom align="center">
                  &nbsp;This app requires an active internet connection. Please check your network!
                </Typography>
              ) : (
                <Typography variant="body1" gutterBottom align="center">
                  &nbsp;
                  {!onfarmApiChecking && !onfarmApiWorking
                    ? `Retrying...`
                    : `This app requires an active internet connection. Please
                check your network!`}
                </Typography>
              )}
            </Grid>

            {!onfarmApiChecking && !onfarmApiWorking && (
              <Grid item>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setOnFarmManualCheck((v) => !v)}
                >
                  Retry
                </Button>
              </Grid>
            )}
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
  });
  const [apisWorking, setApisWorking] = useState({
    phpAPI: false,
    hologramAPI: false,
  });
  const [retry, setRetry] = useState(false);
  const [apiIssue, setApiIssue] = useState(0);
  useEffect(() => {
    const hologramAPI = '/api/1/users/me';

    axios({
      method: 'post',
      url: apiCorsUrl + `/watersensors`,
      data: QueryString.stringify({
        url: `${hologramApiUrl}${hologramAPI}`,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
      responseType: 'json',
    })
      .then((response) => {
        if (response.status === 200) {
          setApisWorking((a) => ({ ...a, phpAPI: true }));
          setCheckingApis((a) => ({ ...a, phpAPI: false, hologramAPI: true }));
        } else {
          setApisWorking((a) => ({ ...a, phpAPI: false }));
          setCheckingApis((a) => ({ ...a, phpAPI: false, hologramAPI: true }));
        }
      })
      .catch((e) => {
        setApiIssue((apiIssue) => apiIssue + 1);
        setApisWorking((a) => ({ ...a, phpAPI: false }));
        setCheckingApis((a) => ({ ...a, phpAPI: false, hologramAPI: true }));
        console.error(e);
      })

      .then(() => {
        axios({
          method: 'post',
          url: apiCorsUrl + `/watersensors`,
          data: QueryString.stringify({
            url: `${hologramApiUrl}${hologramAPI}`,
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          auth: {
            username: apiUsername,
            password: apiPassword,
          },
          responseType: 'json',
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
          .catch((e) => {
            setApiIssue((apiIssue) => apiIssue + 1);
            setApisWorking((a) => ({ ...a, hologramAPI: false }));
            setCheckingApis((a) => ({
              ...a,
              phpAPI: false,
              hologramAPI: false,
            }));
            console.error(e);
          });
      })

      .catch((e) => {
        setApiIssue((apiIssue) => apiIssue + 1);
        setApisWorking((a) => ({ ...a, onfarmAPI: false }));
        setCheckingApis((a) => ({ ...a, onfarmAPI: false }));
        console.error(e);
      });
  }, [retry]);

  useEffect(() => {
    if (Object.values(apisWorking).every(Boolean)) setChecker(false);
  }, [apisWorking, setChecker]);

  const StatusChecker = ({ checkingApis, apisWorking, type }) => {
    switch (type) {
      case 'phpAPI':
        return (
          <>
            {checkingApis.phpAPI ? (
              'checking..'
            ) : apisWorking.phpAPI ? (
              <Check color="primary" />
            ) : (
              <Clear />
            )}
          </>
        );
      case 'hologramAPI':
        return (
          <>
            {checkingApis.hologramAPI ? (
              'checking..'
            ) : apisWorking.hologramAPI ? (
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
  StatusChecker.propTypes = {
    checkingApis: PropTypes.shape({
      phpAPI: PropTypes.bool,
      onfarmAPI: PropTypes.bool,
      hologramAPI: PropTypes.bool,
    }),
    apisWorking: PropTypes.shape({
      phpAPI: PropTypes.bool,
      onfarmAPI: PropTypes.bool,
      hologramAPI: PropTypes.bool,
    }),
    type: PropTypes.oneOf(['onfarmAPI', 'hologramAPI', 'phpAPI']),
  };
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Box
          style={{
            height: '100vh',
          }}
        >
          <Box height={'40vh'} />
          <Box margin="0 auto" width="50%">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4" gutterBottom align="center">
                  {apiIssue !== 0 ? `Tech Dashboard is currently Down` : `Verifying api status`}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Grid container direction="row" alignItems="center" justifyContent="center">
                  Tech Dashboard API{' '}
                  <StatusChecker
                    checkingApis={checkingApis}
                    apisWorking={apisWorking}
                    type={'phpAPI'}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="row" alignItems="center" justifyContent="center">
                  Hologram API{' '}
                  <StatusChecker
                    checkingApis={checkingApis}
                    apisWorking={apisWorking}
                    type={'hologramAPI'}
                  />
                </Grid>
              </Grid>
              {Object.values(apisWorking).some((v, i, a) => a.includes(false)) &&
                !Object.values(checkingApis).some((v, i, a) => a.includes(true)) && (
                  <Grid
                    item
                    container
                    spacing={3}
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Button
                      startIcon={<Replay />}
                      size="small"
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        setRetry(!retry);
                      }}
                    >
                      Retry
                    </Button>
                  </Grid>
                )}
            </Grid>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default App;

APIChecker.propTypes = {
  theme: PropTypes.object,
  setChecker: PropTypes.func,
};
