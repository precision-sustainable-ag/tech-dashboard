import React, { useState, useEffect, Fragment } from "react";
import { apiUsername, apiURL, apiPassword } from "../../../utils/api_secret";
import Axios from "axios";
import { Grid, Typography } from "@material-ui/core";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Loading from "react-loading";
import { BarsLoader } from "../../../utils/CustomComponents";

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

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      let initialChartsData = await (await fetchBareNodeData(activeChip, year))
        .data;
      if (initialChartsData.data) {
        setInitialCharts(initialChartsData.data);
        setLoading(false);
      }
    };
    if (activeChip) {
      init();
    }
  }, [activeChip]);

  return (
    <Grid container justify="center">
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
        </Fragment>
      )}
    </Grid>
  );
};

const fetchBareNodeData = async (nodeSerialNo, year) => {
  return await Axios({
    url: `${apiURL}/api/retrieve/chart/water_node_data/by/node/${nodeSerialNo}/${year}`,
    method: "get",
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  }).catch((e) => {
    console.error(e);
  });
};

export default NodeSensorVisuals;
