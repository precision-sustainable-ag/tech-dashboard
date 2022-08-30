import React, { useEffect, useState, Fragment } from 'react';
import { Button, Grid, Typography, Box, Tab } from '@material-ui/core';
import { TabList, TabContext } from '@material-ui/lab';
import { apiPassword, apiURL, apiUsername, onfarmAPI } from '../../../utils/api_secret';
import { ArrowBackIos } from '@material-ui/icons';
import { Link, useHistory, useParams, useLocation } from 'react-router-dom';
import { CustomLoader } from '../../../utils/CustomComponents';
import SensorMap from '../../../utils/SensorMap';
import { useAuth0 } from '../../../Auth/react-auth0-spa';

import IssueDialogue from '../../../Comments/components/IssueDialogue/IssueDialogue';
import TabCharts from '../TabCharts/TabCharts';
import { useSelector } from 'react-redux';

const nicknameURL = apiURL + `/api/hologram/device/nicknames/code`;

const VisualsByCode = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const history = useHistory();
  const { user } = useAuth0();
  const { code, year } = useParams();
  const [loading, setLoading] = useState(true);
  const [deviceLink, setDeviceLink] = useState('');
  const [mapData, setMapData] = useState({
    open: false,
    locationData: [],
    zoom: 20,
  });

  const [value, setValue] = useState('1');
  const [activeCharts, setActiveCharts] = useState('vwc');

  const { getTokenSilently } = useAuth0();

  const [gatewayData, setGatewayData] = useState([]);
  const [tdrData, setTdrData] = useState([]);
  const [nodeData, setNodeData] = useState([]);
  const [ambientData, setAmbientData] = useState([]);
  const [codeData, setCodeData] = useState({});
  const [loadingMessage, setLoadingMessage] = useState('Loading Tables');

  const location = useLocation();

  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const [issueBody, setIssueBody] = useState(null);

  const waterGatewayDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=gateway&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31&datetimes=unix`;

  const waterTdrDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=tdr&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31&datetimes=unix&cols=timestamp,serial,vwc,subplot,treatment,center_depth,soil_temp`;

  const waterNodeDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=node&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31&datetimes=unix`;

  const waterAmbientSensorDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=ambient&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31&datetimes=unix&cols=timestamp,subplot,treatment,t_lb`;

  const latLongEndpoint = onfarmAPI + `/locations?code=${code}&year=${year}`;

  const affiliationEndpoint = onfarmAPI + `/raw?table=site_information&code=${code}`;

  useEffect(() => {
    const checkDeviceNicknames = async (code) => {
      const response = await fetch(nicknameURL + `/${code.toUpperCase()}`, {
        headers: {
          Authorization: 'Basic ' + btoa(`${apiUsername}:${apiPassword}`),
        },
      });

      const records = await response.json();

      setDeviceLink(records.data.hologram_device_id);
    };

    if (code) checkDeviceNicknames(code);
  }, [code]);

  useEffect(() => {
    return () => {
      if (history.action === 'POP') {
        history.push({
          pathname: '/sensor-visuals',
          state: {
            year: year,
            data: location.state ? location.state.data : null,
          },
        });
      }
    };
  }, [history, location.state, year]);

  const reduceDataSize = (data) => {
    // const reducedArr = [];
    // if (data.length > 10000) {
    //   for (let i = 0; i < data.length; i += 10) {
    //     reducedArr.push(data[i]);
    //   }
    //   console.log(reducedArr.length);
    //   return reducedArr;
    // } else if (data.length > 2000) {
    //   for (let i = 0; i < data.length; i += 4) {
    //     reducedArr.push(data[i]);
    //   }
    //   console.log(reducedArr.length);
    //   return reducedArr;
    // } else {
    //   console.log(data.length);
      return data;
    // }
  };

  useEffect(() => {
    const fetchAndFormat = async (endpoint, sort) => {
      setLoadingMessage(Object.keys(endpoint)[0]);
      if (userInfo.apikey) {
        try {
          // fetch gateway data
          const sensorRecords = await fetch(endpoint, {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': userInfo.apikey,
            },
          });

          const sensorResponse = await sensorRecords.json();
          if (sort)
            return sensorResponse
              .sort((a, b) => a.timestamp - b.timestamp)
              .map((rec) => ({ ...rec, timestamp: rec.timestamp * 1000 }));
          else return sensorResponse;
        } catch (e) {
          throw new Error(e);
        }
      }
    };

    const fetchAllData = async () => {
      if (!userInfo.apikey) return;

      await Promise.all([
        fetchAndFormat(waterGatewayDataEndpoint, true).then((data) =>
          setGatewayData(reduceDataSize(data)),
        ),
        fetchAndFormat(waterTdrDataEndpoint, true).then((data) => {
          setIssueBody(data[data.length - 1]);
          setTdrData(reduceDataSize(data));
        }),
        fetchAndFormat(waterNodeDataEndpoint, true).then((data) =>
          setNodeData(reduceDataSize(data)),
        ),
        fetchAndFormat(waterAmbientSensorDataEndpoint, true).then((data) =>
          setAmbientData(reduceDataSize(data)),
        ),
        fetchAndFormat(latLongEndpoint, false).then((res) => setCodeData(res[0])),
        fetchAndFormat(affiliationEndpoint, false).then((res) =>
          setMapData((d) => ({ ...d, locationData: res })),
        ),
      ]);
    };

    setLoading(true);
    setLoadingMessage('Making API calls');
    fetchAllData().then(() => setLoading(false));

    return () => {
      setLoading(false);
    };
  }, [
    waterGatewayDataEndpoint,
    userInfo.apikey,
    waterNodeDataEndpoint,
    latLongEndpoint,
    waterTdrDataEndpoint,
    waterAmbientSensorDataEndpoint,
    affiliationEndpoint,
  ]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case '1':
        setActiveCharts('vwc');
        break;
      case '2':
        setActiveCharts('gateway');
        break;
      case '3':
        setActiveCharts('temp');
        break;
      default:
        break;
    }
  };

  return (
    <Fragment>
      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              history.push({
                pathname: '/sensor-visuals',
                state: {
                  year: year,
                  data: location.state ? location.state.data : null,
                },
              });
            }}
          >
            <ArrowBackIos />
            Back
          </Button>
        </Grid>
        <Grid item>
          <Typography variant="h5">Farm Code {code}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => setMapData({ ...mapData, open: !mapData.open })}
              >
                {mapData.open ? `Hide` : `Show`} Map
              </Button>
            </Grid>
            <Grid item>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => setShowIssueDialog(!showIssueDialog)}
              >
                {showIssueDialog ? 'Cancel' : 'Create comment'}
              </Button>
            </Grid>
            {deviceLink && (
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to={`/devices/${deviceLink}`}
                  size="small"
                >
                  Device status
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {showIssueDialog &&
            (issueBody ? (
              <IssueDialogue
                defaultText="Make sure to include treatment, rep, which sensor(s)/depth(s) are problematic; etc. Include as much detail as possible."
                nickname={user.nickname}
                rowData={JSON.stringify(issueBody, null, '\t')}
                dataType="json"
                labels={[code, 'tdr', 'water-sensor-visuals', codeData.affiliation, activeCharts]}
                getTokenSilently={getTokenSilently}
              />
            ) : (
              <Typography variant="h6">Waiting for data</Typography>
            ))}
        </Grid>
        {mapData.locationData.length > 0 && mapData.open && <SensorMap mapData={mapData} />}
        <Grid item xs={12}>
          {loading ? (
            <CustomLoader />
          ) : gatewayData.length === 0 &&
            nodeData.length === 0 &&
            ambientData.length === 0 &&
            tdrData.length === 0 ? (
            <Grid container style={{ minHeight: '20vh' }}>
              <Grid item xs={12}>
                <Typography variant="h6">
                  No data available yet, have you installed sensors and filled out a koboform?
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/kobo-forms"
                  size="small"
                >
                  psa water sensor install
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid item>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="VWC" value="1" />
                        <Tab label="Gateway and Node" value="2" />
                        <Tab label="Soil and Litterbag Temp" value="3" />
                      </TabList>
                    </Box>
                  </TabContext>
                </Box>
              </Grid>
              <TabCharts
                gatewayData={gatewayData}
                ambientData={ambientData}
                nodeData={nodeData}
                tdrData={tdrData}
                year={year}
                activeCharts={activeCharts}
                loadingMessage={loadingMessage}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default VisualsByCode;
