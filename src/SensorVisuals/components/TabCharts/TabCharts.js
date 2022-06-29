import React, { Fragment, useEffect, useState } from 'react';
import { lazy } from 'react';
import { Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

import GatewayChart from '../GatewayChart/GatewayChart';
const NodeVoltage = lazy(() => import('../NodeVoltage/NodeVoltage'));
const SoilTemp = lazy(() => import('../SoilTemp/SoilTemp'));
const TempByLbs = lazy(() => import('../LitterbagTemp/LitterbagTemp'));
const VolumetricWater = lazy(() => import('../VolumetricWater/VolumetricWater'));

export const convertEpochtoDatetime = (epoch) => {
  var date = new Date(epoch - new Date().getTimezoneOffset() * 60000);
  // eslint-disable-next-line
  var iso = date.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/);
  return iso[1] + ' ' + iso[2];
};

const now = convertEpochtoDatetime(Date.now());

const TabCharts = (props) => {
  const [axisMinMaxGateway, setAxisMinMaxGateway] = useState([{ min: now }, { max: now }]);
  const [axisMinMaxTdr, setAxisMinMaxTdr] = useState([{ min: now }, { max: now }]);
  let {
    gatewayData,
    activeCharts,
    // nodeData,
    tdrData,
    year,
  } = props;

  useEffect(() => {
    const timestampsGateway = gatewayData.map((data) => new Date(data.timestamp).getTime());
    setAxisMinMaxGateway({
      min: convertEpochtoDatetime(new Date(Math.min(...timestampsGateway))),
      max:
        new Date().getFullYear().toString() === year
          ? now
          : convertEpochtoDatetime(new Date(Math.max(...timestampsGateway))),
    });

    const timestampsTdr = tdrData.map((data) => new Date(data.timestamp).getTime());
    setAxisMinMaxTdr({
      min: convertEpochtoDatetime(new Date(Math.min(...timestampsTdr))),
      max:
        new Date().getFullYear().toString() === year
          ? now
          : convertEpochtoDatetime(new Date(Math.max(...timestampsTdr))),
    });
  }, []);

  if (activeCharts === 'gateway') {
    return (
      <Grid container spacing={3}>
        {gatewayData.length > 0 ? (
          <Grid item container spacing={4}>
            <Grid item container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" align="center">
                  Node Health
                </Typography>
              </Grid>
              <NodeVoltage axisMinMaxGateway={axisMinMaxGateway} />
              {gatewayData.length > 0 && (
                <Grid item xs={12}>
                  <GatewayChart data={gatewayData} axisMinMaxGateway={axisMinMaxGateway} />
                </Grid>
              )}
            </Grid>
          </Grid>
        ) : (
          'Node data unavailable'
        )}
      </Grid>
    );
  } else if (activeCharts === 'vwc') {
    return (
      <Grid container spacing={3}>
        {tdrData.length > 0 ? (
          <Grid item container spacing={4}>
            <Grid item container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" align="center">
                  VWC
                </Typography>
              </Grid>
              <VolumetricWater tdrData={tdrData} axisMinMaxTdr={axisMinMaxTdr} />
            </Grid>
          </Grid>
        ) : (
          'VWC data unavailable'
        )}
      </Grid>
    );
  } else if (activeCharts === 'temp') {
    return (
      <Grid container spacing={3}>
        {tdrData.length > 0 ? (
          <Grid item container spacing={4}>
            <Grid item container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" align="center">
                  Soil Temperature
                </Typography>
              </Grid>
              <SoilTemp tdrData={tdrData} axisMinMaxTdr={axisMinMaxTdr} />
            </Grid>

            <Grid item container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" align="center">
                  Litterbag Temperature
                </Typography>
              </Grid>
              <TempByLbs />
            </Grid>
          </Grid>
        ) : (
          'Temperature data unavailable'
        )}
      </Grid>
    );
  } else {
    return <Fragment></Fragment>;
  }
};

TabCharts.propTypes = {
  value: PropTypes.string,
  handleChange: PropTypes.func,
  gatewayData: PropTypes.array,
  activeCharts: PropTypes.string,
  nodeData: PropTypes.array,
  tdrData: PropTypes.array,
  year: PropTypes.any,
};

export default TabCharts;
