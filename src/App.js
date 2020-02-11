import React, { Fragment, useState } from "react";

import "./Styles/App.css";

import Header from "./Header/Header";

import { makeStyles, Box } from "@material-ui/core";
import TableComponent from "./Table/Table";
import { Switch, Route } from "react-router-dom";
import { ReposComponent } from "./Issues/Issues";
import DevicesComponent from "./Devices/Devices";
import DeviceComponent from "./Devices/Device";
import Forms from "./Forms/Forms";
import LandingComponent from "./Landing/Landing";
import Login from "./Auth/Login/Login";
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar
}));

function App() {
  const classes = useStyles();
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <Fragment>
      <Header />
      {/* <DrawerComponent /> */}

      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Box>
          <Switch>
            <Route path="/" component={Login} exact />
            <Route path="/table" component={TableComponent} exact />
            <Route path="/landing" component={LandingComponent} exact />
            <Route path="/issues" component={ReposComponent} exact />
            <Route path="/devices" component={DevicesComponent} exact />
            <Route path={`/devices/:deviceId`} component={DeviceComponent} />
            <Route path={`/kobo-forms`} component={Forms} />
          </Switch>
        </Box>
      </main>
    </Fragment>
  );
}

export default App;
