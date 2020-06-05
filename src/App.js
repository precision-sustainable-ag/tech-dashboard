import React, { Fragment, useState, useEffect } from "react";

import "./Styles/App.css";

import Header from "./Header/Header";

import {
  makeStyles,
  Box,
  MuiThemeProvider,
  createMuiTheme,
  CssBaseline,
  ThemeProvider,
  Paper,
  Typography,
  Container,
  Button,
} from "@material-ui/core";
import TableComponent from "./Table/Table";
import { Switch, Route } from "react-router-dom";
import { ReposComponent } from "./Issues/Issues";
import DevicesComponent from "./Devices/Devices";
import DeviceComponent from "./Devices/Device";
import Forms from "./Forms/Forms";
import LandingComponent from "./Landing/Landing";
// import Login from "./Auth/Login/Login";

import { useAuth0 } from "./Auth/react-auth0-spa";
import Loading from "react-loading";
import PrivateRoute from "./utils/private-routes";
import Skeleton from "@material-ui/lab/Skeleton";
import Profile from "./Profile/Profile";
import DeviceEnroll from "./Devices/Device-Enroll/DeviceEnroll";
import WaterSensorData from "./Devices/WaterSensorData/WaterSensorData";
import WaterSensorByGateway from "./Devices/WaterSensorData/WaterSensorByGateway";
import SiteEnrollment from "./SiteEnrollment/SiteEnrollment";
import PageNotFound from "./PageNotFound";
import AllDataTable from "./Table/AllDataTable";

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

const drawerWidth = 240;
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

