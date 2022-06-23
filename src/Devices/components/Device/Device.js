// Dependency Imports
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import qs from 'qs';
import { Grid, Typography, Fab, Button } from '@material-ui/core';
import { ArrowBackIosOutlined, KeyboardArrowUp, Timeline } from '@material-ui/icons';
import moment from 'moment-timezone';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Local Imports
import { apiUsername, apiPassword } from '../../../utils/api_secret';
import { APIURL, apiCorsUrl } from '../../shared/hologramConstants';
import { ScrollTop, useInfiniteScroll } from '../../../utils/CustomComponents';
import Loading from 'react-loading';
import StressCamButtons from '../StressCamButtons/StressCamButtons';
import { checkIfDeviceHasNickname } from '../../../utils/constants';
import PropTypes from 'prop-types';
import { DeviceInfo } from '../DeviceInfo/DeviceInfo';
import { DeviceData } from '../DeviceData/DeviceData';
import { setDeviceData, setMostRecentData, setUserTimezone } from '../../../Store/actions';

SyntaxHighlighter.registerLanguage('json', json);

const DeviceComponent = (props) => {
  const { deviceId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const activeTag = history.location.state ? history.location.state.activeTag : 'all';
  // const [deviceData, setDeviceData] = useState({ name: '' });
  // const [mostRecentData, setMostRecentData] = useState([]);
  const mostRecentData = useSelector((state) => state.devicesData.mostRecentData);
  // const userTimezone = useSelector((state) => state.devicesData.userTimezone);
  // const [userTimezone, setUserTimezone] = useState('America/New_York');
  const [pagesLoaded, setPagesLoaded] = useState(0);
  const [loadMoreDataURI, setLoadMoreDataURI] = useState('');
  // const [timeEnd, setTimeEnd] = useState(Math.floor(Date.now() / 1000));
  const timeEnd = useSelector((state) => state.devicesData.timeEnd);
  const [hologramApiFunctional, setHologramApiFunctional] = useState(true);
  const [fetchMessage, setFetchMessage] = useState('');
  const [deviceName, setDeviceName] = useState(
    props.history.location.state ? props.history.location.state.name : '',
  );
  const [chartRedirectYear, setChartRedirectYear] = useState(0);
  const [siteCode, setSiteCode] = useState('');

  // const [state] = useContext(Context);
  const isDarkTheme = useSelector((state) => state.userInfo.isDarkTheme);

  useEffect(() => {
    if (mostRecentData.length > 0) {
      const latestDataYear = new Date(JSON.parse(mostRecentData[0].data).received).getFullYear();
      setChartRedirectYear(latestDataYear);
    }
  }, [mostRecentData]);

  useEffect(() => {
    if (deviceName) {
      const match = /[A-Z]{2}[A-Z0-9]/.exec(deviceName);
      if (match) {
        const code = deviceName.substring(match.index, match.index + 3);
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
    dispatch(setUserTimezone(moment.tz.guess()));
    if (props.location.state === undefined) {
      // get data from api
      dispatch(setDeviceData({ name: 'Loading' }));
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
          dispatch(setMostRecentData(response.data.data));
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
      dispatch(setDeviceData(props.location.state));
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
          dispatch(setMostRecentData(response.data.data));
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
      dispatch(setMostRecentData({}));
    };
  }, [timeEnd, deviceId, props.location.state]);

  const RenderGridListMap = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color={isDarkTheme ? 'primary' : 'default'}
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

  const RenderGridListData = () => {
    return (
      <Grid container spacing={3}>
        <DeviceInfo
          // timeEnd={timeEnd}
          // setTimeEnd={setTimeEnd}
          deviceName={deviceName}
          // deviceData={deviceData}
          // userTimezone={userTimezone}
        />

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
          <DeviceData
            location={props.location.state}
            // mostRecentData={mostRecentData}
            // userTimezone={userTimezone}
            isFetching={isFetching}
          />
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
          dispatch(setMostRecentData(devicesFlatData));
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

export default DeviceComponent;

DeviceComponent.propTypes = {
  location: PropTypes.any,
  history: PropTypes.any,
};
