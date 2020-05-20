import React, { useEffect, useState } from "react";
import Axios from "axios";
import { apiUsername, apiPassword, apiURL } from "../../../utils/api_secret";
import Highcharts from "highcharts";

import HighchartsReact from "highcharts-react-official";
import { Grid } from "@material-ui/core";

// Load Highcharts modules
require("highcharts/modules/exporting")(Highcharts);

const getGatewayVisialData = async (gatewayNo, source) => {
  //   try {
  return await Axios({
    url: `${apiURL}/api/retrieve/table/water_gateway_data/by/serialno/${gatewayNo}`,
    method: "get",
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
    // cancelToken: source
  });
  //   } catch (error) {}
};

const GatewayVisual = (props) => {
  const gatewayNo = props.gatewayNo;
  const [gatewayData, setGatewayData] = useState({});
  const [loading, setLoading] = useState(false);
  const [volatageChartOptions, setVoltageChartOptions] = useState({
    title: {
      text: "Gateway Voltage",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "Volage",
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
      },
    ],
  });
  const [currentChartOptions, setCurrentChartOptions] = useState({
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
  const parseGatewayData = (gatewayData) => {
    // console.log("Gatewat Data", gatewayData);
    // let chartObjectFormat = {};
    let gatewayBatteryVoltage = [];
    let gatewaySolarCurrent = [];
    let gatewaySolarVoltage = [];
    // let timestamps = [];
    for (let i = 0; i < gatewayData.length; i++) {
      let time = new Date(gatewayData[i].timestamp).getTime();
      //   console.log("time", time);
      gatewayBatteryVoltage.push([
        time,
        parseFloat(gatewayData[i].gw_batt_voltage / 1000),
      ]);
      gatewaySolarCurrent.push([
        time,
        parseFloat(gatewayData[i].gw_solar_current),
      ]);
      gatewaySolarVoltage.push([
        time,
        parseFloat(gatewayData[i].gw_solar_voltage / 1000),
      ]);
    }
    return [gatewayBatteryVoltage, gatewaySolarCurrent, gatewaySolarVoltage];

    // gatewayData.map((val, index) => {
    //     val['timestamp']
    // });
  };

  useEffect(() => {
    setLoading(true);
    let source = Axios.CancelToken.source();
    getGatewayVisialData(gatewayNo, source)
      .then((gatewayDataObject) => {
        // console.log(gatewayDataObject);
        let batteryVoltageArray = parseGatewayData(gatewayDataObject.data.data);

        return batteryVoltageArray;
      })
      .then((bvArr) => {
        setVoltageChartOptions({
          ...volatageChartOptions,
          series: [
            {
              name: "Battery Voltage",
              data: bvArr[0],
            },
            // {
            //   name: "Solar Current",
            //   data: bvArr[1]
            // },
            {
              name: "Solar Voltage",
              data: bvArr[2],
            },
          ],
        });
        setCurrentChartOptions({
          ...currentChartOptions,
          series: [
            {
              name: "Solar Current",
              data: bvArr[1],
            },
          ],
        });
      })
      .then(() => {
        setLoading(false);
      });

    return () => {
      console.log("unmounting");
      //   source.cancel();
    };
  }, [
    volatageChartOptions.series[0].data.length,
    currentChartOptions.series[0].data.length,
  ]);

  return !loading ? (
    <div>
      <Grid container>
        <Grid item md={6}>
          <HighchartsReact
            highcharts={Highcharts}
            options={volatageChartOptions}
          />
        </Grid>
        <Grid item md={6}>
          <HighchartsReact
            highcharts={Highcharts}
            options={currentChartOptions}
          />
        </Grid>
      </Grid>
    </div>
  ) : (
    ""
  );
};

export default GatewayVisual;
