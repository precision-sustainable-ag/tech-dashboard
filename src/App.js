import React from "react";
import logo from "./logo.svg";
import "./Styles/App.css";
import DrawerComponent from "./Sidebar/DrawerComponent";
import Header from "./Header/Header";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, Typography, Box } from "@material-ui/core";
import TableComponent from "./Table/Table";
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

function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header />
      <DrawerComponent />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Box>
          <TableComponent />
        </Box>
      </main>
    </div>
  );
}

export default App;
