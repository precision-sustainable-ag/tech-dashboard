import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  Paper,
  Box,
  makeStyles
} from "@material-ui/core";
import Axios from "axios";
import { apiUsername, apiPassword } from "../../utils/api_secret";
import Skeleton from "@material-ui/lab/Skeleton";
import { Redirect } from "react-router-dom";
import WaterSensorDataParser from "./WaterSensorDataParser";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

const getUniqueGatewaySerialNos = async () => {
  return await Axios({
    url: "https://techdashboard.tk/api/retrieve/gateway/serialno/all",
    method: "get",
    auth: {
      username: apiUsername,
      password: apiPassword
    }
  });
};

const WaterSensorData = () => {
  const classes = useStyles();
  const [type, setType] = useState("gateway");
  const [loading, setLoading] = useState(true);

  const [gatewaySerialNos, setGatewaySerialNos] = useState([]);

  useEffect(() => {
    // get unique serial nos, then get node serial nos for each gateway
    getUniqueGatewaySerialNos().then(object => {
      setGatewaySerialNos(object.data.data);
      setLoading(false);
    });
  }, []);

  return !loading ? (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {gatewaySerialNos.map((gatewaysno, index) => (
          <WaterSensorDataParser
            gatewaysno={gatewaysno}
            index={index}
            paperClass={classes.paper}
            key={`gateway-${index}`}
          />
        ))}
      </Grid>
    </div>
  ) : (
    <Skeleton width="300" height="300" variant="rect" />
  );
};

export default WaterSensorData;
