import React, { useMemo } from 'react';
import { Grid } from '@material-ui/core';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import 'highcharts/modules/no-data-to-display';
import PropTypes from 'prop-types';

const LitterbagTemp = ({ ambientData, axisMinMaxLitterbag }) => {
  const chartOptions = {
    chart: {
      type: 'scatter',
      zoomType: 'xy',
      borderColor: 'black',
      borderWidth: 1,
    },
    title: {
      text: `Volumetric Water Content`,
    },
    xAxis: {
      type: 'datetime',
      startOnTick: false,
      endOnTick: false,
      showLastLabel: true,
      showFirstLabel: true,
      max: axisMinMaxLitterbag.max
        ? new Date(axisMinMaxLitterbag.max.split(' ').join('T')).getTime()
        : null,
      min: axisMinMaxLitterbag.min
        ? new Date(axisMinMaxLitterbag.min.split(' ').join('T')).getTime()
        : null,
    },
    yAxis: {
      title: {
        text: 't_lb',
      },
      min: 0,
      max: 50,
    },
    boost: {
      useGPUTranslations: true,
      seriesThreshold: 100,
    },

    series: [
      {
        name: 'vwc',
        data: [],
        boostThreshold: 100,
        tooltip: {
          pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Current: <b>{point.y}</b><br/>',
        },
      },
    ],
    lang: { noData: 'Your custom message' },
  };

  const coverSub1Data = useMemo(() => {
    const filteredData = ambientData.filter((rec) => rec.treatment === 'c' && rec.subplot === 1);

    const val = filteredData.map((rec) => [rec.timestamp, rec.t_lb]);
    return {
      ...chartOptions,
      title: {
        text: 'Litterbag Temp - Rep 1 Cover',
      },
      series: [
        {
          name: 'Litterbag Temp',
          data: val,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Temp: <b>{point.y}</b><br/>',
          },
        },
      ],
    };
  }, [ambientData]);

  const coverSub2Data = useMemo(() => {
    const filteredData = ambientData.filter((rec) => rec.treatment === 'c' && rec.subplot === 2);

    const val = filteredData.map((rec) => [rec.timestamp, rec.t_lb]);

    return {
      ...chartOptions,
      title: {
        text: 'Litterbag Temp - Rep 2 Cover',
      },
      series: [
        {
          name: 'Litterbag Temp',
          data: val,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Temp: <b>{point.y}</b><br/>',
          },
        },
      ],
    };
  }, [ambientData]);

  return (
    <Grid container>
      <Grid item container spacing={2}>
        <Grid item lg={6} xs={12}>
          <HighchartsReact highcharts={Highcharts} options={coverSub1Data} />
        </Grid>
        <Grid item lg={6} xs={12}>
          <HighchartsReact highcharts={Highcharts} options={coverSub2Data} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LitterbagTemp;

LitterbagTemp.propTypes = {
  ambientData: PropTypes.array,
  axisMinMaxLitterbag: PropTypes.any,
  year: PropTypes.string,
};