function App() {
  const online = useOnlineStatus();
  const {
    loading,
    isAuthenticated,
    loginWithRedirect,
    loginWithPopup,
    logout,
    user,
    getTokenSilently,
  } = useAuth0();
  const classes = useStyles();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [theme, setTheme] = useState({
    palette: {
      primary: { main: "#2e7d32" },
      secondary: { main: "#4d4d4d" },
      type: window.localStorage.getItem("theme")
        ? window.localStorage.getItem("theme")
        : "light",
    },

    typography: {
      useNextVariants: true,
      fontFamily: "bilo, sans-serif",
    },
  });

  const muiTheme = createMuiTheme(theme);

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

  const isDarkTheme = () => {
    return theme.palette.type === "light" ? false : true;
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

  useEffect(() => {
    const checkAuth = async () => {
      console.log(isAuthenticated);
      if (isAuthenticated) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    if (!loading) {
      checkAuth();
    }
  }, [loading, getTokenSilently]);

  // const callApi = async () => {
  //   const token = await getTokenSilently();
  //   // future use of this would be for authentication via bearer token
  //   // console.log(token);
  // };

  // useEffect(() => {
  //   if (isAuthenticated) callApi();
  // }, [isAuthenticated]);

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
    ) : isLoggedIn ? (
      <ThemeProvider theme={muiTheme}>
        <Container maxWidth={"xl"} className="mainContainer">
          <Header
            isDarkTheme={theme.palette.type === "light" ? false : true}
            setDarkTheme={toggleThemeDarkness}
            isLoggedIn={isLoggedIn}
          />
          {/* <DrawerComponent /> */}

          <main className={classes.content}>
            <div className={classes.toolbar} />
            {/* <Paper elevation={0} style={{ minHeight: "100%" }}> */}
            <Switch>
              {/* <Route path="/" component={Login} exact /> */}
              <Route
                render={(props) => (
                  <LandingComponent
                    {...props}
                    isDarkTheme={theme.palette.type === "light" ? false : true}
                  />
                )}
                path="/"
                exact
              />
              {/* <PrivateRoute
              path="/table"
              render={(props) => <TableComponent {...props} />}
            /> */}
              <PrivateRoute
                path="/table"
                render={(props) => <AllDataTable {...props} />}
              />
              <PrivateRoute
                path="/site-enroll"
                render={(props) => <SiteEnrollment {...props} />}
              />
              {/* <PrivateRoute path="/table" component={TableComponent} /> */}
              <PrivateRoute path="/issues" component={ReposComponent} exact />
              <PrivateRoute
                path="/devices"
                component={DevicesComponent}
                exact
              />
              <PrivateRoute
                path={`/devices/:deviceId`}
                component={DeviceComponent}
              />
              <PrivateRoute path={`/kobo-forms`} component={Forms} />
              <PrivateRoute path="/profile" component={Profile} />
              <PrivateRoute path="/device-enroll" component={DeviceEnroll} />
              <PrivateRoute
                path="/water-sensors"
                component={WaterSensorData}
                exact
              />
              <PrivateRoute
                path={`/water-sensors/:gatewayId`}
                // component={WaterSensorByGateway}
                render={(props) => <WaterSensorByGateway {...props} />}
              />
              <Route path="*">
                <PageNotFound />
              </Route>
            </Switch>
            {/* </Paper> */}
          </main>
          {/* </Paper> */}
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
                  loginWithPopup(params);
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
          <Typography variant="body1" gutterBottom align="center">
            Unfortunately, this app requires an internet connection to work.
            Please check back later!
          </Typography>
        </Paper>
      </ThemeProvider>
    </div>
  );

  // return true ? ( // <CssBaseline>
  //   <ThemeProvider theme={muiTheme}>
  //     <Container maxWidth={"xl"} className="mainContainer">
  //       <Header
  //         isDarkTheme={theme.palette.type === "light" ? false : true}
  //         setDarkTheme={toggleThemeDarkness}
  //       />
  //       {/* <DrawerComponent /> */}

  //       <main className={classes.content}>
  //         <div className={classes.toolbar} />
  //         {/* <Paper elevation={0} style={{ minHeight: "100%" }}> */}
  //         <Switch>
  //           {/* <Route path="/" component={Login} exact /> */}
  //           <Route
  //             render={(props) => (
  //               <LandingComponent
  //                 {...props}
  //                 isDarkTheme={theme.palette.type === "light" ? false : true}
  //               />
  //             )}
  //             path="/"
  //             exact
  //           />
  //           <PrivateRoute
  //             path="/table"
  //             render={(props) => <TableComponent {...props} />}
  //           />
  //           <PrivateRoute
  //             path="/site-enroll"
  //             render={(props) => <SiteEnrollment {...props} />}
  //           />
  //           {/* <PrivateRoute path="/table" component={TableComponent} /> */}
  //           <PrivateRoute path="/issues" component={ReposComponent} exact />
  //           <PrivateRoute path="/devices" component={DevicesComponent} exact />
  //           <PrivateRoute
  //             path={`/devices/:deviceId`}
  //             component={DeviceComponent}
  //           />
  //           <PrivateRoute path={`/kobo-forms`} component={Forms} />
  //           <PrivateRoute path="/profile" component={Profile} />
  //           <PrivateRoute path="/device-enroll" component={DeviceEnroll} />
  //           <PrivateRoute
  //             path="/water-sensors"
  //             component={WaterSensorData}
  //             exact
  //           />
  //           <PrivateRoute
  //             path={`/water-sensors/:gatewayId`}
  //             // component={WaterSensorByGateway}
  //             render={(props) => <WaterSensorByGateway {...props} />}
  //           />
  //           <Route path="*">
  //             <PageNotFound />
  //           </Route>
  //         </Switch>
  //         {/* </Paper> */}
  //       </main>
  //       {/* </Paper> */}
  //     </Container>
  //   </ThemeProvider>
  // ) : (
  //   <div className={classes.root}>
  //     <CssBaseline />
  //     <ThemeProvider theme={muiTheme}>
  //       <Paper
  //         style={{
  //           height: "100vh",
  //         }}
  //       >
  //         <Box height={"40vh"} />
  //         <Typography variant="h3" gutterBottom align="center">
  //           Please Log In To Continue
  //         </Typography>
  //         <Typography variant="body1" gutterBottom align="center">
  //           <Button
  //             variant="contained"
  //             color="primary"
  //             onClick={() => {
  //               let params = {
  //                 redirect_uri: window.location.href,
  //               };
  //               loginWithPopup(params);
  //             }}
  //           >
  //             Log in
  //           </Button>
  //         </Typography>
  //       </Paper>
  //     </ThemeProvider>
  //   </div>
  // );

  // return "hello";
}

export default App;
