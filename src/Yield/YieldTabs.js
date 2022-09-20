import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import YieldTables from './YieldTables';

const YieldCharts = (props) => {
  /*useEffect(() => {
    console.log(data);
  }, []);*/

  const { data, activeTable, farmYears, affiliations } = props;
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  if (activeTable === 'Corn') {
    return (
      <Grid container spacing={3}>
        {data.length > 0 ? (
          <Grid item container spacing={4}>
            <Grid item container spacing={3}>
              <YieldTables
                tableName="Corn"
                data={tableData}
                affiliations={affiliations}
                farmYears={farmYears}
              />
            </Grid>
          </Grid>
        ) : (
          'Corn data unavailable'
        )}
      </Grid>
    );
  } else if (activeTable === 'Soybean') {
    return (
      <Grid container spacing={3}>
        {data.length > 0 ? (
          <Grid item container spacing={4}>
            <Grid item container spacing={3}>
              <YieldTables
                tableName="Soybean"
                data={tableData}
                affiliations={affiliations}
                farmYears={farmYears}
              />
            </Grid>
          </Grid>
        ) : (
          'Soybean data unavailable'
        )}
      </Grid>
    );
  } else if (activeTable === 'Cotton') {
    return (
      <Grid container spacing={3}>
        {data.length > 0 ? (
          <Grid item container spacing={4}>
            <Grid item container spacing={3}>
              <YieldTables
                tableName="Cotton"
                data={tableData}
                affiliations={affiliations}
                farmYears={farmYears}
              />
            </Grid>
          </Grid>
        ) : (
          'Cotton data unavailable'
        )}
      </Grid>
    );
  } else {
    return <Fragment></Fragment>;
  }
};

YieldCharts.propTypes = {
  data: PropTypes.array,
  activeTable: PropTypes.string,
  farmYears: PropTypes.array,
  affiliations: PropTypes.array,
};

export default YieldCharts;
