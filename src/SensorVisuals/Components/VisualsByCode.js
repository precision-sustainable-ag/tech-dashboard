import { Button, Grid, Typography } from "@material-ui/core";
import { onfarmAPI } from "../../utils/api_secret";

import { ArrowBackIos } from "@material-ui/icons";
import { Link, useHistory, useParams, useLocation } from "react-router-dom";
import { lazy, useContext, useEffect, useState } from "react";
import { Context } from "../../Store/Store";
import { CustomLoader } from "../../utils/CustomComponents";
import GatewayChart from "./GatewayChart";
import SensorMap from "../../utils/SensorMap";

const NodeVoltage = lazy(() => import("./NodeVoltage"));
const SoilTemp = lazy(() => import("./SoilTemp"));
const TempByLbs = lazy(() => import("./LitterbagTemp"));
const VolumetricWater = lazy(() => import("./VolumetricWater"));

const VisualsByCode = (props) => {
  const [state] = useContext(Context);
  const history = useHistory();
  const { code, year } = useParams();
  const [loading, setLoading] = useState(false);
  const [mapData, setMapData] = useState({
    open: false,
    locationData: [],
    zoom: 20,
  });

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

  const waterGatewayDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=gateway&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31`;

  const waterNodeDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=node&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31`;

  useEffect(() => {
    const fetchData = async (apiKey) => {
      const setAllData = (response, type) => {
        const uniqueSerials = response;
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
          case "sensor": {
            // setSensorData(response);
            // setSerials((serial) => ({ ...serial, sensor: uniqueSerials }));
            break;
          }
          case "node": {
            setNodeData(response);
            // setSerials((serial) => ({ ...serial, node: uniqueSerials }));
            break;
          }
          case "gateway": {
            setGatewayData(response);
            // setSerials((serial) => ({ ...serial, gateway: uniqueSerials }));
            break;
          }

          case "ambient": {
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
              "Content-Type": "application/json",
              "x-api-key": apiKey,
            },
          });
          const latLongData = await fetch(latLongEndpoint, {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
            },
          });
          const latLongResponse = await latLongData.json();

          setMapData((d) => ({ ...d, locationData: latLongResponse }));

          const gatewayResponse = await gatewayRecords.json();

          setAllData(gatewayResponse, "gateway");
          // if (gatewayResponse.length !== 0) {
          const nodeRecords = await fetch(waterNodeDataEndpoint, {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
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
          setAllData(nodeResponse, "node");
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
  ]);

  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item>
        <Button
          variant="contained"
          size="medium"
          onClick={() => {
            // history.goBack();
            history.push({
              pathname: "/sensor-visuals",
              state: {
                year: year,
                data: location.state.data,
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
        <Button
          variant="outlined"
          size="small"
          onClick={() => setMapData({ ...mapData, open: !mapData.open })}
        >
          {mapData.open ? `Hide` : `Show`} Map
        </Button>
      </Grid>
      {mapData.locationData.length > 0 && mapData.open && (
        <SensorMap mapData={mapData} />
      )}
      <Grid item xs={12}>
        {loading ? (
          <CustomLoader />
        ) : gatewayData.length === 0 ? (
          <Grid container style={{ minHeight: "20vh" }}>
            <Grid item xs={12}>
              <Typography variant="h6">
                No data available yet, have you installed sensors and filled out
                a koboform?
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
            {gatewayData.length > 0 && (
              <Grid item xs={12}>
                <GatewayChart data={gatewayData} />
              </Grid>
            )}
            {nodeData.length > 0 ? (
              <Grid item container spacing={4}>
                <Grid item container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5" align="center">
                      Node Voltage
                    </Typography>
                  </Grid>
                  <NodeVoltage />
                </Grid>
                <Grid item container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5" align="center">
                      VWC
                    </Typography>
                  </Grid>
                  <VolumetricWater />
                </Grid>
                <Grid item container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5" align="center">
                      Soil Temperature
                    </Typography>
                  </Grid>
                  <SoilTemp />
                </Grid>
                <Grid item container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5" align="center">
                      Litterbag Temperature
                    </Typography>
                  </Grid>
                  <TempByLbs />
                </Grid>
              </Grid>
            ) : (
              "Node data unavailable"
            )}

            <Grid item xs={12} container>
              {/* <RenderNodeSerialChips
                serials={serials}
                activeSerial={activeSerial}
                setActiveSerial={setActiveSerial}
              /> */}
            </Grid>
            <Grid item xs={12}></Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default VisualsByCode;
