import { Button, Chip, Grid, Typography } from "@material-ui/core";
import { onfarmAPI } from "../../utils/api_secret";
import PropTypes from "prop-types";
import { ArrowBackIos } from "@material-ui/icons";
import { useHistory, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../Store/Store";
import { CustomLoader } from "../../utils/CustomComponents";

const VisualsByCode = () => {
  const [state] = useContext(Context);
  const history = useHistory();
  const { code, year } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [serialNumbers, setSerialNumbers] = useState([]);
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

  const waterSensorDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=tdr&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31&location=true`;

  const waterGatewayDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=gateway&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31&location=true`;

  const waterNodeDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=node&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31&location=true`;

  const waterAmbientSensorDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=ambient&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31&location=true`;

  useEffect(() => {
    const fetchData = async (apiKey) => {
      const setAllData = (response, type, serialData) => {
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
            setSerials({ ...serialData, sensor: uniqueSerials });
            break;
          }
          case "node": {
            setNodeData(response);
            setSerials({ ...serialData, node: uniqueSerials });
            break;
          }
          case "gateway": {
            setGatewayData(response);
            setSerials({ ...serialData, gateway: uniqueSerials });
            break;
          }
          case "ambient": {
            setAmbientSensorData(response);
            setSerials({ ...serialData, ambient: uniqueSerials });
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

          const gatewayResponse = await gatewayRecords.json();
          const nodeResponse = await nodeRecords.json();
          const ambientResponse = await ambientRecords.json();
          const waterSensorResponse = await waterSensorRecords.json();

          setAllData(gatewayResponse, "gateway");
          setAllData(nodeResponse, "node");
          setAllData(ambientResponse, "ambient");
          setAllData(waterSensorResponse, "sensor");
        } catch (e) {
          // console.error("Error:" + e);

          throw new Error(e);
        }
      } else {
        setData([]);
      }
      setLoading(false);
    };

    fetchData(state.userInfo.apikey);
    return () => {
      setLoading(false);
      setData([]);
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
        ) : data.length === 0 ? (
          <Grid container style={{ minHeight: "20vh" }}>
            <Grid item xs={12}>
              <Typography variant="h6">No data available for {year}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                href=""
                target="_blank"
                rel="noreferrer"
                size="small"
              >
                psa water sensor install
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid container>
            <Grid item xs={12}>
              <VisualContent code={code} serials={serialNumbers} />
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

const VisualContent = (props) => {
  const { code, serials } = props;

  return (
    <Grid container>
      <Grid item container xs={12} spacing={2} alignItems="center">
        <Grid item>
          <Typography>Serial Numbers</Typography>
        </Grid>
        {serials.map((serial, index) => (
          <Grid item key={index}>
            <Chip label={serial} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

VisualContent.defaultProps = {
  code: "VMF",
  serials: [],
};

export default VisualsByCode;
