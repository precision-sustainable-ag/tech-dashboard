import React, { useContext } from "react";
import { Context } from "../Store/Store";
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Box
} from "@material-ui/core";

const LandingComponent = () => {
  const [state, dispatch] = useContext(Context);

  return (
    <Paper elevation={0}>
      <Box paddingTop={"2em"} minHeight={"80vh"}>
        <Typography variant="h5" align="center" gutterBottom>
          Welcome to Precision Sustainable Agriculture Tech Dashboard
        </Typography>
        <Grid container>
          <Grid item>
            {/* <Card>
            <CardActionArea>
              <Typography>Card 1</Typography>
            </CardActionArea>
          </Card> */}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default LandingComponent;
