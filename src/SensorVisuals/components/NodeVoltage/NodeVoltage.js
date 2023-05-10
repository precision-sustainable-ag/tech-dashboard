import React, { useEffect, useMemo } from 'react';
import { Grid } from '@material-ui/core';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import PropTypes from 'prop-types';
import Boost from 'highcharts/modules/boost';

const timezoneOffset = new Date().getTimezoneOffset();

const NodeVoltage = ({ nodeData, axisMinMaxNode }) => {
  useEffect(() => {
    Boost(Highcharts);
  }, []);

  const chartOptions = {
    time: {
      timezoneOffset: timezoneOffset,
    },
    chart: {
      type: 'scatter',
      zoomType: 'xy',
      borderColor: 'black',
      borderWidth: 1,
    },
    title: {
      text: `Node Health - `,
    },
    xAxis: {
      type: 'datetime',
      startOnTick: false,
      endOnTick: false,
      showLastLabel: true,
      showFirstLabel: true,
      max: new Date(axisMinMaxNode.max.split(' ').join('T')).getTime(),
      min: new Date(axisMinMaxNode.min.split(' ').join('T')).getTime(),
    },
    yAxis: {
      title: {
        text: 'Voltage',
      },
      type: 'linear',
    },
    series: [
      {
        name: 'Solar Voltage',
        data: [],
      },
      {
        name: 'Battery Voltage',
        data: [],
      },
      {
        name: 'Signal Strength',
        data: [],
      },
    ],
  };

  const bareSub1Data = useMemo(() => {
    const filteredData = nodeData.filter((rec) => rec.treatment === 'b' && rec.subplot === 1);
    const serials = filteredData.map((r) => r.serial);
    const uniqueSerials = [...new Set(serials)];

    const battVol = filteredData.map((rec) => [rec.timestamp, rec.nd_batt_voltage]);
    const solVol = filteredData.map((rec) => [rec.timestamp, rec.nd_solar_voltage]);
    const sigStr = filteredData.map((rec) => [rec.timestamp, rec.signal_strength / 20]);
    return {
      ...chartOptions,
      title: {
        text: chartOptions.title.text + 'Rep 1 Bare',
      },
      subtitle: {
        text: 'Serial: ' + uniqueSerials.toString(),
      },
      series: [
        {
          name: 'Solar Voltage',
          data: solVol,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Battery Voltage',
          data: battVol,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Signal Strength',
          data: sigStr,
          tooltip: {
            pointFormatter: function () {
              const xDate = new Date(this.x);
              xDate.setTime(xDate.getTime() - timezoneOffset * 60 * 1000);
              const xDateString = xDate.toISOString();
              const xDateSplit = xDateString.split('T');
              const xYear = xDateSplit[0];
              const xTime = xDateSplit[1].split(':').slice(0, 2).join(':');
              const dateString = `${xYear} ${xTime}`;
              return `Date: <b>${dateString}</b><br/>Strength: <b>${this.y * 20}</b><br/>`;
            },
          },
        },
      ],
    };
  }, [nodeData]);

  const bareSub2Data = useMemo(() => {
    const filteredData = nodeData.filter((rec) => rec.treatment === 'b' && rec.subplot === 2);

    const serials = filteredData.map((r) => r.serial);
    const uniqueSerials = [...new Set(serials)];

    const battVol = filteredData.map((rec) => [rec.timestamp, rec.nd_batt_voltage]);
    const solVol = filteredData.map((rec) => [rec.timestamp, rec.nd_solar_voltage]);
    const sigStr = filteredData.map((rec) => [rec.timestamp, rec.signal_strength / 20]);
    return {
      ...chartOptions,
      title: {
        text: chartOptions.title.text + 'Rep 2 Bare',
      },
      subtitle: {
        text: 'Serial: ' + uniqueSerials.toString(),
      },
      series: [
        {
          name: 'Solar Voltage',
          data: solVol,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Battery Voltage',
          data: battVol,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Signal Strength',
          data: sigStr,
          tooltip: {
            pointFormatter: function () {
              const xDate = new Date(this.x);
              xDate.setTime(xDate.getTime() - timezoneOffset * 60 * 1000);
              const xDateString = xDate.toISOString();
              const xDateSplit = xDateString.split('T');
              const xYear = xDateSplit[0];
              const xTime = xDateSplit[1].split(':').slice(0, 2).join(':');
              const dateString = `${xYear} ${xTime}`;
              return `Date: <b>${dateString}</b><br/>Strength: <b>${this.y * 20}</b><br/>`;
            },
          },
        },
      ],
    };
  }, [nodeData]);

  const coverSub1Data = useMemo(() => {
    const filteredData = nodeData.filter((rec) => rec.treatment === 'c' && rec.subplot === 1);

    const serials = filteredData.map((r) => r.serial);
    const uniqueSerials = [...new Set(serials)];

    const battVol = filteredData.map((rec) => [rec.timestamp, rec.nd_batt_voltage]);
    const solVol = filteredData.map((rec) => [rec.timestamp, rec.nd_solar_voltage]);
    const sigStr = filteredData.map((rec) => [rec.timestamp, rec.signal_strength / 20]);
    return {
      ...chartOptions,
      title: {
        text: chartOptions.title.text + 'Rep 1 Cover',
      },
      subtitle: {
        text: 'Serial: ' + uniqueSerials.toString(),
      },
      series: [
        {
          name: 'Solar Voltage',
          data: solVol,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Battery Voltage',
          data: battVol,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Signal Strength',
          data: sigStr,
          tooltip: {
            pointFormatter: function () {
              const xDate = new Date(this.x);
              xDate.setTime(xDate.getTime() - timezoneOffset * 60 * 1000);
              const xDateString = xDate.toISOString();
              const xDateSplit = xDateString.split('T');
              const xYear = xDateSplit[0];
              const xTime = xDateSplit[1].split(':').slice(0, 2).join(':');
              const dateString = `${xYear} ${xTime}`;
              return `Date: <b>${dateString}</b><br/>Strength: <b>${this.y * 20}</b><br/>`;
            },
          },
        },
      ],
    };
  }, [nodeData]);

  const coverSub2Data = useMemo(() => {
    const filteredData = nodeData.filter((rec) => rec.treatment === 'c' && rec.subplot === 2);

    const serials = filteredData.map((r) => r.serial);
    const uniqueSerials = [...new Set(serials)];

    const battVol = filteredData.map((rec) => [rec.timestamp, rec.nd_batt_voltage]);
    const solVol = filteredData.map((rec) => [rec.timestamp, rec.nd_solar_voltage]);
    const sigStr = filteredData.map((rec) => [rec.timestamp, rec.signal_strength / 20]);
    return {
      ...chartOptions,
      title: {
        text: chartOptions.title.text + 'Rep 2 Cover',
      },
      subtitle: {
        text: 'Serial: ' + uniqueSerials.toString(),
      },
      series: [
        {
          name: 'Solar Voltage',
          data: solVol,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Battery Voltage',
          data: battVol,
          tooltip: {
            pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>',
          },
        },
        {
          name: 'Signal Strength',
          data: sigStr,
          tooltip: {
            pointFormatter: function () {
              const xDate = new Date(this.x);
              xDate.setTime(xDate.getTime() - timezoneOffset * 60 * 1000);
              const xDateString = xDate.toISOString();
              const xDateSplit = xDateString.split('T');
              const xYear = xDateSplit[0];
              const xTime = xDateSplit[1].split(':').slice(0, 2).join(':');
              const dateString = `${xYear} ${xTime}`;
              return `Date: <b>${dateString}</b><br/>Strength: <b>${this.y * 20}</b><br/>`;
            },
          },
        },
      ],
    };
  }, [nodeData]);

  return (
    <Grid container>
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
    </Grid>
  );
};

export default NodeVoltage;

NodeVoltage.propTypes = {
  nodeData: PropTypes.array,
  axisMinMaxNode: PropTypes.any,
};
