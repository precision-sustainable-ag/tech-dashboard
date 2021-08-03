import React from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const DevicesWrapper = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Devices</Typography>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          component={Link}
          to={"/devices/water-sensors"}
        >
          Water Sensors
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          component={Link}
          to={"/devices/stress-cams"}
        >
          Stress Cams
        </Button>
      </Grid>
    </Grid>
  );
};

export default DevicesWrapper;
