// Dependency Imports
import React, { useEffect, Fragment } from "react";
import { Grid, Paper, Box, Typography } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import Axios from "axios";

// Local Imports
import { apiUsername, apiPassword, apiURL } from "../../utils/api_secret";

const WaterSensorDataParser = (props) => {
  let gatewaysno = props.gatewaysno;
  const [shouldRedirect, setShouldRedirect] = React.useState(false);
  const [farmCode, setFarmCode] = React.useState([props.farmCode] || []);
  const redirectToNodes = (gatewaySerialNo) => {
    setShouldRedirect(true);
  };

  const getFarmCode = async (gatewaySno) => {
    await Axios({
      url: `${apiURL}/api/retrieve/nodes/by/gateway/${gatewaySno}`,
      method: "get",
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
    }).then((obj) => {
      //   console.log(obj.data.data.code);
      if (obj.data.data.length > 0) {
        let farmcodesArr = [];
        for (let i in obj.data.data) {
          farmcodesArr.push(obj.data.data[i].code);
        }
        setFarmCode(farmcodesArr);
      } else setFarmCode([]);
    });
  };

  useEffect(() => {
    if (farmCode.length === 0) getFarmCode(gatewaysno);
  }, []);

  return shouldRedirect ? (
    <Redirect
      to={{
        pathname: `/water-sensors/${gatewaysno}`,
        state: props,
      }}
      push={true}
    />
  ) : (
    <Grid item md={3} xs={6}>
      <Paper
        className={props.paperClass}
        style={{ cursor: "pointer" }}
        onClick={() => redirectToNodes(gatewaysno)}
      >
        <Box>
          <Typography variant="subtitle1">
            Farm Code:{" "}
            {farmCode.length > 0
              ? farmCode.map((code, index) => (
                  <Fragment key={`farmcode-${index}`}>
                    <span style={{ fontWeight: "bold" }}>{code}</span>
                    &nbsp;&nbsp;
                  </Fragment>
                ))
              : "No Farm Code"}
          </Typography>
          <Typography variant="subtitle2">Subplot {props.subplot}</Typography>
        </Box>
      </Paper>
    </Grid>
  );
};

export default WaterSensorDataParser;
