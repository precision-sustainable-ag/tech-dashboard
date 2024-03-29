import React from 'react';
import { Grid, Typography } from '@material-ui/core';

import FormEntry from '../FormEntry/FormEntry';
// import { Context } from '../../Store/Store';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const RenderFormsData = (props) => {
  let { fetching, allowedAccounts } = props;

  // const [state] = useContext(Context);
  const filteredData = useSelector((state) => state.formsData.filteredData);
  if (fetching)
    return (
      <Grid item xs={12}>
        <Typography variant="h5">Fetching Data...</Typography>
      </Grid>
    );
  else if (filteredData.length === 0)
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
          <Typography variant="body1">{filteredData.length} submissions</Typography>
        </Grid>
        {filteredData.map((record = {}, index) => {
          return <FormEntry record={record} index={index} key={`record${index}`} />;
        })}
      </>
    );
};

RenderFormsData.propTypes = {
  fetching: PropTypes.bool,
  allowedAccounts: PropTypes.array,
};
export default RenderFormsData;
