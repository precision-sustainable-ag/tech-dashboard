//Dependency Imports
import React, { useEffect, useContext, useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Typography,
  Menu,
  MenuItem,
  Collapse,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  Radio,
  Storage,
  QuestionAnswer,
  ViewList,
  AccountCircle,
  Lock,
  BrightnessHigh,
  BrightnessLow,
  ExpandLess,
  ExpandMore,
} from "@material-ui/icons";
import Axios from "axios";

//Local Imports
import { apiPassword, apiUsername, apiURL } from "../utils/api_secret";
import { Context } from "../Store/Store";
import { useAuth0 } from "../Auth/react-auth0-spa";

const drawerWidth = 240;
const qs = require("qs");

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function Header(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const profileMenuOpen = Boolean(anchorEl);
  const [state, dispatch] = useContext(Context);

  const { logout, user, loginWithRedirect } = useAuth0();
  const [openAllDataNav, setOpenAllDataNav] = useState(false);

  const handleOpenAllDataNav = () => {
    setOpenAllDataNav(!openAllDataNav);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleThemeDarkness = () => {
    props.setDarkTheme();
  };

  const addUserToDatabase = async (dataString) => {
    try {
      await Axios({
        method: "POST",
        url: `${apiURL}/api/users`,
        data: dataString,
        auth: {
          username: apiUsername,
          password: apiPassword,
        },
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }).then((response) => {
        console.log(response.data);
        if (response.data.return) {
          // user added
          dispatch({
            type: "UPDATE_ROLE",
            data: {
              userRole: "default",
            },
          });
        }
      });
    } catch (e) {
      console.error(e);
    }
  };
  const fetchRole = async (user) => {
    // console.log(apiPassword);
    await Axios.get(`${apiURL}/api/users/${user.email}`, {
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
    }).then((response) => {
      let data = response.data;
      if (data.data === null) {
        //  user does not exist.. add record with default role
        let obj = {
          email: user.email,
        };

        addUserToDatabase(qs.stringify(obj));
      } else {
        console.log("welcome back!");
        dispatch({
          type: "UPDATE_ROLE",
          data: {
            userRole: data.data.role,
          },
        });
        dispatch({
          type: "UPDATE_USER_INFO",
          data: {
            userInfo: data.data,
          },
        });
        //update user details to state
      }
    });
  };

  useEffect(() => {
    // RenderRoleURL(user);
    // if (isAuthenticated) {
    //   fetchRole(user);
    // }

    if (user) {
      fetchRole(user);
    }
  }, [user]);
  return (
    <div className={classes.root}>
      {/* <CssBaseline /> */}
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        color="primary"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title}>
            PSA Tech Dashboard
          </Typography>
          <IconButton color="inherit" onClick={toggleThemeDarkness}>
            {props.isDarkTheme ? <BrightnessLow /> : <BrightnessHigh />}
          </IconButton>
          {!props.isLoggedIn && (
            <IconButton
              color="inherit"
              onClick={() =>
                loginWithRedirect({ redirect_uri: window.location.href })
              }
            >
              <Lock />
            </IconButton>
          )}

          {props.isLoggedIn && (
            <div>
              <IconButton
                aria-label="user profile"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={profileMenuOpen}
                onClose={handleProfileMenuClose}
              >
                <MenuItem component={Link} to={"/profile"}>
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => logout({ returnTo: window.location.origin })}
                >
                  Log Out
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>

        <Divider />
        <List>
          <ListItem
            onClick={() => setOpen(false)}
            button
            key={"Home"}
            component={Link}
            to="/"
          >
            <ListItemIcon>
              <ViewList />
            </ListItemIcon>
            <ListItemText primary={"Quick Links"} />
          </ListItem>
          <ListItem
            onClick={() => handleOpenAllDataNav()}
            button
            key={"All Data"}
            component={Link}
          >
            <ListItemIcon>
              <ViewList />
            </ListItemIcon>
            <ListItemText primary={"All Data"} />
            {openAllDataNav ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openAllDataNav} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                to="/table"
                component={Link}
                onClick={() => {
                  setOpen(false);
                  handleOpenAllDataNav();
                }}
              >
                <ListItemText inset primary="Site Information" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem
            onClick={() => setOpen(false)}
            button
            key={"Site Enrollment"}
            component={Link}
            to="/site-enroll"
          >
            <ListItemIcon>
              <ViewList />
            </ListItemIcon>
            <ListItemText primary={"Site Enrollment"} />
          </ListItem>

          <ListItem
            onClick={() => setOpen(false)}
            button
            key={"Issues"}
            component={Link}
            to="/issues"
          >
            <ListItemIcon>
              <QuestionAnswer />
            </ListItemIcon>
            <ListItemText primary={"Issues"} />
          </ListItem>
          <ListItem
            onClick={() => setOpen(false)}
            button
            key={"Water Sensors"}
            component={Link}
            to="/water-sensors"
          >
            <ListItemIcon>
              <QuestionAnswer />
            </ListItemIcon>
            <ListItemText primary={"Water Sensors"} />
          </ListItem>

          <ListItem
            onClick={() => setOpen(false)}
            button
            key="Devices"
            component={Link}
            to="/devices"
          >
            <ListItemIcon>
              <Radio />
            </ListItemIcon>
            <ListItemText primary="Devices" />
          </ListItem>
          <ListItem
            onClick={() => setOpen(false)}
            button
            key="Forms"
            component={Link}
            to="/kobo-forms"
          >
            <ListItemIcon>
              <Storage />
            </ListItemIcon>
            <ListItemText primary="Forms" />
          </ListItem>
          {/* <ListItem
            onClick={() => setOpen(false)}
            button
            key="Device Enroll"
            component={Link}
            to="/device-enroll"
          >
            <ListItemIcon>
              <AddLocation />
            </ListItemIcon>
            <ListItemText primary="Device Enroll" />
          </ListItem> */}
        </List>
      </Drawer>
    </div>
  );
}
