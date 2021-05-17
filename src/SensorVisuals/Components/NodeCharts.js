import {
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Switch,
  FormControl,
} from "@material-ui/core";
import { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Fragment } from "react";

const NodeCharts = (props) => {
  const { activeSerial, nodeData, sensorData, ambientSensorData } = props;
  const [subplot, setSubplot] = useState([1, 2]);
  const [treatment, setTreatment] = useState(["b"]);
  const [centerDepthCheck, setCenterDepthCheck] = useState(false);

  const litterBagTemp = useMemo(() => {
    return ambientSensorData.map((record) => {
      return [
        new Date(record.timestamp.split(" ").join("T")).getTime(),
        record.t_lb,
      ];
    });
  }, [ambientSensorData]);

  const litterBagChartOptions = useMemo(
    () => ({
      global: {
        useUTC: false,
      },

      chart: {
        type: "scatter",
        zoomType: "xy",
      },
      title: {
        text: "",
      },
      xAxis: {
        type: "datetime",
        startOnTick: true,
        endOnTick: true,
        showLastLabel: false,
        showFirstLabel: false,
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
        borderWidth: 1,
      },
      series: [
        {
          name: "t_lb",
          data: litterBagTemp,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>t_lb: <b>{point.y}</b><br/>",
          },
        },
      ],
    }),
    [litterBagTemp]
  );
  const sensorVWC = useMemo(() => {
    return sensorData.map((record) => {
      return [
        new Date(record.timestamp.split(" ").join("T")).getTime(),
        record.vwc,
      ];
    });
  }, [sensorData]);

  const sensorSoilTemp = useMemo(() => {
    return sensorData.map((record) => {
      return [
        new Date(record.timestamp.split(" ").join("T")).getTime(),
        record.soil_temp,
      ];
    });
  }, [sensorData]);

  const sensorCenterDepth = useMemo(() => {
    return sensorData.map((record) => {
      return [
        new Date(record.timestamp.split(" ").join("T")).getTime(),
        record.center_depth,
      ];
    });
  }, [sensorData]);

  const sensorChartOptions = useMemo(
    () => ({
      global: {
        useUTC: false,
      },

      chart: {
        type: "scatter",
        zoomType: "xy",
      },
      title: {
        text: "",
      },
      xAxis: {
        type: "datetime",
        startOnTick: true,
        endOnTick: true,
        showLastLabel: false,
        showFirstLabel: false,
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
        borderWidth: 1,
      },
      series: [
        {
          name: "VWC",
          data: sensorVWC,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Soil Temp",
          data: sensorSoilTemp,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Temp: <b>{point.y}</b><br/>",
          },
        },
        // centerDepthCheck
        //   ? {
        //       name: "Center Depth",
        //       data: sensorSoilTemp,
        //       tooltip: {
        //         pointFormat:
        //           "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Temp: <b>{point.y}</b><br/>",
        //       },
        //     }
        //   : {},
      ],
    }),
    [sensorSoilTemp, sensorVWC]
  );

  const filteredSet = useMemo(() => {
    return nodeData.filter(
      (records) =>
        subplot.includes(records.subplot) && treatment.includes(records.trt)
    );
  }, [nodeData, subplot, treatment]);

  const nodeSolarVoltage = useMemo(() => {
    return filteredSet.map((record) => {
      return [
        new Date(record.timestamp.split(" ").join("T")).getTime(),
        record.nd_solar_voltage,
      ];
    });
  }, [filteredSet]);

  const nodeBatteryVoltage = useMemo(() => {
    return filteredSet.map((record) => {
      return [
        new Date(record.timestamp.split(" ").join("T")).getTime(),
        record.nd_batt_voltage,
      ];
    });
  }, [filteredSet]);

  const voltageChartOptions = useMemo(
    () => ({
      global: {
        useUTC: false,
      },

      chart: {
        type: "scatter",
        zoomType: "xy",
      },
      title: {
        text: "Node Voltage",
      },
      xAxis: {
        type: "datetime",
        startOnTick: true,
        endOnTick: true,
        showLastLabel: false,
        showFirstLabel: false,
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
        borderWidth: 1,
      },
      series: [
        {
          name: "Solar Voltage",
          data: nodeSolarVoltage,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Current: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Battery Voltage",
          data: nodeBatteryVoltage,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Current: <b>{point.y}</b><br/>",
          },
        },
      ],
    }),
    [nodeBatteryVoltage, nodeSolarVoltage]
  );

  return (
    <Grid container justify="center" alignItems="center">
      <Fragment>
        <Grid item container spacing={2}>
          <Grid item>
            <FormControl>
              <Typography variant="body1">Subplot</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={subplot.includes(1)}
                    onChange={(e) =>
                      e.target.checked
                        ? setSubplot((subplot) => [...subplot, 1])
                        : setSubplot([2])
                    }
                    name="subplot1"
                    color="primary"
                  />
                }
                label="Subplot 1"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={subplot.includes(2)}
                    onChange={(e) =>
                      e.target.checked
                        ? setSubplot((subplot) => [...subplot, 2])
                        : setSubplot([1])
                    }
                    name="subplot2"
                    color="primary"
                  />
                }
                label="Subplot 2"
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl>
              <Typography variant="body1">Treatment</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={treatment.includes("c")}
                    onChange={(e) =>
                      e.target.checked
                        ? setTreatment((trt) => [...trt, "c"])
                        : setTreatment(["b"])
                    }
                    name="cover"
                    color="primary"
                  />
                }
                label="Cover"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={treatment.includes("b")}
                    onChange={(e) =>
                      e.target.checked
                        ? setTreatment((trt) => [...trt, "b"])
                        : setTreatment(["c"])
                    }
                    name="bare"
                    color="primary"
                  />
                }
                label="Bare"
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl>
              <FormControlLabel
                control={
                  <Switch
                    checked={centerDepthCheck}
                    onChange={(e) => setCenterDepthCheck(e.target.checked)}
                    name="centerDepth"
                    color="primary"
                  />
                }
                label="Center Depth"
              />
            </FormControl>
          </Grid>
        </Grid>

        {/* <Grid item xs={12}>
          <HighchartsReact
            highcharts={Highcharts}
            options={voltageChartOptions}
            containerProps={{ style: { height: "100%", width: "100%" } }}
          />
        </Grid> */}
        {/* <Grid item xs={12}>
          <HighchartsReact
            highcharts={Highcharts}
            options={sensorChartOptions}
            containerProps={{ style: { height: "100%", width: "100%" } }}
          />
        </Grid>
        <Grid item xs={12}>
          <HighchartsReact
            highcharts={Highcharts}
            options={litterBagChartOptions}
            containerProps={{ style: { height: "100%", width: "100%" } }}
          />
        </Grid> */}
      </Fragment>
    </Grid>
  );
};

export default NodeCharts;
