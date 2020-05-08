import React, { useEffect, Fragment } from "react";
import { Grid, Paper, Box, Typography } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import Axios from "axios";
import { apiUsername, apiPassword } from "../../utils/api_secret";

const WaterSensorDataParser = props => {
  let gatewaysno = props.gatewaysno;
  const [shouldRedirect, setShouldRedirect] = React.useState(false);
  const [farmCode, setFarmCode] = React.useState([]);
  const redirectToNodes = gatewaySerialNo => {
    setShouldRedirect(true);
  };

  const getFarmCode = async gatewaySno => {
    await Axios({
      url: `https://techdashboard.tk/api/retrieve/nodes/by/gateway/${gatewaySno}`,
      method: "get",
      auth: {
        username: apiUsername,
        password: apiPassword
      }
    }).then(obj => {
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
    getFarmCode(gatewaysno);
  }, []);

  return shouldRedirect ? (
    <Redirect
      to={{
        pathname: `/water-sensors/${gatewaysno}`,
        state: gatewaysno
      }}
    />
  ) : (
    <Grid item md={3}>
      <Paper
        className={props.paperClass}
        style={{ minHeight: "100px", minWidth: "100px", cursor: "pointer" }}
        onClick={() => redirectToNodes(gatewaysno)}
      >
        <Box>
          <Typography variant="body1">
            Gateway Serial No {gatewaysno}
          </Typography>
          <Typography variant="subtitle1">
            Farm Code:{" "}
            {farmCode.length > 0
              ? farmCode.map((code, index) => (
                  <Fragment key={`farmcode-${index}`}>
                    <span>{code}</span>&nbsp;&nbsp;
                  </Fragment>
                ))
              : "No Farm Code"}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
};

export default WaterSensorDataParser;
