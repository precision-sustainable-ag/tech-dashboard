import React from 'react';
import { Button, Grid, Typography, Snackbar, Box, Tab } from '@material-ui/core';
import { TabList, TabContext } from '@material-ui/lab';
import { apiPassword, apiURL, apiUsername, onfarmAPI } from '../../utils/api_secret';
import { ArrowBackIos } from '@material-ui/icons';
import { Link, useHistory, useParams, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState, Fragment } from 'react';
import { Context } from '../../Store/Store';
import { CustomLoader } from '../../utils/CustomComponents';
// import GatewayChart from "./GatewayChart";
import SensorMap from '../../utils/SensorMap';
import MuiAlert from '@material-ui/lab/Alert';
import { useAuth0 } from '../../Auth/react-auth0-spa';

import IssueDialogue from '../../Comments/IssueDialogue';
import TabCharts from './TabCharts';

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const nicknameURL = apiURL + `/api/hologram/device/nicknames/code`;

const VisualsByCode = () => {
  const [state] = useContext(Context);
  const history = useHistory();
  const { user } = useAuth0();
  const { code, year } = useParams();
  const [loading, setLoading] = useState(false);
  const [deviceLink, setDeviceLink] = useState('');
  const [mapData, setMapData] = useState({
    open: false,
    locationData: [],
    zoom: 20,
  });

  const [tdrData, setTdrData] = useState([]);
  const [value, setValue] = useState('1');
  const [activeCharts, setActiveCharts] = useState('gateway');

  const { getTokenSilently } = useAuth0();

  // const [sensorData, setSensorData] = useState([]);
  const [gatewayData, setGatewayData] = useState([]);
  const [nodeData, setNodeData] = useState([]);
  // const [ambientSensorData, setAmbientSensorData] = useState([]);
  // const [serials, setSerials] = useState({
  //   sensor: [],
  //   gateway: [],
  //   node: [],
  //   ambient: [],
  // });

  const location = useLocation();

  const latLongEndpoint = onfarmAPI + `/locations?code=${code}&year=${year}`;
  const waterSensorDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=tdr&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31&datetimes=unix&cols=timestamp,vwc,subplot,trt,center_depth,soil_temp&location=true`;
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: '',
    severity: 'success',
  });
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const [issueBody, setIssueBody] = useState(null);

  const waterGatewayDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=gateway&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31`;

  const waterNodeDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=node&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31`;

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
    const fetchData = async (apiKey) => {
      console.log('fetching data');
      const setAllData = (response, type) => {
        // const uniqueSerials = response;
        // .reduce((acc, curr) => {
        //   if (acc.includes(curr.serial)) {
        //     return acc;
        //   } else {
        //     let newAcc = acc;
        //     newAcc.push(curr.serial);
        //     return newAcc;
        //   }
        // }, [])
        // .sort((a, b) => a - b);
        switch (type) {
          case 'sensor': {
            // setSensorData(response);
            // setSerials((serial) => ({ ...serial, sensor: uniqueSerials }));
            break;
          }
          case 'node': {
            setNodeData(response);
            // setSerials((serial) => ({ ...serial, node: uniqueSerials }));
            break;
          }
          case 'gateway': {
            setGatewayData(response);
            // setSerials((serial) => ({ ...serial, gateway: uniqueSerials }));
            break;
          }

          case 'ambient': {
            // setAmbientSensorData(response);
            // setSerials((serial) => ({ ...serial, ambient: uniqueSerials }));
            break;
          }
          default:
            break;
        }
      };

      setLoading(true);

      if (apiKey) {
        try {
          const gatewayRecords = await fetch(waterGatewayDataEndpoint, {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
            },
          });
          const latLongData = await fetch(latLongEndpoint, {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
            },
          });
          const tdrDataFromApi = await fetch(waterSensorDataEndpoint, {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
            },
          });
          const latLongResponse = await latLongData.json();

          setMapData((d) => ({ ...d, locationData: latLongResponse }));

          const gatewayResponse = await gatewayRecords.json();

          const tdrDataRecords = await tdrDataFromApi.json();

          setIssueBody(tdrDataRecords[tdrDataRecords.length - 1]);

          const sortedByTimestamp = tdrDataRecords
            .sort((a, b) => a - b)
            .map((rec) => ({ ...rec, timestamp: rec.timestamp * 1000 }));

          setTdrData(sortedByTimestamp);

          setAllData(gatewayResponse, 'gateway');
          // if (gatewayResponse.length !== 0) {
          const nodeRecords = await fetch(waterNodeDataEndpoint, {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
            },
          });
          // const ambientRecords = await fetch(waterAmbientSensorDataEndpoint, {
          //   headers: {
          //     "Content-Type": "application/json",
          //     "x-api-key": apiKey,
          //   },
          // });
          // const waterSensorRecords = await fetch(waterSensorDataEndpoint, {
          //   headers: {
          //     "Content-Type": "application/json",
          //     "x-api-key": apiKey,
          //   },
          // });
          const nodeResponse = await nodeRecords.json();
          // const ambientResponse = await ambientRecords.json();
          // const waterSensorResponse = await waterSensorRecords.json();
          setAllData(nodeResponse, 'node');
          // setAllData(ambientResponse, "ambient");
          // setAllData(waterSensorResponse, "sensor");
          // }
        } catch (e) {
          // console.error("Error:" + e);

          throw new Error(e);
        }
      }
      setLoading(false);
    };

    fetchData(state.userInfo.apikey);
    return () => {
      setLoading(false);
    };
  }, [
    waterGatewayDataEndpoint,
    state.userInfo.apikey,
    waterNodeDataEndpoint,
    latLongEndpoint,
    waterSensorDataEndpoint,
  ]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case '1':
        // setData(validData);
        // setFormType("valid");
        setActiveCharts('gateway');
        break;
      case '2':
        // setData(invalidData);
        // setFormType("invalid");
        setActiveCharts('vwc');
        break;
      case '3':
        // setData(historyData);
        // setFormType("history");
        setActiveCharts('temp');
        break;
      default:
        break;
    }
  };

  return (
    <Fragment>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackbarData.open}
        autoHideDuration={2000}
        onClose={() => setSnackbarData({ ...snackbarData, open: !snackbarData.open })}
      >
        <Alert severity={snackbarData.severity}>{snackbarData.text}</Alert>
      </Snackbar>
      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <Button
            variant="contained"
            size="medium"
            onClick={() => {
              // history.goBack();
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
                nickname={user.nickname}
                rowData={JSON.stringify(issueBody, null, '\t')}
                dataType="json"
                setSnackbarData={setSnackbarData}
                labels={[code, 'tdr', 'water-sensor-visuals']}
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
          ) : gatewayData.length === 0 && nodeData.length === 0 ? (
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
                        <Tab label="Gateway and Node" value="1" />
                        <Tab label="VWC" value="2" />
                        <Tab label="Soil and Litterbag Temp" value="3" />
                      </TabList>
                    </Box>
                  </TabContext>
                </Box>
              </Grid>
              <TabCharts
                value={value}
                handleChange={handleChange}
                gatewayData={gatewayData}
                activeCharts={activeCharts}
                nodeData={nodeData}
                tdrData={tdrData}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default VisualsByCode;
