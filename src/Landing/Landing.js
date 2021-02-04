// Dependency Imports
import React, { useContext } from "react";
import { Typography, Box } from "@material-ui/core";

// Local Imports
import { Context } from "../Store/Store";

// Default function
const LandingComponent = () => {
  const [state, dispatch] = useContext(Context);

  return (
    <Box paddingTop={"2em"} minHeight={"80vh"}>
      <Typography variant="h5" align="center" gutterBottom>
        Welcome to Precision Sustainable Agriculture Tech Dashboard
      </Typography>
    </Box>
  );
};

export default LandingComponent;
