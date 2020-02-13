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
// import Login from "./Auth/Login/Login";

import { useAuth0 } from "./Auth/react-auth0-spa";
import Loading from "react-loading";
import PrivateRoute from "./utils/private-routes";



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
  const { loading } = useAuth0();
  const classes = useStyles();
  const [loggedIn, setLoggedIn] = useState(false);
  return loading ? (<Loading type="spin" width="200" height="200" />) :  (
    <Fragment>
      <Header />
      {/* <DrawerComponent /> */}

      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Box>
          <Switch>
            {/* <Route path="/" component={Login} exact /> */}
            <PrivateRoute path="/table" component={TableComponent} />
            <Route path="/" component={LandingComponent} exact />
            <PrivateRoute path="/issues" component={ReposComponent} exact />
            <PrivateRoute path="/devices" component={DevicesComponent} exact />
            <PrivateRoute path={`/devices/:deviceId`} component={DeviceComponent} />
            <PrivateRoute path={`/kobo-forms`} component={Forms} />
          </Switch>
        </Box>
      </main>
    </Fragment>
  );
}

export default App;
