import React, { useEffect, useMemo } from 'react';
import { Button, Grid, Paper, Toolbar } from '@material-ui/core';
import { GpsFixed } from '@material-ui/icons';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import PropTypes from 'prop-types';
import Boost from 'highcharts/modules/boost';

const GatewayChart = ({ gatewayData, axisMinMaxGateway }) => {
  const serials = gatewayData.map((r) => r.serial);
  const uniqueSerials = [...new Set(serials)];

  useEffect(() => {
    Boost(Highcharts);
  }, []);

  const gwBattVol = useMemo(() => {
    return gatewayData.map((record) => [record.timestamp, record.gw_batt_voltage]);
  }, [gatewayData]);

  const gwSolarCurr = useMemo(() => {
    return gatewayData.map((record) => [record.timestamp, record.gw_solar_current]);
  }, [gatewayData]);

  const gwSolarVol = useMemo(() => {
    return gatewayData.map((record) => [record.timestamp, record.gw_solar_voltage]);
  }, [gatewayData]);

  const gwEnclTemp = useMemo(() => {
    return gatewayData.map((record) => [record.timestamp, record.gw_enclosure_temp]);
  }, [gatewayData]);

  const gwTowerSigStr = useMemo(() => {
    return gatewayData.map((record) => [record.timestamp, record.tower_signal_strength]);
  }, [gatewayData]);

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
      text: 'Gateway Data',
    },
    subtitle: {
      text: 'Serial: ' + uniqueSerials.toString(),
    },
    xAxis: {
      type: 'datetime',
      startOnTick: false,
      endOnTick: false,
      showLastLabel: true,
      showFirstLabel: true,
      max: new Date(axisMinMaxGateway.max.split(' ').join('T')).getTime(),
      min: new Date(axisMinMaxGateway.min.split(' ').join('T')).getTime(),
    },
    yAxis: {
      type: 'logarithmic',
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 1,
    },
    series: [
      {
        name: 'Solar Current',
        data: gwSolarCurr,
        tooltip: {
          pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Current: <b>{point.y}</b><br/>',
        },
      },
      {
        name: 'Solar Voltage',
        data: gwSolarVol,
        tooltip: {
          pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>',
        },
      },
      {
        name: 'Battery Voltage',
        data: gwBattVol,
        tooltip: {
          pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Temp: <b>{point.y}</b><br/>',
        },
      },
      {
        name: 'Enclosure Temp',
        data: gwEnclTemp,
        tooltip: {
          pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Temp: <b>{point.y}</b><br/>',
        },
      },
      {
        name: 'Tower Signal Strength',
        data: gwTowerSigStr,
        tooltip: {
          pointFormat: 'Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Temp: <b>{point.y}</b><br/>',
        },
      },
    ],
  };

  return (
    <Grid container>
      <Grid item container xs={12} spacing={2} alignItems="center">
        {gatewayData[0].bare_lat && (
          <Grid item xs={12}>
            <Paper>
              <Toolbar>
                <Button
                  size="small"
                  target="_blank"
                  href={`https://maps.google.com/?t=h&z=21&q=${gatewayData[0].bare_lat},${gatewayData[0].bare_lon}`}
                >
                  <GpsFixed />
                  &nbsp; Bare
                </Button>
                <Button
                  size="small"
                  target="_blank"
                  href={`https://maps.google.com/?t=h&z=21&q=${gatewayData[0].cover_lat},${gatewayData[0].cover_lon}`}
                >
                  <GpsFixed />
                  &nbsp; Cover
                </Button>
              </Toolbar>
            </Paper>
          </Grid>
        )}
        <Grid item xs={12}>
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            containerProps={{ style: { height: '100%', width: '100%' } }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GatewayChart;

GatewayChart.defaultProps = {
  code: 'VMF',
  serials: {
    sensor: [],
    gateway: [],
    node: [],
    ambient: [],
  },
  data: [],
};

GatewayChart.propTypes = {
  gatewayData: PropTypes.array,
  axisMinMaxGateway: PropTypes.any,
};
