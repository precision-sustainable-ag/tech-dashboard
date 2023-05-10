import React, { useState, useEffect, useMemo } from 'react';
import { Grid } from '@material-ui/core';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import PropTypes from 'prop-types';
import { CustomLoader } from '../../../utils/CustomComponents';
import Boost from 'highcharts/modules/boost';

const VolumetricWater = ({ tdrData, axisMinMaxTdr }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Boost(Highcharts);
  }, []);

  const chartOptions = {
    time: {
      timezoneOffset: new Date().getTimezoneOffset(),
    },
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
      max: axisMinMaxTdr.max ? new Date(axisMinMaxTdr.max.split(' ').join('T')).getTime() : null,
      min: axisMinMaxTdr.min ? new Date(axisMinMaxTdr.min.split(' ').join('T')).getTime() : null,
    },
    yAxis: {
      title: {
        text: 'VWC',
      },
      min: 0,
      max: 100,
    },

    series: [
      {
        name: 'vwc',
        data: [],
        tooltip: {
          pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>',
        },
      },
    ],
  };

  useEffect(() => {
    if (tdrData) {
      setData(tdrData);
      setLoading(false);
    } else setLoading(true);
  }, [tdrData]);

  const bareSub1Data = useMemo(() => {
    const filteredData = data.filter((rec) => rec.treatment === 'b' && rec.subplot === 1);

    const serials = filteredData.map((r) => r.serial);
    const uniqueSerials = [...new Set(serials)];

    const topDepth = filteredData
      .filter((rec) => rec.center_depth === -15)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const middleDepth = filteredData
      .filter((rec) => rec.center_depth === -45)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const deepDepth = filteredData
      .filter((rec) => rec.center_depth === -80)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const surfaceDepth = filteredData
      .filter((rec) => rec.center_depth === -5)
      .map((rec) => [rec.timestamp, rec.vwc]);

    return {
      ...chartOptions,
      title: {
        text: 'VWC - Rep 1 Bare',
      },
      subtitle: {
        text: 'Serial: ' + uniqueSerials.toString(),
      },
      series: [
        {
          name: 'Surface',
          data: surfaceDepth,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Top',
          data: topDepth,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Middle',
          data: middleDepth,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Deep',
          data: deepDepth,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>',
          },
        },
      ],
    };
  }, [data]);

  const bareSub2Data = useMemo(() => {
    const filteredData = data.filter((rec) => rec.treatment === 'b' && rec.subplot === 2);

    const serials = filteredData.map((r) => r.serial);
    const uniqueSerials = [...new Set(serials)];

    const topDepth = filteredData
      .filter((rec) => rec.center_depth === -15)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const middleDepth = filteredData
      .filter((rec) => rec.center_depth === -45)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const deepDepth = filteredData
      .filter((rec) => rec.center_depth === -80)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const surfaceDepth = filteredData
      .filter((rec) => rec.center_depth === -5)
      .map((rec) => [rec.timestamp, rec.vwc]);

    return {
      ...chartOptions,
      title: {
        text: 'VWC - Rep 2 Bare',
      },
      subtitle: {
        text: 'Serial: ' + uniqueSerials.toString(),
      },
      series: [
        {
          name: 'Surface',
          data: surfaceDepth,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Top',
          data: topDepth,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Middle',
          data: middleDepth,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Deep',
          data: deepDepth,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>',
          },
        },
      ],
    };
  }, [data]);

  const coverSub1Data = useMemo(() => {
    const filteredData = data.filter((rec) => rec.treatment === 'c' && rec.subplot === 1);

    const serials = filteredData.map((r) => r.serial);
    const uniqueSerials = [...new Set(serials)];

    const topDepth = filteredData
      .filter((rec) => rec.center_depth === -15)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const middleDepth = filteredData
      .filter((rec) => rec.center_depth === -45)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const deepDepth = filteredData
      .filter((rec) => rec.center_depth === -80)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const surfaceDepth = filteredData
      .filter((rec) => rec.center_depth === -5)
      .map((rec) => [rec.timestamp, rec.vwc]);

    return {
      ...chartOptions,
      title: {
        text: 'VWC - Rep 1 Cover',
      },
      subtitle: {
        text: 'Serial: ' + uniqueSerials.toString(),
      },
      series: [
        {
          name: 'Surface',
          data: surfaceDepth,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Top',
          data: topDepth,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Middle',
          data: middleDepth,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Deep',
          data: deepDepth,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>',
          },
        },
      ],
    };
  }, [data]);

  const coverSub2Data = useMemo(() => {
    const filteredData = data.filter((rec) => rec.treatment === 'c' && rec.subplot === 2);

    const serials = filteredData.map((r) => r.serial);
    const uniqueSerials = [...new Set(serials)];

    const topDepth = filteredData
      .filter((rec) => rec.center_depth === -15)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const middleDepth = filteredData
      .filter((rec) => rec.center_depth === -45)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const deepDepth = filteredData
      .filter((rec) => rec.center_depth === -80)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const surfaceDepth = filteredData
      .filter((rec) => rec.center_depth === -5)
      .map((rec) => [rec.timestamp, rec.vwc]);

    return {
      ...chartOptions,
      title: {
        text: 'VWC - Rep 2 Cover',
      },
      subtitle: {
        text: 'Serial: ' + uniqueSerials.toString(),
      },
      series: [
        {
          name: 'Surface',
          data: surfaceDepth,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Top',
          data: topDepth,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Middle',
          data: middleDepth,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Deep',
          data: deepDepth,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>',
          },
        },
      ],
    };
  }, [data]);

  return (
    <Grid container>
      {loading ? (
        <CustomLoader />
      ) : (
        <Grid item container spacing={2}>
          <Grid item lg={6} xs={12}>
            <HighchartsReact highcharts={Highcharts} options={bareSub1Data} />
          </Grid>
          <Grid item lg={6} xs={12}>
            <HighchartsReact highcharts={Highcharts} options={coverSub1Data} />
          </Grid>
          <Grid item lg={6} xs={12}>
            <HighchartsReact highcharts={Highcharts} options={bareSub2Data} />
          </Grid>
          <Grid item lg={6} xs={12}>
            <HighchartsReact highcharts={Highcharts} options={coverSub2Data} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default VolumetricWater;

VolumetricWater.propTypes = {
  tdrData: PropTypes.array,
  axisMinMaxTdr: PropTypes.any,
};
