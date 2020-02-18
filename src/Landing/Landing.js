import React, { useContext } from "react";
import { Context } from "../Store/Store";
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardActionArea
} from "@material-ui/core";

const LandingComponent = () => {
  const [state, dispatch] = useContext(Context);

  return (
    <div>
      <Typography variant="h5" align="center" gutterBottom>
        Welcome to Precision Sustainable Agriculture Tech Dashboard
      </Typography>
      <Grid container>
        <Grid item>
          <Paper>
            <Card>
              <CardActionArea>
                <Typography>Card 1</Typography>
              </CardActionArea>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default LandingComponent;
