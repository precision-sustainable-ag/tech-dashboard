// Dependency Imports
import React from 'react';
import { Grid, Typography } from '@material-ui/core';

// Default function
const PageNotFound = () => {
  return (
    <div>
      <Grid container>
        <Typography variant="h4" align="center">
          Unknown Route!
        </Typography>
      </Grid>
    </div>
  );
};

export default PageNotFound;
