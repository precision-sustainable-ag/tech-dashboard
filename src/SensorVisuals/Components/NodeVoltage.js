import React, { useState, useEffect, useContext, useMemo } from "react";

import { Grid, Typography } from "@material-ui/core";
import { onfarmAPI } from "../../utils/api_secret";
import { useParams } from "react-router-dom";
import { Context } from "../../Store/Store";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { CustomLoader } from "../../utils/CustomComponents";

const chartOptions = {
  time: {
    useUTC: false,
  },
  chart: {
    type: "scatter",
    zoomType: "xy",
    borderColor: "black",
    borderWidth: 1,
  },
  title: {
    text: `Node Voltage - Bare`,
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
  series: [],
};

const NodeVoltage = () => {
  const [state] = useContext(Context);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { code, year } = useParams();
  const waterNodeDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=node&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31&datetimes=unix&cols=timestamp,nd_solar_voltage,nd_batt_voltage&location=true`;

  useEffect(() => {
    const setNodeData = async (apiKey) => {
      setLoading(true);
      const response = await fetch(waterNodeDataEndpoint, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      });

      const records = await response.json();

      const sortedByTimestamp = records
        .sort((a, b) => a - b)
        .map((rec) => ({ ...rec, timestamp: rec.timestamp * 1000 }));

      setData(sortedByTimestamp);
    };

    if (!state.userInfo.apikey) return;

    setNodeData(state.userInfo.apikey).then(() => {
      setLoading(false);
    });
  }, [state.userInfo.apikey, waterNodeDataEndpoint]);

  const bareSub1Data = useMemo(() => {
    const filteredData = data.filter(
      (rec) => rec.trt === "b" && rec.subplot === 1
    );

    const battVol = filteredData.map((rec) => [
      rec.timestamp,
      rec.nd_batt_voltage,
    ]);
    const solVol = filteredData.map((rec) => [
      rec.timestamp,
      rec.nd_solar_voltage,
    ]);
    return {
      ...chartOptions,
      title: {
        text: "Node Voltage - Rep 1 Bare",
      },
      series: [
        {
          name: "Solar Voltage",
          data: solVol,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Current: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Battery Voltage",
          data: battVol,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Current: <b>{point.y}</b><br/>",
          },
        },
      ],
    };
  }, [data]);
  const bareSub2Data = useMemo(() => {
    const filteredData = data.filter(
      (rec) => rec.trt === "b" && rec.subplot === 2
    );
    const battVol = filteredData.map((rec) => [
      rec.timestamp,
      rec.nd_batt_voltage,
    ]);
    const solVol = filteredData.map((rec) => [
      rec.timestamp,
      rec.nd_solar_voltage,
    ]);
    return {
      ...chartOptions,
      title: {
        text: "Node Voltage - Rep 2 Bare",
      },
      series: [
        {
          name: "Solar Voltage",
          data: solVol,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Current: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Battery Voltage",
          data: battVol,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Current: <b>{point.y}</b><br/>",
          },
        },
      ],
    };
  }, [data]);
  const coverSub1Data = useMemo(() => {
    const filteredData = data.filter(
      (rec) => rec.trt === "c" && rec.subplot === 1
    );

    const battVol = filteredData.map((rec) => [
      rec.timestamp,
      rec.nd_batt_voltage,
    ]);
    const solVol = filteredData.map((rec) => [
      rec.timestamp,
      rec.nd_solar_voltage,
    ]);
    return {
      ...chartOptions,
      title: {
        text: "Node Voltage - Rep 1 Cover",
      },
      series: [
        {
          name: "Solar Voltage",
          data: solVol,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Current: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Battery Voltage",
          data: battVol,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Current: <b>{point.y}</b><br/>",
          },
        },
      ],
    };
  }, [data]);
  const coverSub2Data = useMemo(() => {
    const filteredData = data.filter(
      (rec) => rec.trt === "c" && rec.subplot === 2
    );

    const battVol = filteredData.map((rec) => [
      rec.timestamp,
      rec.nd_batt_voltage,
    ]);
    const solVol = filteredData.map((rec) => [
      rec.timestamp,
      rec.nd_solar_voltage,
    ]);

    return {
      ...chartOptions,
      title: {
        text: "Node Voltage - Rep 2 Cover",
      },
      series: [
        {
          name: "Solar Voltage",
          data: solVol,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Current: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Battery Voltage",
          data: battVol,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Current: <b>{point.y}</b><br/>",
          },
        },
      ],
    };
  }, [data]);

  useEffect(() => {}, []);

  //   const batteryVoltageDataBareSub1 = filteredData.map((rec) => [
  //   rec.timestamp,
  //   rec.nd_batt_voltage,
  // ]);
  // const solarVoltageDataBareSub2 = filteredData.map((rec) => [
  //   rec.timestamp,
  //   rec.nd_solar_voltage,
  // ]);
  // setBatteryVoltageData(batteryVoltageData);
  // setSolarVoltageData(solarVoltageData);
  return (
    <Grid container>
      {loading ? (
        <CustomLoader />
      ) : (
        <Grid item container spacing={2}>
          <Grid item lg={6} xs={12}>
            {/* Bare subplot 1 */}
            <HighchartsReact highcharts={Highcharts} options={bareSub1Data} />
          </Grid>
          <Grid item lg={6} xs={12}>
            {/* Cover subplot 1 */}
            <HighchartsReact highcharts={Highcharts} options={coverSub1Data} />
          </Grid>
          <Grid item lg={6} xs={12}>
            {/* Bare subplot 2 */}
            <HighchartsReact highcharts={Highcharts} options={bareSub2Data} />
          </Grid>
          <Grid item lg={6} xs={12}>
            {/* Cover subplot 2 */}
            <HighchartsReact highcharts={Highcharts} options={coverSub2Data} />
          </Grid>
        </Grid>
        // <Grid item xs={12}>
        //   {batteryVoltageData.length > 0 || solarVoltageData.length > 0 ? (
        //     <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        //   ) : (
        //     <Grid
        //       container
        //       justify="center"
        //       alignItems="center"
        //       style={{ height: "100%" }}
        //     >
        //       <Typography>No Voltage Data for {type}</Typography>
        //     </Grid>
        //   )}
        // </Grid>
      )}
    </Grid>
  );
};

export default NodeVoltage;
