import {
  Button,
  Chip,
  Grid,
  makeStyles,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { onfarmAPI } from "../../utils/api_secret";
import PropTypes from "prop-types";
import { ArrowBackIos } from "@material-ui/icons";
import { Link, useHistory, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../Store/Store";
import { CustomLoader } from "../../utils/CustomComponents";
import GatewayChart from "./GatewayChart";
import NodeCharts from "./NodeCharts";

const VisualsByCode = () => {
  const [state] = useContext(Context);
  const history = useHistory();
  const { code, year } = useParams();
  const [loading, setLoading] = useState(false);

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
  const [activeSerial, setActiveSerial] = useState("");
  const [activeSubplot, setActiveSubplot] = useState("");

  const waterSensorDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=tdr&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31`;

  const waterGatewayDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=gateway&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31`;

  const waterNodeDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=node&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31`;

  const waterAmbientSensorDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=ambient&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31`;

  const waterSensorInstallEndpoint =
    onfarmAPI + `/raw?table=wsensor_install&code=${code.toLowerCase()}`;

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
          const latlongData = await fetch(waterSensorInstallEndpoint, {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
            },
          });
          const latlongResponse = await latlongData.json();

          const gatewayResponse = await gatewayRecords.json();

          setAllData(gatewayResponse, "gateway");
          if (gatewayResponse.length !== 0) {
            const nodeRecords = await fetch(waterNodeDataEndpoint, {
              headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
              },
            });
            const ambientRecords = await fetch(waterAmbientSensorDataEndpoint, {
              headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
              },
            });
            const waterSensorRecords = await fetch(waterSensorDataEndpoint, {
              headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
              },
            });
            const nodeResponse = await nodeRecords.json();
            const ambientResponse = await ambientRecords.json();
            const waterSensorResponse = await waterSensorRecords.json();
            setAllData(nodeResponse, "node");
            setAllData(ambientResponse, "ambient");
            setAllData(waterSensorResponse, "sensor");
          }
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
    state.userInfo.apikey,
    waterGatewayDataEndpoint,
    waterAmbientSensorDataEndpoint,
    waterNodeDataEndpoint,
    waterSensorDataEndpoint,
  ]);

  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item>
        <Button
          variant="contained"
          size="medium"
          onClick={() => {
            history.goBack();
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
        {loading ? (
          <CustomLoader />
        ) : gatewayData.length === 0 && nodeData.length === 0 ? (
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
            <Grid item xs={12} container>
              {/* <RenderNodeSerialChips
                serials={serials}
                activeSerial={activeSerial}
                setActiveSerial={setActiveSerial}
              /> */}
            </Grid>
            <Grid item xs={12}>
              {/* Sensor data = 
bare_lat: 32.2849311828613
bare_lon: -81.8633804321289
center_depth: -15
code: "VMF"
cover_lat: 32.2848968505859
cover_lon: -81.8632507324219
ec_bulk: 69
ec_pore_water: 1840
is_vwc_outlier: false
node_serial_no: "18000355"
permittivity: 7
serial: "18000355"
soil_temp: 25.9
subplot: 2
tdr_address: "A"
tdr_sensor_id: "13Acclima TR310S2.114000362"
time_begin: "2021-04-12 16:22:57"
time_end: "2021-11-01 12:00:00"
timestamp: "2021-04-12 19:19:32"
travel_time: "1690"
trt: "b"
ts_up: "2021-04-12 19:24:28"
uid: "2348417"
vwc: 12.6
vwc_outlier_comment: "-999"
vwc_outlier_who_decided: "-999" */}
              <NodeCharts
                activeSerial={activeSerial}
                sensorData={sensorData}
                nodeData={nodeData}
                ambientSensorData={ambientSensorData}
              />
            </Grid>
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

export default VisualsByCode;
