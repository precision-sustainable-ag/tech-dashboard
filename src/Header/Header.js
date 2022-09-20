// Dependency Imports
import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { RiSensorFill, RiTimeLine } from 'react-icons/ri';
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
} from '@material-ui/core';
import { Link } from 'react-router-dom';
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
  OndemandVideo,
} from '@material-ui/icons';
import Axios from 'axios';
import PropTypes from 'prop-types';
import SwitchesGroup from './components/Switch/Switch';

// Local Imports
import { apiPassword, apiUsername, apiURL } from '../utils/api_secret';
// import { Context } from '../Store/Store';
import { useAuth0 } from '../Auth/react-auth0-spa';
import { callAzureFunction } from '../utils/SharedFunctions';
import { debugAdmins } from '../utils/constants';
import { setSnackbarData } from '../Store/actions';
import { updateRole, updateUserInfo, updatingUserInfo } from '../Store/actions';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowDropDownCircle } from '@material-ui/icons';
import styled from 'styled-components';

//Global Vars
const drawerWidth = 240;
const qs = require('qs');

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const MobileDropdown = styled.div`
  height: 150px;
  width: 250px;
  top: ${(width) => (width > 600 ? '60px' : '55px')};
  right: 15px;
  background: #2f7c31;
  z-index: 999;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-left: solid 3px white;
  border-bottom: solid 3px white;
  border-right: solid 3px white;
`;

