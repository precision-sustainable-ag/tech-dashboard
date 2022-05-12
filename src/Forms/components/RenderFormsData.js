import React, { } from 'react';
import { Grid, Typography } from '@material-ui/core';

import FormEntry from './FormEntry';
// import { Context } from '../../Store/Store';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const RenderFormsData = (props) => {
  let { fetching, allowedAccounts, setSnackbarData } = props;

  // const [state] = useContext(Context);
  const formsData = useSelector((state) => state.theStore.formsData);
  if (fetching)
    return (
      <Grid item xs={12}>
        <Typography variant="h5">Fetching Data...</Typography>
      </Grid>
    );
  else if (formsData.filteredData.length === 0 && formsData.originalData.length === 0)
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
          <Typography variant="body1">{formsData.filteredData.length} submissions</Typography>
        </Grid>
        {formsData.filteredData.map((record = {}, index) => {
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
