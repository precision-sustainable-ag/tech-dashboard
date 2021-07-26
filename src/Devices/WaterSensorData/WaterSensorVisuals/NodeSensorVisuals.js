/*
DEPRECATED

NodeSensorVisual.js replaces this file
*/

// Dependency Imports
import React, { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import { Grid, Typography } from "@material-ui/core";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Local Imports
import { apiUsername, apiURL, apiPassword } from "../../../utils/api_secret";
import { BarsLoader } from "../../../utils/CustomComponents";

const qs = require("qs");

// Default Function
const NodeSensorVisuals = (props) => {
  const activeChip = props.activeChip;
  const year = props.year;
  const [loading, setLoading] = useState(false);
  const NodeType = () => {
    if (props.bareNodeSerialNo.includes(props.activeChip)) return "Bare Node";
    else return "Cover Node";
  };
  const [volatageChartOptions, setVoltageChartOptions] = useState({
    chart: {
      zoomType: "x",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "Node Voltage",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "Voltage",
      },
      type: "logarithmic",
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      borderWidth: 0,
    },
    series: [
      {
        name: "Battery Voltage",
        data: [],
      },
    ],
  });
  const [currentChartOptions, setCurrentChartOptions] = useState({
    chart: {
      zoomType: "x",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "Node Solar Current",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "Current",
      },
      type: "logarithmic",
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      borderWidth: 0,
    },
    series: [
      {
        name: "Solar Current",
        data: [],
      },
    ],
  });

  const [signalStrengthChartOptions, setSignalStrengthChartOptions] = useState({
    chart: {
      zoomType: "x",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "Node Signal Strength",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "Strength",
      },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      borderWidth: 0,
    },
    series: [
      {
        name: "Signal Strength",
        data: [],
      },
    ],
  });

  const [centerDepthChartOptions, setCenterDepthChartOptions] = useState({
    chart: {
      zoomType: "x",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "Sensor Center Depth",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "Depth",
      },
      type: "logarithmic",
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      borderWidth: 0,
    },
    series: [
      {
        name: "Sensor Depth",
        data: [],
      },
    ],
  });

  const [soilTempChartOptions, setSoilTempChartOptions] = useState({
    chart: {
      zoomType: "x",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "Sensor Soil Temperature",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "Temperature",
      },
      type: "logarithmic",
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      borderWidth: 0,
    },
    series: [
      {
        name: "Soil Temperature",
        data: [],
      },
    ],
  });

  const [vwcChartOptions, setVwcChartOptions] = useState({
    chart: {
      zoomType: "x",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "Volumetric Water Content",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "VWC (%)",
      },
      type: "logarithmic",
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      borderWidth: 0,
    },
    series: [
      {
        name: "VWC",
        data: [],
      },
    ],
  });

  const [permittivityChartOptions, setPermittivityChartOptions] = useState({
    chart: {
      zoomType: "x",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "Permittivity",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "Permittivity",
      },
      type: "logarithmic",
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      borderWidth: 0,
    },
    series: [
      {
        name: "Permittivity",
        data: [],
      },
    ],
  });

  const [ecBulkChartOptions, setEcBulkChartOptions] = useState({
    chart: {
      zoomType: "x",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "EC Bulk",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "EC",
      },
      type: "logarithmic",
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      borderWidth: 0,
    },
    series: [
      {
        name: "EC Bulk",
        data: [],
      },
    ],
  });

  const [ecPoreWaterChartOptions, setEcPoreWaterChartOptions] = useState({
    chart: {
      zoomType: "x",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "EC Pore Water",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "EC Pore Water",
      },
      type: "logarithmic",
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      borderWidth: 0,
    },
    series: [
      {
        name: "EC Pore Water",
        data: [],
      },
    ],
  });

  const setInitialCharts = (nodeArr) => {
    console.log(nodeArr);
    setVoltageChartOptions({
      ...volatageChartOptions,
      chart: {
        type: "scatter",
        zoomType: "xy",
      },
      series: [
        {
          name: "Battery Voltage",
          data: nodeArr[0],
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Solar Voltage",
          data: nodeArr[2],
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>",
          },
        },
      ],
    });

    setCurrentChartOptions({
      ...currentChartOptions,
      chart: {
        type: "scatter",
        zoomType: "xy",
      },
      series: [
        {
          name: "Solar Current",
          data: nodeArr[1],
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Current: <b>{point.y}</b><br/>",
          },
        },
      ],
    });

    setSignalStrengthChartOptions({
      ...signalStrengthChartOptions,
      chart: {
        type: "scatter",
        zoomType: "xy",
      },
      series: [
        {
          name: "Signal Strength",
          data: nodeArr[3],
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Strength: <b>{point.y}</b><br/>",
          },
        },
      ],
    });
  };

  const setSensorCharts = (sensorArr) => {
    setCenterDepthChartOptions({
      ...centerDepthChartOptions,
      // chart: {
      //   type: "scatter",
      //   zoomType: "xy",
      // },
      series: [
        {
          name: "Top Depth",
          data: sensorArr[0].a,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Middle Depth",
          data: sensorArr[0].b,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Deep Depth",
          data: sensorArr[0].c,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
      ],
    });

    //   console.log(sensorArr[1]);
    setSoilTempChartOptions({
      ...soilTempChartOptions,
      chart: {
        type: "scatter",
        zoomType: "xy",
      },
      series: [
        {
          name: "Top Depth",
          data: sensorArr[1].a,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Middle Depth",
          data: sensorArr[1].b,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Deep Depth",
          data: sensorArr[1].c,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
      ],
    });
    setVwcChartOptions({
      ...vwcChartOptions,
      chart: {
        type: "scatter",
        zoomType: "xy",
      },
      series: [
        {
          name: "Top Depth",
          data: sensorArr[2].a,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Middle Depth",
          data: sensorArr[2].b,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Deep Depth",
          data: sensorArr[2].c,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
      ],
    });
    setPermittivityChartOptions({
      ...permittivityChartOptions,
      chart: {
        type: "scatter",
        zoomType: "xy",
      },
      series: [
        {
          name: "Top Depth",
          data: sensorArr[3].a,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Middle Depth",
          data: sensorArr[3].b,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Deep Depth",
          data: sensorArr[3].c,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
      ],
    });

    setEcBulkChartOptions({
      ...ecBulkChartOptions,
      chart: {
        type: "scatter",
        zoomType: "xy",
      },
      series: [
        {
          name: "Top Depth",
          data: sensorArr[4].a,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Middle Depth",
          data: sensorArr[4].b,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Deep Depth",
          data: sensorArr[4].c,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
      ],
    });

    setEcPoreWaterChartOptions({
      ...ecPoreWaterChartOptions,
      chart: {
        type: "scatter",
        zoomType: "xy",
      },
      series: [
        {
          name: "Top Depth",
          data: sensorArr[5].a,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Middle Depth",
          data: sensorArr[5].b,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Deep Depth",
          data: sensorArr[5].c,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Depth: <b>{point.y}</b><br/>",
          },
        },
      ],
    });
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      let initialChartsData = await (
        await fetchBasicNodeData(activeChip, year)
      ).data;
      let sensorChartData = await (
        await fetchSensorNodeData(activeChip, year)
      ).data;
      if (initialChartsData.data) {
        setInitialCharts(initialChartsData.data);
      }
      if (sensorChartData.data) {
        setSensorCharts(sensorChartData.data);
      }
      setLoading(false);
    };
    if (activeChip) {
      init();
    }
  }, [activeChip]);

  return (
    <Grid container justifyContent="center">
      <Grid item md={12}>
        <Typography variant="h5" align="center">
          Node Data for {<NodeType />} {props.activeChip}
        </Typography>
      </Grid>
      {loading ? (
        <Grid item md={12}>
          <BarsLoader />
        </Grid>
      ) : (
        <Fragment>
          <Grid item md={12}>
            <HighchartsReact
              highcharts={Highcharts}
              options={volatageChartOptions}
            />
          </Grid>
          <Grid item md={12}>
            <HighchartsReact
              highcharts={Highcharts}
              options={currentChartOptions}
            />
          </Grid>
          <Grid item md={12}>
            <HighchartsReact
              highcharts={Highcharts}
              options={signalStrengthChartOptions}
            />
          </Grid>

          <Grid item md={12}>
            <HighchartsReact
              highcharts={Highcharts}
              options={soilTempChartOptions}
            />
          </Grid>

          <Grid item md={12}>
            <HighchartsReact
              highcharts={Highcharts}
              options={vwcChartOptions}
            />
          </Grid>

          <Grid item md={12}>
            <HighchartsReact
              highcharts={Highcharts}
              options={permittivityChartOptions}
            />
          </Grid>
          <Grid item md={12}>
            <HighchartsReact
              highcharts={Highcharts}
              options={ecBulkChartOptions}
            />
          </Grid>
          <Grid item md={12}>
            <HighchartsReact
              highcharts={Highcharts}
              options={ecPoreWaterChartOptions}
            />
          </Grid>
        </Fragment>
      )}
    </Grid>
  );
};

// Helper functions
const fetchBasicNodeData = async (nodeSerialNo, year) => {
  let dataObj = {
    serialNo: nodeSerialNo,
    year: year,
    type: "node",
  };
  return await Axios({
    url: `${apiURL}/api/retrieve/chart/water_node_data/by/node`,
    method: "post",
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    data: qs.stringify(dataObj),
  }).catch((e) => {
    console.error(e);
  });
};

const fetchSensorNodeData = async (nodeSerialNo, year) => {
  let dataObj = {
    serialNo: nodeSerialNo,
    year: year,
    type: "sensor",
  };
  return await Axios({
    url: `${apiURL}/api/retrieve/chart/water_sensor_data/by/node`,
    method: "post",
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    data: qs.stringify(dataObj),
  });
};

export default NodeSensorVisuals;
