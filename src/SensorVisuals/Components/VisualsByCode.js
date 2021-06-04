import {
  Button,
  Chip,
  Grid,
  makeStyles,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { googleApiKey, onfarmAPI } from "../../utils/api_secret";
import PropTypes from "prop-types";
import { ArrowBackIos } from "@material-ui/icons";
import { Link, useHistory, useParams, useLocation } from "react-router-dom";
import { lazy, useContext, useEffect, useState } from "react";
import { Context } from "../../Store/Store";
import { CustomLoader } from "../../utils/CustomComponents";
import GatewayChart from "./GatewayChart";
import GoogleMapsReact from "google-map-react";
import styled from "styled-components";

// import NodeCharts from "./NodeCharts";

// import NodeVoltage from "./NodeVoltage";
// import VolumetricWater from "./VolumetricWater";
// import SoilTemp from "./SoilTemp";
// import TempByLbs from "./TempByLbs";

const StyledMarker = styled.div.attrs((/* props */) => ({ tabIndex: 0 }))`
  & {
    width: 100px;
    height: auto;
    padding: 2px;
    background-color: rgba(248, 208, 93, 0.5);
    margin: 0 auto;
    position: relative;
    transition: all 0.3s linear;
    box-shadow: 0 0 2px transparent;
    border-radius: 5px;
  }
  &:hover {
    background-color: rgba(248, 208, 93, 1);
    box-shadow: 0 0 2px black;

    z-index: 999;
  }
  &:after {
    border-right: solid 20px transparent;
    border-left: solid 20px transparent;
    border-top: solid 20px #f8d05d;
    transform: translateX(-50%);
    position: absolute;
    z-index: -1;
    content: "";
    top: 100%;
    left: 50%;
    height: 0;
    width: 0;
  }
`;

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

  const [sensorData, setSensorData] = useState([]);
  const [gatewayData, setGatewayData] = useState([]);
  const [nodeData, setNodeData] = useState([]);
  const [ambientSensorData, setAmbientSensorData] = useState([]);
  const [serials, setSerials] = useState({
    sensor: [],
    gateway: [],
    node: [],
    ambient: [],
  });

  const location = useLocation();

  const latLongEndpoint = onfarmAPI + `/locations?code=${code}&year=${year}`;

  const waterGatewayDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=gateway&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31`;

  const waterNodeDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=node&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31`;

  const getMapOptions = (maps) => ({
    streetViewControl: true,

    panControl: false,
    mapTypeControl: false,
    scrollwheel: false,
    fullscreenControl: false,
    styles: [
      {
        featureType: "poi.business",
        elementType: "labels",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
    ],
    // mapTypeControl: true,
    mapTypeId: maps.MapTypeId.SATELLITE,
    mapTypeControlOptions: {
      style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: maps.ControlPosition.TOP_RIGHT,
      mapTypeIds: [
        maps.MapTypeId.ROADMAP,
        maps.MapTypeId.SATELLITE,
        maps.MapTypeId.HYBRID,
        maps.MapTypeId.TERRAIN,
      ],
    },
  });

  useEffect(() => {
    const fetchData = async (apiKey) => {
      const setAllData = (response, type) => {
        const uniqueSerials = response
          .reduce((acc, curr) => {
            if (acc.includes(curr.serial)) {
              return acc;
            } else {
              let newAcc = acc;
              newAcc.push(curr.serial);
              return newAcc;
            }
          }, [])
          .sort((a, b) => a - b);
        switch (type) {
          case "sensor": {
            setSensorData(response);
            setSerials((serial) => ({ ...serial, sensor: uniqueSerials }));
            break;
          }
          case "node": {
            setNodeData(response);
            setSerials((serial) => ({ ...serial, node: uniqueSerials }));
            break;
          }
          case "gateway": {
            setGatewayData(response);
            setSerials((serial) => ({ ...serial, gateway: uniqueSerials }));
            break;
          }

          case "ambient": {
            setAmbientSensorData(response);
            setSerials((serial) => ({ ...serial, ambient: uniqueSerials }));
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
          console.log(latLongResponse);
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
        <Grid item xs={12} style={{ height: "400px" }}>
          <GoogleMapsReact
            bootstrapURLKeys={{
              key: googleApiKey,
              language: "EN",
              region: "US",
            }}
            // defaultCenter={center}
            center={[mapData.locationData[0].lat, mapData.locationData[0].lon]}
            zoom={mapData.zoom}
            options={getMapOptions}
          >
            {mapData.locationData.map((val) => (
              <Marker data={val} lat={val.lat} lng={val.lon} />
            ))}
          </GoogleMapsReact>
        </Grid>
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

const RenderNodeSerialChips = (props) => {
  const { serials, activeSerial, setActiveSerial } = props;

  return (
    <Grid item container spacing={2} justify="center" alignItems="center">
      {serials.node.map((serial, index) => (
        <Grid item key={index}>
          <Tooltip
            title={serials.ambient.includes(serial) ? "Ambient Sensor" : ""}
          >
            <Chip
              color={activeSerial === serial ? "primary" : "default"}
              label={serial}
              onClick={() => setActiveSerial(serial)}
            />
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );
};

const Marker = (props) => {
  const latLngStr = props.data.lat + "," + props.data.lon;
  return (
    <StyledMarker>
      <Typography align="center" variant="body1">
        Rep: {props.data.rep},{" "}
        {props.data.treatment.toLowerCase() === "b" ? `Bare` : `Cover`}
      </Typography>
      {/* <p>ProducerID: {props.data.producer_id}</p> */}
      <Typography align="center" variant="body1">
        <a
          href={`https://www.google.com/maps?saddr=My+Location&daddr=${latLngStr}&z=19&om=0`}
          target="_blank"
          rel="noreferrer"
        >
          Directions
        </a>
      </Typography>
    </StyledMarker>
  );
};

export default VisualsByCode;