// Default function
export default function Header(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const profileMenuOpen = Boolean(anchorEl);
  // const [state, dispatch] = useContext(Context);
  const dispatch = useDispatch();
  const isDarkTheme = useSelector((state) => state.userInfo.isDarkTheme);
  const userInfo = useSelector((state) => state.userInfo);
  const [viewType, setViewType] = useState('home');
  const width = useSelector((state) => state.appData.windowWidth);

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
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);

  const { getTokenSilently } = useAuth0();

  const handleOpenAllDataNav = () => {
    setOpenAllDataNav(!openAllDataNav);
  };
  const handleOpenDevicesNav = () => {
    setOpenDevicesNav(!openDevicesNav);
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
    setShowMobileDropdown(false);
    setAnchorEl(null);
  };

  const toggleThemeDarkness = () => {
    props.setDarkTheme();
  };

  // useEffect(() => {
  //   console.log(userInfo);
  // }, [userInfo]);

  useEffect(() => {
    const addUserToDatabase = async (dataString) => {
      try {
        await Axios({
          method: 'POST',
          url: `${apiURL}/api/users`,
          data: dataString,
          auth: {
            username: apiUsername,
            password: apiPassword,
          },
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        }).then((response) => {
          if (response.data.return) {
            // user added
            // dispatch({
            //   type: 'UPDATE_ROLE',
            //   data: {
            //     userRole: 'default',
            //   },
            // });
            dispatch(updateRole('default'));
          }
        });
      } catch (e) {
        console.error(e);
      }
    };
    const fetchRole = async (user) => {
      // dispatch({
      //   type: 'UPDATING_USER_INFO',
      // });
      dispatch(updatingUserInfo());

      await Axios.get(`${apiURL}/api/users/${user.email}/${viewType}`, {
        auth: {
          username: apiUsername,
          password: apiPassword,
        },
      }).then((response) => {
        let data = response.data;
        if (data.data === null && viewType === 'home') {
          //  user does not exist.. add record with default role
          let obj = {
            email: user.email,
          };

          addUserToDatabase(qs.stringify(obj));
        } else if (data.data === null && viewType === 'global') {
          dispatch(
            setSnackbarData({
              open: true,
              text: `No data available for global view`,
              severity: 'error',
            }),
          );
        } else {
          if (data.data.state !== 'default') {
            console.log('adding to technicians');
            callAzureFunction(
              null,
              `precision-sustainable-ag/teams/technicians/${user.nickname}`,
              'POST',
              getTokenSilently,
            ).then((res) => res.jsonResponse);
          }
          // dispatch({
          //   type: 'UPDATE_ROLE',
          //   data: {
          //     userRole: data.data.role,
          //   },
          // });
          dispatch(updateRole(data.data.role));

          // dispatch({
          //   type: 'UPDATE_USER_INFO',
          //   data: {
          //     userInfo: data.data,
          //   },
          // });
          dispatch(updateUserInfo(data.data));
          //update user details to state
        }
      });
    };
    if (user) {
      fetchRole(user);
    }
  }, [user, getTokenSilently, viewType, dispatch]);

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={`${classes.appBar} ${open && classes.appBarShift}`}
        color="primary"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={`${classes.menuButton} ${open && classes.hide}`}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title}>
            PSA Tech Dashboard
          </Typography>
          {width > 630 ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <SwitchesGroup setViewType={setViewType} />
              <IconButton color="inherit" onClick={toggleThemeDarkness}>
                {isDarkTheme ? <BrightnessLow /> : <BrightnessHigh />}
              </IconButton>
              {!props.isLoggedIn && (
                <IconButton
                  color="inherit"
                  onClick={() => loginWithRedirect({ redirect_uri: window.location.href })}
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
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={profileMenuOpen}
                    onClose={handleProfileMenuClose}
                  >
                    <MenuItem component={Link} to={'/profile'} onClick={handleProfileMenuClose}>
                      Profile
                    </MenuItem>
                    {debugAdmins.includes(userInfo?.email) && (
                      <MenuItem component={Link} to={'/debug'} onClick={handleProfileMenuClose}>
                        Debug
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => logout({ returnTo: window.location.origin })}>
                      Log Out
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          ) : (
            <div>
              <ArrowDropDownCircle
                onClick={() => setShowMobileDropdown(!showMobileDropdown)}
                style={{ transform: showMobileDropdown ? 'rotate(180deg)' : null }}
              />
              {showMobileDropdown && (
                <MobileDropdown width={width}>
                  <SwitchesGroup setViewType={setViewType} />
                  <div>
                    Change to {isDarkTheme ? 'light mode' : 'dark mode'}:
                    <IconButton color="inherit" onClick={toggleThemeDarkness}>
                      {isDarkTheme ? <BrightnessLow /> : <BrightnessHigh />}
                    </IconButton>
                  </div>
                  {!props.isLoggedIn && (
                    <IconButton
                      color="inherit"
                      onClick={() => loginWithRedirect({ redirect_uri: window.location.href })}
                    >
                      <Lock />
                    </IconButton>
                  )}
                  {props.isLoggedIn && (
                    <div>
                      Settings:
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
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={profileMenuOpen}
                        onClose={handleProfileMenuClose}
                      >
                        <MenuItem component={Link} to={'/profile'} onClick={handleProfileMenuClose}>
                          Profile
                        </MenuItem>
                        {debugAdmins.includes(userInfo?.email) && (
                          <MenuItem component={Link} to={'/debug'} onClick={handleProfileMenuClose}>
                            Debug
                          </MenuItem>
                        )}
                        <MenuItem onClick={() => logout({ returnTo: window.location.origin })}>
                          Log Out
                        </MenuItem>
                      </Menu>
                    </div>
                  )}
                </MobileDropdown>
              )}
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
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>

        <Divider />
        <List>
          <ListItem onClick={() => setOpen(false)} button key={'timeline'} component={Link} to="/">
            <ListItemIcon>
              <Icon>
                <RiTimeLine />
              </Icon>
            </ListItemIcon>
            <ListItemText primary={'Timeline'} />
          </ListItem>
          <ListItem
            onClick={() => setOpen(false)}
            button
            key={'protocols'}
            component={Link}
            to="/on-farm-protocols"
          >
            <ListItemIcon>
              <ListAlt />
            </ListItemIcon>
            <ListItemText primary={'Protocols'} />
          </ListItem>

          <ListItem
            onClick={() => setOpen(false)}
            button
            key={'Site Enrollment'}
            component={Link}
            to="/site-enroll"
          >
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary={'Site Enrollment'} />
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
            <ListItemText primary={'Site Information'} />
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
                to="/site-information/inactive-sites"
                component={Link}
                onClick={() => {
                  setOpen(false);
                  handleOpenAllDataNav();
                }}
              >
                <ListItemText inset primary="Inactive Sites" />
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
                <ListItemText inset primary="Dates - Table View" />
              </ListItem>

              <ListItem
                button
                to="/site-information/farm-dates/calendar"
                component={Link}
                onClick={() => {
                  setOpen(false);
                  handleOpenAllDataNav();
                }}
              >
                <ListItemText inset primary="Dates - Calendar View" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem onClick={() => setOpenNav({ ...openNav, biomass: !openNav.biomass })} button>
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary={'Biomass'} />
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
                key={'Farm Values'}
                component={Link}
                to="/biomass/farm-values"
              >
                <ListItemText inset primary={'Farm Values'} />
              </ListItem>
            </List>
          </Collapse>

          <ListItem onClick={() => setOpen(false)} button key="Yield" component={Link} to="/yield">
            <ListItemIcon>
              <Storage />
            </ListItemIcon>
            <ListItemText primary="Yield" />
          </ListItem>

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
            key={'WaterSensors'}
          >
            <ListItemIcon>
              <Icon>
                <RiSensorFill />
              </Icon>
            </ListItemIcon>
            <ListItemText primary={'Water Sensors'} />
            {openNav.waterSensors ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openNav.waterSensors} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {' '}
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
            onClick={() => setOpenNav({ ...openNav, stressCams: !openNav.stressCams })}
            button
            key="stressCams"
          >
            <ListItemIcon>
              <Icon>
                <Info />
              </Icon>
            </ListItemIcon>
            <ListItemText primary={'Stress Cams'} />
            {openNav.stressCams ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openNav.stressCams} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {' '}
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
              <ListItem
                button
                to="/stress-cam-visuals"
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
            onClick={() => setOpen(false)}
            button
            key={'Issues'}
            component={Link}
            to="/issues"
          >
            <ListItemIcon>
              <BugReport />
            </ListItemIcon>
            <ListItemText primary={'Issues'} />
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

          <ListItem
            onClick={() => setOpen(false)}
            button
            key="TaskTracker"
            component={Link}
            to="/task-tracker"
          >
            <ListItemIcon>
              <Storage />
            </ListItemIcon>
            <ListItemText primary="Task Tracker" />
          </ListItem>

          <ListItem
            onClick={() => setOpen(false)}
            button
            key="Weeds 3d Viewer"
            component={Link}
            to="/weeds-3d-viewer"
          >
            <ListItemIcon>
              <OndemandVideo />
            </ListItemIcon>
            <ListItemText primary="Weeds 3D Viewer" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

Header.propTypes = {
  setDarkTheme: PropTypes.func,
  isLoggedIn: PropTypes.bool,
};
