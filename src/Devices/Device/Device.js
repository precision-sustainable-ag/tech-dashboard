// Dependency Imports
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
// import { Map, Marker, Popup, TileLayer } from "react-leaflet";
// import Skeleton from "@material-ui/lab/Skeleton";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';

import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light';
import dark from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark';
import DateFnsUtils from '@date-io/date-fns';
import qs from 'qs';
import {
  makeStyles,
  ListItem,
  ListItemIcon,
  List,
  ListItemText,
  Chip,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Grid,
  TableBody,
  withStyles,
  Typography,
  Fab,
  Button,
  Tooltip,
  useTheme,
} from '@material-ui/core';
import {
  NetworkCell,
  Router,
  ArrowBackIosOutlined,
  KeyboardArrowUp,
  CalendarToday,
  Timeline,
} from '@material-ui/icons';
import moment from 'moment-timezone';
import { Link, useHistory, useParams } from 'react-router-dom';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

// Local Imports
import { apiUsername, apiPassword } from '../../utils/api_secret';
import { APIURL, apiCorsUrl } from '../hologramConstants';

import { ScrollTop, useInfiniteScroll } from '../../utils/CustomComponents';
import Loading from 'react-loading';
import StressCamButtons from './StressCamButtons';
import { checkIfDeviceHasNickname } from '../../utils/constants';
import { bool, any } from 'prop-types';

// import { theme } from "highcharts";

SyntaxHighlighter.registerLanguage('json', json);

