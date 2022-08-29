import React, { useEffect, useState, Fragment } from 'react';
import { Button, Grid, Typography, Box, Tab } from '@material-ui/core';
import { TabList, TabContext } from '@material-ui/lab';
import { apiPassword, apiURL, apiUsername, onfarmAPI } from '../../../utils/api_secret';
import { ArrowBackIos } from '@material-ui/icons';
import { Link, useHistory, useParams, useLocation } from 'react-router-dom';
import { CustomLoader } from '../../../utils/CustomComponents';
import SensorMap from '../../../utils/SensorMap';
import { useAuth0 } from '../../../Auth/react-auth0-spa';
import { useDispatch } from 'react-redux';
import { setIssueDialogData } from '../../../Store/actions';
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
  const dispatch = useDispatch();
  const issueDialogData = useSelector((state) => state.issueDialogData.issueDialogData);
  const [value, setValue] = useState('1');
  const [activeCharts, setActiveCharts] = useState('vwc');

  //const { getTokenSilently } = useAuth0();

  const [gatewayData, setGatewayData] = useState([]);
  const [tdrData, setTdrData] = useState([]);
  const [nodeData, setNodeData] = useState([]);
  const [ambientData, setAmbientData] = useState([]);
  const [codeData, setCodeData] = useState({});

  const location = useLocation();

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

  useEffect(() => {
    const fetchAndFormat = async (endpoint, sort) => {
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
        fetchAndFormat(waterGatewayDataEndpoint, true).then((data) => setGatewayData(data)),
        fetchAndFormat(waterTdrDataEndpoint, true).then((data) => {
          setIssueBody(data[data.length - 1]);
          setTdrData(data);
        }),
        fetchAndFormat(waterNodeDataEndpoint, true).then((data) => setNodeData(data)),
        fetchAndFormat(waterAmbientSensorDataEndpoint, true).then((data) => setAmbientData(data)),
        fetchAndFormat(latLongEndpoint, false).then((res) => setCodeData(res[0])),
        fetchAndFormat(affiliationEndpoint, false).then((res) =>
          setMapData((d) => ({ ...d, locationData: res })),
        ),
      ]);
    };

    setLoading(true);
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
                onClick={() => {
                  dispatch(
                    setIssueDialogData({
                      nickname: user.nickname,
                      dataType: 'json',
                      defaultText:
                        'Make sure to include treatment, rep, which sensor(s)/depth(s) are problematic; etc. Include as much detail as possible.',
                      setShowNewIssueDialog: true,
                    }),
                  );
                }}
              >
                {'Create comment'}
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
          {issueDialogData.setShowNewIssueDialog &&
            (issueBody ? (
              <IssueDialogue
                rowData={JSON.stringify(issueBody, null, '\t')}
                labels={[code, 'tdr', 'water-sensor-visuals', codeData.affiliation, activeCharts]}
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
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default VisualsByCode;
