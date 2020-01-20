import React from "react";
import Drawer from "@material-ui/core/Drawer";
import {
  //   Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  makeStyles
} from "@material-ui/core";
import { Radio, QuestionAnswer, ViewList } from "@material-ui/icons/";

import { Link } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar
}));

const DrawerComponent = () => {
  const classes = useStyles();
  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      anchor="left"
      classes={{ paper: classes.drawerPaper }}
    >
      <div className={classes.toolbar} />

      <List>
        {/* {["All Data", "Issues"].map((text, index) => ( */}

        <ListItem button key={"All Data"} component={Link} to="/">
          <ListItemIcon>
            <ViewList />
          </ListItemIcon>
          <ListItemText primary={"All Data"} />
        </ListItem>

        <ListItem button key={"Issues"} component={Link} to="/issues">
          <ListItemIcon>
            <QuestionAnswer />
          </ListItemIcon>
          <ListItemText primary={"Issues"} />
        </ListItem>

        <ListItem button key="Devices" component={Link} to="/devices">
          <ListItemIcon>
            <Radio />
          </ListItemIcon>
          <ListItemText primary="Devices" />
        </ListItem>
        {/* {index % 2 === 0 ? <Inbox /> : <Mail />} */}

        {/* ))} */}
      </List>
    </Drawer>
  );
};

export default DrawerComponent;
