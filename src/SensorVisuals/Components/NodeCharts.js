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
  const { activeSerial, nodeData } = props;
  const [subplot, setSubplot] = useState([2]);
  const [treatment, setTreatment] = useState(["b"]);

  console.log(props.sensorData);
  const filteredSet = useMemo(() => {
    return nodeData.filter(
      (records) =>
        subplot.includes(records.subplot) &&
        records.serial === activeSerial &&
        treatment.includes(records.trt)
    );
  }, [activeSerial, nodeData, subplot, treatment]);

  const nodeSolarVoltage = useMemo(() => {
    return filteredSet.map((record) => {
      return [
        new Date(record.ts_up.split(" ").join("T")).getTime(),
        record.nd_solar_voltage,
      ];
    });
  }, [filteredSet]);

  const nodeBatteryVoltage = useMemo(() => {
    return filteredSet.map((record) => {
      return [
        new Date(record.ts_up.split(" ").join("T")).getTime(),
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
      {activeSerial ? (
        <Fragment>
          <Grid item container>
            <Grid item direction="column">
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
            <Grid item direction="column">
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
          </Grid>

          <Grid item xs={12}>
            <HighchartsReact
              highcharts={Highcharts}
              options={voltageChartOptions}
              containerProps={{ style: { height: "100%", width: "100%" } }}
            />
          </Grid>
        </Fragment>
      ) : (
        <Typography variant="h5">Please select a serial number</Typography>
      )}
    </Grid>
  );
};

export default NodeCharts;
