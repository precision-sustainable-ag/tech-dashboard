//Dependency Imports
import React, { useContext } from "react";
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Box,
  Button,
} from "@material-ui/core";

//Local Imports
import { Context } from "../Store/Store";

const LandingComponent = () => {
  const [state, dispatch] = useContext(Context);

  return (
    <Box paddingTop={"2em"} minHeight={"80vh"}>
      <Typography variant="h5" align="center" gutterBottom>
        Welcome to Precision Sustainable Agriculture Tech Dashboard
      </Typography>
      {/* <Grid container>
          <Grid item>

          </Grid>
        </Grid> */}
      {/* <Button variant="outlined" href="/devices">
        Water Sensors
      </Button> */}
    </Box>
  );
};

export default LandingComponent;
