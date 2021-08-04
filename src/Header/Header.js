// Dependency Imports
import React, { useEffect, useContext, useState } from "react";
import clsx from "clsx";
import Apistatus from "../APIStatus"; 
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import { RiSensorFill, RiTimeLine } from "react-icons/all";
import ErrorIcon from "@material-ui/icons/Error";
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
  Icon,
  Button
} from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  AccountCircle,
  Lock,
  BrightnessHigh,
  BrightnessLow,
  ExpandLess,
  ExpandMore,
  ListAlt,
  Info,
  BugReport,
  Storage,
  Person,
  CheckCircleRounded,
} from "@material-ui/icons";
import Axios from "axios";
import { Octokit } from "@octokit/rest";
import PropTypes from "prop-types";

// Local Imports
import { apiPassword, apiUsername, apiURL } from "../utils/api_secret";
import { Context } from "../Store/Store";
import { useAuth0 } from "../Auth/react-auth0-spa";
import { githubToken } from "../utils/api_secret";
import { addToTechnicians } from "../utils/SharedFunctions";
import { debugAdmins } from "../utils/constants";

//Global Vars
const drawerWidth = 240;
const qs = require("qs");

// Styles
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

// Default function
export default function Header(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const profileMenuOpen = Boolean(anchorEl);
  const [state, dispatch] = useContext(Context);
  const [auth0works,setAuth0works] = useState(true);
  const [anchorForAPIs, setAnchorForAPIs] = useState(null);
      
  const { logout, user, loginWithRedirect } = useAuth0();
  const [openAllDataNav, setOpenAllDataNav] = useState(false);
  const [openDevicesNav, setOpenDevicesNav] = useState(false);
  const [openNav, setOpenNav] = useState({
    decomp: false,
    biomass: false,
    site_info: false,
    devices: false,
    waterSensors: false,
    stressCams: false,
  });

  const { getTokenSilently } = useAuth0();
  const handleCloseAPIMenu = () => {
		setAnchorForAPIs(null);
	};
  const handleOpenAllDataNav = () => {
    setOpenAllDataNav(!openAllDataNav);
  };
  const handleOpenDevicesNav = () => {
    setOpenDevicesNav(!openDevicesNav);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleOpenAPIMenu = (event) => {
		setAnchorForAPIs(event.currentTarget);
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

  function CheckLoggedInAuth0(){getTokenSilently()
        .then(()=>{
          console.log("Auth0 works when the user is logged in")
        }).catch(()=>setAuth0works(false))
	}
  // useEffect(()=>{
  //   CheckLoggedInAuth0();
  // },[anchorForAPIs]);

  // const addUserToDatabase = async (dataString) => {
  //   try {
  //     await Axios({
  //       method: "POST",
  //       url: `${apiURL}/api/users`,
  //       data: dataString,
  //       auth: {
  //         username: apiUsername,
  //         password: apiPassword,
  //       },
  //       headers: {
  //         "content-type": "application/x-www-form-urlencoded;charset=utf-8",
  //       },
  //     }).then((response) => {
  //       if (response.data.return) {
  //         // user added
  //         dispatch({
  //           type: "UPDATE_ROLE",
  //           data: {
  //             userRole: "default"
  //           },
  //         });
  //       }
  //     });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };


  async function addUser(username) {
    const octokit = new Octokit({ auth: githubToken });
    return await octokit.request(
      "PUT /repos/{owner}/{repo}/collaborators/{username}",
      {
        owner: "precision-sustainable-ag",
        repo: "data_corrections",
        username: username,
        permission: "push",
      }
    );
  }

  useEffect(() => {
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
      dispatch({
        type: "UPDATING_USER_INFO",
      });
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
          //add to data corrections
          addUser(user.nickname).then((res) => console.log(res));
          // accept invite
          addToTechnicians(user.nickname, getTokenSilently);
        } else {
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
    if (user) {
      fetchRole(user);
    }
  }, [user, getTokenSilently, dispatch]);
  return (
    <div className={classes.root}>
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
          <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleOpenAPIMenu} color="inherit">
            <CheckCircleRounded/>
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorForAPIs}
            keepMounted
            open={Boolean(anchorForAPIs)}
            onClose={handleCloseAPIMenu}
          >
            <MenuItem>
            <Button onClick = {() => {CheckLoggedInAuth0()}}>
            {(auth0works)? (<CheckCircleRounded color="primary"/>):(<ErrorIcon color="primary"/>)}
            <Typography> Auth0 </Typography>
            </Button>
            </MenuItem>
            <Apistatus/>
          </Menu>
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
                <MenuItem
                  component={Link}
                  to={"/profile"}
                  onClick={handleProfileMenuClose}
                >
                  Profile
                </MenuItem>
                {debugAdmins.includes(state.userInfo.email) && (
                  <MenuItem
                    component={Link}
                    to={"/debug"}
                    onClick={handleProfileMenuClose}
                  >
                    Debug
                  </MenuItem>
                )}
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
            key={"timeline"}
            component={Link}
            to="/"
          >
            <ListItemIcon>
              <Icon>
                <RiTimeLine />
              </Icon>
            </ListItemIcon>
            <ListItemText primary={"Timeline"} />
          </ListItem>
          <ListItem
            onClick={() => setOpen(false)}
            button
            key={"protocols"}
            component={Link}
            to="/on-farm-protocols"
          >
            <ListItemIcon>
              <ListAlt />
            </ListItemIcon>
            <ListItemText primary={"Protocols"} />
          </ListItem>

          <ListItem
            onClick={() => setOpen(false)}
            button
            key={"Site Enrollment"}
            component={Link}
            to="/site-enroll"
          >
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary={"Site Enrollment"} />
          </ListItem>

          <ListItem
            button
            to="/producers"
            component={Link}
            onClick={() => {
              setOpen(false);
            }}
          >
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Producer Information" />
          </ListItem>
          <ListItem onClick={() => handleOpenAllDataNav()} button>
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary={"Site Information"} />
            {openAllDataNav ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openAllDataNav} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                to="/site-information/contact-enrollment"
                component={Link}
                onClick={() => {
                  setOpen(false);
                  handleOpenAllDataNav();
                }}
              >
                <ListItemText inset primary="Contact and Location" />
              </ListItem>

              <ListItem
                button
                to="/site-information/farm-dates"
                component={Link}
                onClick={() => {
                  setOpen(false);
                  handleOpenAllDataNav();
                }}
              >
                <ListItemText inset primary="Dates" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem
            onClick={() =>
              setOpenNav({ ...openNav, biomass: !openNav.biomass })
            }
            button
          >
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary={"Biomass"} />
            {openNav.biomass ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openNav.biomass} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                onClick={() => {
                  setOpenNav({ ...openNav, biomass: !openNav.biomass });
                  setOpen(false);
                }}
                button
                key={"Farm Values"}
                component={Link}
                to="/biomass/farm-values"
              >
                <ListItemText inset primary={"Farm Values"} />
              </ListItem>
            </List>
          </Collapse>
          <ListItem
            onClick={() => setOpen(false)}
            button
            key="DecompBags"
            component={Link}
            to="/decomp-bags"
          >
            <ListItemIcon>
              <Storage />
            </ListItemIcon>
            <ListItemText primary="Decomp Bags" />
          </ListItem>

          <ListItem
            onClick={() => {
              setOpenNav({ ...openNav, waterSensors: !openNav.waterSensors });
            }}
            button
            key={"WaterSensors"}
          >
            <ListItemIcon>
              <Icon>
                <RiSensorFill />
              </Icon>
            </ListItemIcon>
            <ListItemText primary={"Water Sensors"} />
            {openNav.waterSensors ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openNav.waterSensors} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {" "}
              <ListItem
                button
                to="/devices/water-sensors"
                component={Link}
                onClick={() => {
                  setOpen(false);
                  handleOpenDevicesNav();
                }}
              >
                <ListItemText inset primary="Device Status" />
              </ListItem>
              <ListItem
                button
                to="/sensor-visuals"
                component={Link}
                onClick={() => {
                  setOpen(false);
                  handleOpenDevicesNav();
                }}
              >
                <ListItemText inset primary="Chart View" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem
            onClick={() =>
              setOpenNav({ ...openNav, stressCams: !openNav.stressCams })
            }
            button
            key="stressCams"
          >
            <ListItemIcon>
              <Icon>
                <Info />
              </Icon>
            </ListItemIcon>
            <ListItemText primary={"Stress Cams"} />
            {openNav.stressCams ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openNav.stressCams} timeout="auto" unmountOnExit>
            <ListItem
              button
              to="/devices/stress-cams"
              component={Link}
              onClick={() => {
                setOpen(false);
                handleOpenDevicesNav();
              }}
            >
              <ListItemText inset primary="Device Status" />
            </ListItem>
          </Collapse>

          <ListItem
            onClick={() => setOpen(false)}
            button
            key={"Issues"}
            component={Link}
            to="/issues"
          >
            <ListItemIcon>
              <BugReport />
            </ListItemIcon>
            <ListItemText primary={"Issues"} />
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
        </List>
      </Drawer>
    </div>
  );
}

Header.propTypes = {
  setDarkTheme: PropTypes.func,
  isDarkTheme: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
};
