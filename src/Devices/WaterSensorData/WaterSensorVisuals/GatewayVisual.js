// Dependency Imports
import React, { useEffect, useState } from "react";
import Axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Grid } from "@material-ui/core";
import moment from "moment";
import PropTypes from "prop-types";

// Local Imports
import { apiUsername, apiPassword, apiURL } from "../../../utils/api_secret";

// Load Highcharts modules
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/offline-exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);

// Helper functions
const getGatewayVisialData = async (gatewayNo, token, year) => {
  //   try {
  return await Axios({
    url: `${apiURL}/api/retrieve/table/water_gateway_data/by/serialno/${gatewayNo}/${year}`,
    method: "get",
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
    cancelToken: token,
    // cancelToken: source
  });
  //   } catch (error) {}
};

// Default Function
const GatewayVisual = (props) => {
  const { gatewayNo, year } = props;
  const [loading, setLoading] = useState(false);
  const [volatageChartOptions, setVoltageChartOptions] = useState({
    chart: {
      type: "scatter",
      zoomType: "xy",
    },
    title: {
      text: "Gateway Voltage",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "Voltage",
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
        name: "Battery Voltage",
        data: [],
        tooltip: {
          pointFormat:
            "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>",
        },
      },
    ],
  });
  const [currentChartOptions, setCurrentChartOptions] = useState({
    chart: {
      type: "scatter",
      zoomType: "xy",
    },
    title: {
      text: "Gateway Solar Current",
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
        tooltip: {
          pointFormat:
            "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Current: <b>{point.y}</b><br/>",
        },
      },
    ],
  });
  const parseGatewayData = (gatewayData) => {
    // console.log("Gatewat Data", gatewayData);
    // let chartObjectFormat = {};
    let gatewayBatteryVoltage = [];
    let gatewaySolarCurrent = [];
    let gatewaySolarVoltage = [];
    // let timestamps = [];
    for (let i = 0; i < gatewayData.length; i++) {
      // let time = new Date(gatewayData[i].timestamp).getTime();

      let time = moment(gatewayData[i].timestamp).valueOf();
      // var d = new Date(gatewayData[i].timestamp);
      // let time = d.getUTCMilliseconds();

      // console.log("time", time);

      gatewayBatteryVoltage.push([
        time,
        parseFloat(gatewayData[i].gw_batt_voltage),
      ]);
      gatewaySolarCurrent.push([
        time,
        parseFloat(gatewayData[i].gw_solar_current),
      ]);
      gatewaySolarVoltage.push([
        time,
        parseFloat(gatewayData[i].gw_solar_voltage),
      ]);
    }
    return [gatewayBatteryVoltage, gatewaySolarCurrent, gatewaySolarVoltage];

    // gatewayData.map((val, index) => {
    //     val['timestamp']
    // });
  };

  useEffect(() => {
    const source = Axios.CancelToken.source();

    function init() {
      setLoading(true);

      getGatewayVisialData(gatewayNo, source.token, year)
        .then((gatewayDataObject) => {
          // console.log(gatewayDataObject);
          let batteryVoltageArray = parseGatewayData(
            gatewayDataObject.data.data
          );

          return batteryVoltageArray;
        })
        .then((bvArr) => {
          setVoltageChartOptions({
            ...volatageChartOptions,
            series: [
              {
                name: "Battery Voltage",
                data: bvArr[0],
                tooltip: {
                  pointFormat:
                    "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>",
                },
              },
              {
                name: "Solar Voltage",
                data: bvArr[2],
                tooltip: {
                  pointFormat:
                    "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>",
                },
              },
            ],
          });
          setCurrentChartOptions({
            ...currentChartOptions,
            series: [
              {
                name: "Solar Current",
                data: bvArr[1],
                tooltip: {
                  pointFormat:
                    "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Current: <b>{point.y}</b><br/>",
                },
              },
            ],
          });
        })
        .then(() => {
          setLoading(false);
        })
        .catch((e) => {
          if (Axios.isCancel(e)) {
            console.error("Request canceled,", e.message);
          } else {
            console.error(e);
          }
        });
    }

    // setTimeout(init, 300);
    init();

    return () => {
      // console.log("unmounting");
      setLoading(true);
      source.cancel("Unmounting Component");
      //   source.cancel();
    };
  }, [currentChartOptions, gatewayNo, volatageChartOptions, year]);

  return !loading ? (
    <div>
      <Grid container style={{ marginTop: "1em" }}>
        <Grid item md={6}>
          <HighchartsReact
            highcharts={Highcharts}
            options={volatageChartOptions}
            containerProps={{ style: { height: "100%", width: "100%" } }}
          />
        </Grid>
        <Grid item md={6}>
          <HighchartsReact
            highcharts={Highcharts}
            options={currentChartOptions}
            containerProps={{ style: { height: "100%", width: "100%" } }}
          />
        </Grid>
      </Grid>
    </div>
  ) : (
    ""
  );
};

export default GatewayVisual;

GatewayVisual.propTypes = {
  gatewayNo: PropTypes.any,
  year: PropTypes.any,
};
