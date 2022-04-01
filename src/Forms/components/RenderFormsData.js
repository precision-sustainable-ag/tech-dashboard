import React, { useContext } from 'react';
import { Grid, Typography } from '@material-ui/core';

import FormEntry from './FormEntry';
import { Context } from '../../Store/Store';
import PropTypes from 'prop-types';

const RenderFormsData = (props) => {
  let { fetching, allowedAccounts, setSnackbarData } = props;

  const [state] = useContext(Context);

  if (fetching)
    return (
      <Grid item xs={12}>
        <Typography variant="h5">Fetching Data...</Typography>
      </Grid>
    );
  else if (state.formsData.data.length === 0 && state.formsData.originalData.length === 0)
    return (
      <Grid item xs={12}>
        <Typography variant="h5">
          {' '}
          {allowedAccounts.length !== 0
            ? `No submissions on this form via account${
                allowedAccounts.length > 1 ? `s` : ''
              } ${allowedAccounts.join(', ')}`
            : 'No Data'}
        </Typography>
      </Grid>
    );
  else
    return (
      <>
        <Grid item xs={12}>
          <Typography variant="body1">{state.formsData.data.length} submissions</Typography>
        </Grid>
        {state.formsData.data.map((record = {}, index) => {
          return (
            <FormEntry
              record={record}
              index={index}
              key={`record${index}`}
              setSnackbarData={setSnackbarData}
            />
          );
        })}
      </>
    );
};

RenderFormsData.propTypes = {
  fetching: PropTypes.bool,
  allowedAccounts: PropTypes.array,
  setSnackbarData: PropTypes.func,
};
export default RenderFormsData;
