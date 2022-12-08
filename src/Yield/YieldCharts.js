import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import YieldTables from './YieldTables';

const YieldCharts = (props) => {
  const { data, activeTable, farmYears, affiliations } = props;
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  return (
    <Grid container spacing={3}>
      {data.length > 0 ? (
        <Grid item container spacing={4}>
          <Grid item container spacing={3}>
            <YieldTables
              tableName={activeTable}
              data={tableData}
              affiliations={affiliations}
              farmYears={farmYears}
            />
          </Grid>
        </Grid>
      ) : (
        activeTable + ' data unavailable'
      )}
    </Grid>
  );
};

YieldCharts.propTypes = {
  data: PropTypes.array,
  activeTable: PropTypes.string,
  farmYears: PropTypes.array,
  affiliations: PropTypes.array,
};

export default YieldCharts;