// Styles
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    height: 300,
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },

  paper: {
    // padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

// Default function
const DeviceComponent = (props) => {
  const { deviceId } = useParams();
  const { palette } = useTheme();
  const history = useHistory();
  const activeTag = history.location.state ? history.location.state.activeTag : 'all';
  const classes = useStyles();
  const [deviceData, setDeviceData] = useState({ name: '' });
  const [mostRecentData, setMostRecentData] = useState([]);
  const [userTimezone, setUserTimezone] = useState('America/New_York');
  const [pagesLoaded, setPagesLoaded] = useState(0);
  const [loadMoreDataURI, setLoadMoreDataURI] = useState('');
  const [timeEnd, setTimeEnd] = useState(Math.floor(Date.now() / 1000));
  const [hologramApiFunctional, setHologramApiFunctional] = useState(true);
  const [fetchMessage, setFetchMessage] = useState('');
  const [deviceName, setDeviceName] = useState(
    props.history.location.state ? props.history.location.state.name : '',
  );
  const [chartRedirectYear, setChartRedirectYear] = useState(0);
  const [siteCode, setSiteCode] = useState('');

  useEffect(() => {
    if (mostRecentData.length > 0) {
      const latestDataYear = new Date(JSON.parse(mostRecentData[0].data).received).getFullYear();
      setChartRedirectYear(latestDataYear);
    }
  }, [mostRecentData]);

  useEffect(() => {
    if (deviceName) {
      if (deviceName.match(/\w{0,3}[A-Z]\w\s/)) {
        const code = deviceName.split(' ')[0];
        setSiteCode(code);
      }
    }
  }, [deviceName]);

  useEffect(() => {
    // fetch nickname for device
    checkIfDeviceHasNickname(deviceId)
      .then((res) => {
        if (res.data.status === 'success') {
          if (typeof res.data.data !== 'object') {
            // no device nickname found
            setDeviceName(deviceId);
          } else {
            setDeviceName(res.data.data.nickname);
          }
        } else {
          setDeviceName(deviceId);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, [deviceId]);

  useEffect(() => {
    return () => {
      if (history.action === 'POP') {
        history.push({
          pathname: props.location.state
            ? props.location.state.for === 'watersensors'
              ? '/devices/water-sensors'
              : '/devices/stress-cams'
            : '/devices/water-sensors',
          state: {
            activeTag: activeTag,
          },
        });
      }
    };
  }, [history, activeTag, props.location.state]);

  useEffect(() => {
    setUserTimezone(moment.tz.guess);
    if (props.location.state === undefined) {
      // get data from api
      setDeviceData({ name: 'Loading' });
      setIsFetching(true);
      Axios({
        method: 'post',
        url: apiCorsUrl + `/watersensors`,
        data: qs.stringify({
          url: `${APIURL()}/api/1/csr/rdm?deviceid=${deviceId}&withlocation=true&timeend=${timeEnd}`,
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
          setIsFetching(false);
          setMostRecentData(response.data.data);
          if (response.data.continues) {
            setLoadMoreDataURI(response.data.links.next);
            setPagesLoaded((pagesLoaded) => pagesLoaded + 1);
          }
        })
        .catch((e) => {
          console.error(e);
          setIsFetching(false);
        });
    } else {
      // data passed from component via prop
      setDeviceData(props.location.state);
      setIsFetching(true);
      Axios({
        method: 'post',
        url: apiCorsUrl + `/${props.location.state.for}`,
        data: qs.stringify({
          url: `${APIURL()}/api/1/csr/rdm?deviceid=${
            props.location.state.id
          }&withlocation=true&timeend=${timeEnd}`,
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
          setIsFetching(false);
          setMostRecentData(response.data.data);
          if (response.data.continues) {
            setLoadMoreDataURI(response.data.links.next);
            setPagesLoaded((pagesLoaded) => pagesLoaded + 1);
          }
        })
        .catch((e) => {
          console.error(e);
          setIsFetching(false);
        });
    }
    return () => {
      // clean up the previous state before next re-render
      setMostRecentData({});
    };
  }, [timeEnd, deviceId, props.location.state]);

  const RenderGridListMap = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color={props.isDarkTheme ? 'primary' : 'default'}
            aria-label={`All Devices`}
            component={Link}
            tooltip="All Devices"
            to={{
              pathname:
                props.location.state && props.location.state.for
                  ? props.location.state.for === 'watersensors'
                    ? '/devices/water-sensors'
                    : '/devices/stress-cams'
                  : '/devices',
              state: {
                activeTag:
                  history.location.state && history.location.state.activeTag
                    ? history.location.state.activeTag
                    : 'All',
              },
            }}
            startIcon={<ArrowBackIosOutlined />}
          >
            All Devices
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" color={palette.type === 'dark' ? 'primary' : 'secondary'}>
            Showing data for {deviceName}
          </Typography>
        </Grid>
        {/* <Grid item xs={12}>
          <div style={{ height: "350px" }}>
            {state.lastsession ? (
              <GoogleMap
                lat={latLng.data[0]}
                lng={latLng.data[1]}
                from={"device"}
              />
            ) : (
              <GoogleMap from={"device"} />
            )}
          </div>
        </Grid> */}
      </Grid>
    );
  };

  //TODO: Auto Reload data
  // const [timer, setTimer] = useState(0);

  // const interval = useAutoRefresh(() => {
  //   setTimer(timer + 1);
  // }, 1000);

  // useEffect(() => {
  //   console.log(timer);
  // }, [timer]);

  const RenderDataTable = () => {
    return (
      <TableContainer component={Paper} className={classes.paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>SNo</StyledTableCell>
              <StyledTableCell>Data</StyledTableCell>
              {/* <StyledTableCell>Tags</StyledTableCell> */}
              <StyledTableCell>Time Stamp</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mostRecentData.length > 0 ? (
              mostRecentData.map((data, index) => (
                <StyledTableRow key={`row-${index}`}>
                  <TableCell>{index + 1}</TableCell>
                  {props.location.state ? (
                    <TableCell>
                      {props.location.state.for !== 'watersensors' ? (
                        isBase64(
                          getDataFromJSON(data.data, 'dataString', props.location.state.for),
                        ) ? (
                          <Tooltip
                            title={
                              <code style={{ minHeight: '50px', width: '300px' }}>
                                {atob(
                                  getDataFromJSON(
                                    data.data,
                                    'dataString',
                                    props.location.state.for,
                                  ),
                                )}
                              </code>
                            }
                          >
                            <code>
                              {getDataFromJSON(data.data, 'dataString', props.location.state.for)}
                            </code>
                          </Tooltip>
                        ) : (
                          <SyntaxHighlighter
                            language="json"
                            style={props.isDarkTheme ? dark : docco}
                          >
                            {getDataFromJSON(data.data, 'dataString', props.location.state.for)}
                          </SyntaxHighlighter>
                        )
                      ) : (
                        <code>
                          {getDataFromJSON(data.data, 'dataString', props.location.state.for)}
                        </code>
                      )}
                    </TableCell>
                  ) : (
                    <TableCell>
                      <code>{getDataFromJSON(data.data, 'dataString', 'watersensors')}</code>
                    </TableCell>
                  )}

                  <TableCell datatype="">
                    {getDataFromJSON(
                      data.data,
                      'timestamp',
                      props.location.state ? props.location.state.for : 'watersensors',
                    )}
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body1">
                    {isFetching ? `Fetching Data` : `No Data`}
                  </Typography>
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const getDataFromJSON = (jsonData, type, sensorType) => {
    jsonData = JSON.parse(jsonData);

    let dataStringParsed =
      sensorType === 'watersensors' && isBase64(jsonData.data)
        ? atob(jsonData.data)
        : isValidJson(jsonData.data)
        ? JSON.stringify(JSON.parse(jsonData.data), null, 2)
        : jsonData.data;
    switch (type) {
      case 'dataString':
        return dataStringParsed;
      case 'tags':
        return <RenderTags chipsArray={jsonData.tags} />;
      case 'timestamp':
        return moment
          .tz(jsonData.received, 'UTC')
          .tz(userTimezone)
          .format('dddd, MMMM Do YYYY, h:mm:ss A');
      default:
        return '';
    }
  };
  const RenderTags = ({ chipsArray }) => {
    let chips = chipsArray;

    return chips.map((chip, index) => (
      <Chip key={`chip${index}`} style={{ marginRight: '1em', marginBottom: '1em' }} label={chip} />
    ));
  };

  const DateProvider = () => {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          disableFuture
          autoOk
          label="Show records from"
          format="MM/dd/yyyy"
          value={moment.unix(timeEnd)}
          onChange={(date) => {
            setTimeEnd(moment(date).unix());
          }}
          animateYearScrolling
        />
      </MuiPickersUtilsProvider>
    );
  };

  const RenderGridListData = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <List>
            <ListItem alignItems="center" key="last-date">
              <ListItemIcon>
                <CalendarToday />
              </ListItemIcon>
              <ListItemText primary={<DateProvider />} />
            </ListItem>
          </List>
        </Grid>

        {deviceData.links && deviceData.links.cellular && (
          <Grid item xs={12} md={4}>
            <List>
              <ListItem alignItems="center" key="lastconnect">
                <ListItemIcon>
                  <Router />
                </ListItemIcon>
                <ListItemText
                  primary={'Last Connection'}
                  secondary={moment
                    .tz(deviceData.links.cellular[0].last_connect_time, 'UTC')
                    .tz(userTimezone)
                    .format('MM/DD/YYYY hh:mm A')
                    .toString()}
                />
              </ListItem>
            </List>
          </Grid>
        )}
        {deviceData.links && deviceData.links.cellular && (
          <Grid item xs={12} md={4}>
            <List>
              <ListItem alignItems="center" key="network">
                <ListItemIcon>
                  <NetworkCell />
                </ListItemIcon>
                <ListItemText
                  primary={'Network'}
                  secondary={deviceData.links.cellular[0].last_network_used}
                />
              </ListItem>
            </List>
          </Grid>
        )}

        {props.location.state ? (
          props.location.state.for !== 'watersensors' ? (
            <StressCamButtons deviceId={props.history.location.state.id} />
          ) : (
            ''
          )
        ) : (
          ''
        )}
        {siteCode &&
          chartRedirectYear !== 0 &&
          (props.location.state ? props.location.state.for === 'watersensors' : true) && (
            <Grid item xs={12}>
              <Button
                size={'small'}
                component={Link}
                startIcon={<Timeline />}
                to={{
                  pathname: `/sensor-visuals/${chartRedirectYear}/${siteCode}`,
                  state: {
                    activeTag: activeTag,
                  },
                }}
              >
                Chart view
              </Button>
            </Grid>
          )}

        <Grid item xs={12}>
          <RenderDataTable />
        </Grid>
        {isFetching && (
          <Grid item xs={12}>
            <Grid container justifyContent="center" alignItems="center" spacing={3}>
              {hologramApiFunctional && (
                <Grid item>
                  <Loading
                    className="scrollLoadingSpinner"
                    width={50}
                    height={50}
                    type="spinningBubbles"
                    color="#2d2d2d"
                  />
                </Grid>
              )}
              <Grid item>
                <Typography variant="h5">{fetchMessage}</Typography>
              </Grid>
              {!hologramApiFunctional && (
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => {
                      fetchedCount = 0;
                      setHologramApiFunctional(true);
                      fetchMoreData();
                    }}
                  >
                    Fetch more data
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  };

  let fetchedCount = 0;
  const fetchMoreData = async () => {
    if (loadMoreDataURI) {
      setFetchMessage('Fetching message ' + (pagesLoaded + 1));
      await Axios({
        method: 'post',
        url: apiCorsUrl + `/${props.location.state ? props.location.state.for : 'watersensors'}`,
        data: qs.stringify({
          url: `${APIURL()}${loadMoreDataURI}`,
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
          // console.log(response);
          let deviceDataShadow = mostRecentData || [];
          deviceDataShadow.push(response.data.data);

          let devicesFlatData = deviceDataShadow.flat();
          setMostRecentData(devicesFlatData);
          if (response.data.continues) {
            setLoadMoreDataURI(response.data.links.next);
            setPagesLoaded(pagesLoaded + 1);
          } else {
            setLoadMoreDataURI('');
          }
          setIsFetching(false);
        })
        .catch(() => {
          if (fetchedCount < 5) {
            fetchedCount++;
            setFetchMessage('Fetch failed, retrying ' + fetchedCount + ' of 5 times');
            fetchMoreData();
          } else {
            fetchedCount = 0;
            setIsFetching(false);
            setHologramApiFunctional(false);
            setFetchMessage('Could not fetch more data');
          }
        });
    } else {
      return false;
    }
  };
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreData, hologramApiFunctional);

  return (
    <div>
      <RenderGridListMap />
      <RenderGridListData />
      <ScrollTop {...props}>
        <Fab color={`primary`} size="medium" aria-label="scroll back to top">
          <KeyboardArrowUp />
        </Fab>
      </ScrollTop>
    </div>
  );
};

// const LoadingSkeleton = () => {
//   <Grid container spacing={4}>
//     <Grid item xs={12}>
//       <Skeleton variant="rect" width="100%" height="300px" animation="wave" />
//     </Grid>
//     <Grid item xs={12}>
//       <Skeleton variant="rect" width="100%" height="50vh" animation="pulse" />
//     </Grid>
//   </Grid>;
// };

const isValidJson = (json) => {
  if (!(json && typeof json === 'string')) {
    return false;
  }

  try {
    JSON.parse(json);
    return true;
  } catch (error) {
    return false;
  }
};

const isBase64 = (str = '') => {
  const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

  return base64regex.test(str);
};
export default DeviceComponent;

DeviceComponent.propTypes = {
  location: any,
  isDarkTheme: bool,
  history: any,
};
