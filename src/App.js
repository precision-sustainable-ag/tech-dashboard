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
  Container
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

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar
}));

function App() {
  const { loading } = useAuth0();
  const classes = useStyles();

  const [theme, setTheme] = useState({
    palette: {
      primary: { main: "#2e7d32" },
      secondary: { main: "#4d4d4d" },
      type: window.localStorage.getItem("theme")
        ? window.localStorage.getItem("theme")
        : "light"
    },

    typography: {
      useNextVariants: true,
      fontFamily: "'Nunito', sans-serif"
    }
  });

  const muiTheme = createMuiTheme(theme);

  const toggleThemeDarkness = () => {
    let newPaletteType = theme.palette.type === "light" ? "dark" : "light";
    setTheme({
      ...theme,
      palette: {
        ...theme.palette,
        type: newPaletteType
      }
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
  }, [theme]);
  return loading ? (
    <div className={classes.root}>
      <CssBaseline />
      <ThemeProvider theme={muiTheme}>
        <Paper
          style={{
            height: "100vh"
          }}
        >
          <Box height={"40vh"} />
          <Typography variant="h3" gutterBottom align="center">
            Loading..
          </Typography>
        </Paper>
      </ThemeProvider>
    </div>
  ) : (
    // <CssBaseline>
    <ThemeProvider theme={muiTheme}>
      <Container maxWidth={"xl"} className="mainContainer">
        <Header
          isDarkTheme={theme.palette.type === "light" ? false : true}
          setDarkTheme={toggleThemeDarkness}
        />
        {/* <DrawerComponent /> */}

        <main className={classes.content}>
          <div className={classes.toolbar} />
          {/* <Paper elevation={0} style={{ minHeight: "100%" }}> */}
          <Switch>
            {/* <Route path="/" component={Login} exact /> */}
            <Route
              render={props => (
                <LandingComponent
                  {...props}
                  isDarkTheme={theme.palette.type === "light" ? false : true}
                />
              )}
              path="/"
              exact
            />
            <PrivateRoute
              path="/table"
              render={props => <TableComponent {...props} />}
            />
            {/* <PrivateRoute path="/table" component={TableComponent} /> */}
            <PrivateRoute path="/issues" component={ReposComponent} exact />
            <PrivateRoute path="/devices" component={DevicesComponent} exact />
            <PrivateRoute
              path={`/devices/:deviceId`}
              component={DeviceComponent}
            />
            <PrivateRoute path={`/kobo-forms`} component={Forms} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/device-enroll" component={DeviceEnroll} />
          </Switch>
          {/* </Paper> */}
        </main>
        {/* </Paper> */}
      </Container>
    </ThemeProvider>
    // </CssBaseline>
  );
}

export default App;
