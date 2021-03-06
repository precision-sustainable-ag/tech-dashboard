import { Button, Grid, Paper, Toolbar } from "@material-ui/core";
import { GpsFixed } from "@material-ui/icons";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useMemo } from "react";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: "flex",
//     justifyContent: "center",
//     flexWrap: "wrap",
//     listStyle: "none",
//     padding: theme.spacing(0.5),
//     margin: 0,
//   },
// }));
const GatewayChart = (props) => {
  const { data } = props;

  const serials = data.map((r) => r.serial);
  const uniqueSerials = [...new Set(serials)];

  const gwBattVol = useMemo(() => {
    return data.map((record) => {
      return [
        new Date(record.timestamp.split(" ").join("T")).getTime(),
        record.gw_batt_voltage,
      ];
    });
  }, [data]);
  const gwSolarCurr = useMemo(() => {
    return data.map((record) => {
      return [
        new Date(record.timestamp.split(" ").join("T")).getTime(),
        record.gw_solar_current,
      ];
    });
  }, [data]);

  const gwSolarVol = useMemo(() => {
    return data.map((record) => {
      return [
        new Date(record.timestamp.split(" ").join("T")).getTime(),
        record.gw_solar_voltage,
      ];
    });
  }, [data]);

  const gwEnclTemp = useMemo(() => {
    return data.map((record) => {
      return [
        new Date(record.timestamp.split(" ").join("T")).getTime(),
        record.gw_enclosure_temp,
      ];
    });
  }, [data]);

  const gwTowerSigStr = useMemo(() => {
    return data.map((record) => {
      return [
        new Date(record.timestamp.split(" ").join("T")).getTime(),
        record.tower_signal_strength,
      ];
    });
  }, [data]);

  const chartOptions = {
    time: {
      timezoneOffset: new Date().getTimezoneOffset() * 2,
    },
    chart: {
      type: "scatter",
      zoomType: "xy",
      borderColor: "black",
      borderWidth: 1,
    },
    title: {
      text: "Gateway Data",
    },
    subtitle: {
      text: "Serial: " + uniqueSerials.toString(),
    },
    xAxis: {
      type: "datetime",
      startOnTick: true,
      endOnTick: true,
      showLastLabel: false,
      showFirstLabel: false,
    },
    yAxis: {
      //   title: {
      //     text: "Current",
      //   },
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
        name: "Solar Current",
        data: gwSolarCurr,
        tooltip: {
          pointFormat:
            "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Current: <b>{point.y}</b><br/>",
        },
      },
      {
        name: "Solar Voltage",
        data: gwSolarVol,
        tooltip: {
          pointFormat:
            "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>",
        },
      },
      {
        name: "Battery Voltage",
        data: gwBattVol,
        tooltip: {
          pointFormat:
            "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Temp: <b>{point.y}</b><br/>",
        },
      },
      {
        name: "Enclosure Temp",
        data: gwEnclTemp,
        tooltip: {
          pointFormat:
            "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Temp: <b>{point.y}</b><br/>",
        },
      },
      {
        name: "Tower Signal Strength",
        data: gwTowerSigStr,
        tooltip: {
          pointFormat:
            "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Temp: <b>{point.y}</b><br/>",
        },
      },
    ],
  };

  // const classes = useStyles();
  return (
    <Grid container>
      <Grid item container xs={12} spacing={2} alignItems="center">
        {data[0].bare_lat && (
          <Grid item xs={12}>
            <Paper>
              <Toolbar>
                <Button
                  size="small"
                  target="_blank"
                  href={`https://maps.google.com/?t=h&z=21&q=${data[0].bare_lat},${data[0].bare_lon}`}
                >
                  <GpsFixed />
                  &nbsp; Bare
                </Button>
                <Button
                  size="small"
                  target="_blank"
                  href={`https://maps.google.com/?t=h&z=21&q=${data[0].cover_lat},${data[0].cover_lon}`}
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
            containerProps={{ style: { height: "100%", width: "100%" } }}
          />
        </Grid>
        {/* {serials.map((serial, index) => (
          <Grid item key={index}>
            <Chip label={} />
          </Grid>
        ))} */}
      </Grid>
    </Grid>
  );
};

GatewayChart.defaultProps = {
  code: "VMF",
  serials: {
    sensor: [],
    gateway: [],
    node: [],
    ambient: [],
  },
  data: [],
};

export default GatewayChart;
