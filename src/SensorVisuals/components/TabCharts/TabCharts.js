import React, { Fragment, useEffect, useState } from 'react';
import { lazy } from 'react';
import { Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import GatewayChart from '../GatewayChart/GatewayChart';

const NodeVoltage = lazy(() => import('../NodeVoltage/NodeVoltage'));
const SoilTemp = lazy(() => import('../SoilTemp/SoilTemp'));
const LitterbagTemp = lazy(() => import('../LitterbagTemp/LitterbagTemp'));
const VolumetricWater = lazy(() => import('../VolumetricWater/VolumetricWater'));

export const convertEpochtoDatetime = (epoch) => {
  let date = new Date(epoch - new Date().getTimezoneOffset() * 60000);
  // eslint-disable-next-line
  let iso = date.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/);
  return iso[1] + ' ' + iso[2];
};

const now = convertEpochtoDatetime(Date.now());

const TabCharts = ({
  gatewayData,
  ambientData,
  nodeData,
  tdrData,
  year,
  activeCharts,
  loadingMessage,
}) => {
  const [axisMinMaxGateway, setAxisMinMaxGateway] = useState([{ min: now }, { max: now }]);
  const [axisMinMaxTdr, setAxisMinMaxTdr] = useState([{ min: now }, { max: now }]);
  const [axisMinMaxLitterbag, setAxisMinMaxLitterbag] = useState([{ min: now }, { max: now }]);
  const [axisMinMaxNode, setAxisMinMaxNode] = useState([{ min: now }, { max: now }]);

  useEffect(() => {
    const generateMinMax = (sensorData) => {
      return {
        min: sensorData.length === 0 ? now : convertEpochtoDatetime(sensorData[0].timestamp),
        max:
          new Date().getFullYear().toString() === year
            ? now
            : convertEpochtoDatetime(sensorData[sensorData.length - 1].timestamp),
      };
    };

    setAxisMinMaxGateway(generateMinMax(gatewayData));
    setAxisMinMaxTdr(generateMinMax(tdrData));
    setAxisMinMaxLitterbag(generateMinMax(ambientData));
    setAxisMinMaxNode(generateMinMax(nodeData));
  }, [ambientData, gatewayData, nodeData, tdrData, year]);

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
              <NodeVoltage axisMinMaxNode={axisMinMaxNode} nodeData={nodeData} />
              {gatewayData.length > 0 && (
                <Grid item xs={12}>
                  <GatewayChart gatewayData={gatewayData} axisMinMaxGateway={axisMinMaxGateway} />
                </Grid>
              )}
            </Grid>
          </Grid>
        ) : !gatewayData ? (
          'No Gateway Data'
        ) : (
          loadingMessage
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
        ) : !tdrData ? (
          'No VWC Data'
        ) : (
          loadingMessage
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
              <LitterbagTemp ambientData={ambientData} axisMinMaxLitterbag={axisMinMaxLitterbag} />
            </Grid>
          </Grid>
        ) : !tdrData ? (
          'No Temperature Data'
        ) : (
          loadingMessage
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
  ambientData: PropTypes.array,
  year: PropTypes.any,
  loadingMessage: PropTypes.string,
};

export default TabCharts;
