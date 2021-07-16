import React, { useState, useEffect, useContext, useMemo } from "react";

import { Grid } from "@material-ui/core";
import { onfarmAPI } from "../../utils/api_secret";
import { useParams } from "react-router-dom";
import { Context } from "../../Store/Store";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { CustomLoader } from "../../utils/CustomComponents";

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
    text: `Node Health - `,
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
    type: "linear",
  },
  series: [
    {
      name: "Solar Voltage",
      data: [],
    },
    {
      name: "Battery Voltage",
      data: [],
    },
    {
      name: "Signal Strength",
      data: [],
    },
  ],
};

const NodeVoltage = () => {
  const [state] = useContext(Context);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { code, year } = useParams();
  const waterNodeDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=node&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31&datetimes=unix&cols=node_serial_no,serial,trt,subplot,timestamp,nd_solar_voltage,nd_batt_voltage,signal_strength&location=true`;

  useEffect(() => {
    const setNodeData = async (apiKey) => {
      setLoading(true);
      try {
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
        // console.log(sortedByTimestamp);
      } catch (e) {
        console.error(e);
        // setLoading(false);

        // throw new Error(e);
      }
    };

    if (!state.userInfo.apikey) return;

    setNodeData(state.userInfo.apikey).then(() => {
      setLoading(false);
    });
    return () => {};
  }, [state.userInfo.apikey, waterNodeDataEndpoint]);

  const bareSub1Data = useMemo(() => {
    const filteredData = data.filter(
      (rec) => rec.trt === "b" && rec.subplot === 1
    );
    const serials = filteredData.map((r) => r.serial);
    const uniqueSerials = [...new Set(serials)];

    const battVol = filteredData.map((rec) => [
      rec.timestamp,
      rec.nd_batt_voltage,
    ]);
    const solVol = filteredData.map((rec) => [
      rec.timestamp,
      rec.nd_solar_voltage,
    ]);
    const sigStr = filteredData.map((rec) => [
      rec.timestamp,
      rec.signal_strength / 20,
    ]);
    return {
      ...chartOptions,
      title: {
        text: chartOptions.title.text + "Rep 1 Bare",
      },
      subtitle: {
        text: "Serial: " + uniqueSerials.toString(),
      },
      series: [
        {
          name: "Solar Voltage",
          data: solVol,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Battery Voltage",
          data: battVol,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Signal Strength",
          data: sigStr,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Strength: <b>{point.y}</b><br/>",
          },
        },
      ],
    };
  }, [data]);
  const bareSub2Data = useMemo(() => {
    const filteredData = data.filter(
      (rec) => rec.trt === "b" && rec.subplot === 2
    );

    const serials = filteredData.map((r) => r.serial);
    const uniqueSerials = [...new Set(serials)];

    const battVol = filteredData.map((rec) => [
      rec.timestamp,
      rec.nd_batt_voltage,
    ]);
    const solVol = filteredData.map((rec) => [
      rec.timestamp,
      rec.nd_solar_voltage,
    ]);
    const sigStr = filteredData.map((rec) => [
      rec.timestamp,
      rec.signal_strength / 20,
    ]);
    return {
      ...chartOptions,
      title: {
        text: chartOptions.title.text + "Rep 2 Bare",
      },
      subtitle: {
        text: "Serial: " + uniqueSerials.toString(),
      },
      series: [
        {
          name: "Solar Voltage",
          data: solVol,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Battery Voltage",
          data: battVol,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Signal Strength",
          data: sigStr,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Strength: <b>{point.y}</b><br/>",
          },
        },
      ],
    };
  }, [data]);
  const coverSub1Data = useMemo(() => {
    const filteredData = data.filter(
      (rec) => rec.trt === "c" && rec.subplot === 1
    );

    const serials = filteredData.map((r) => r.serial);
    const uniqueSerials = [...new Set(serials)];

    const battVol = filteredData.map((rec) => [
      rec.timestamp,
      rec.nd_batt_voltage,
    ]);
    const solVol = filteredData.map((rec) => [
      rec.timestamp,
      rec.nd_solar_voltage,
    ]);
    const sigStr = filteredData.map((rec) => [
      rec.timestamp,
      rec.signal_strength / 20,
    ]);
    return {
      ...chartOptions,
      title: {
        text: chartOptions.title.text + "Rep 1 Cover",
      },
      subtitle: {
        text: "Serial: " + uniqueSerials.toString(),
      },
      series: [
        {
          name: "Solar Voltage",
          data: solVol,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Battery Voltage",
          data: battVol,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Signal Strength",
          data: sigStr,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Strength: <b>{point.y}</b><br/>",
          },
        },
      ],
    };
  }, [data]);

  const coverSub2Data = useMemo(() => {
    const filteredData = data.filter(
      (rec) => rec.trt === "c" && rec.subplot === 2
    );

    const serials = filteredData.map((r) => r.serial);
    const uniqueSerials = [...new Set(serials)];

    const battVol = filteredData.map((rec) => [
      rec.timestamp,
      rec.nd_batt_voltage,
    ]);
    const solVol = filteredData.map((rec) => [
      rec.timestamp,
      rec.nd_solar_voltage,
    ]);
    const sigStr = filteredData.map((rec) => [
      rec.timestamp,
      rec.signal_strength / 20,
    ]);
    return {
      ...chartOptions,
      title: {
        text: chartOptions.title.text + "Rep 2 Cover",
      },
      subtitle: {
        text: "Serial: " + uniqueSerials.toString(),
      },
      series: [
        {
          name: "Solar Voltage",
          data: solVol,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Battery Voltage",
          data: battVol,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Voltage: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Signal Strength",
          data: sigStr,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Strength: <b>{point.y}</b><br/>",
          },
        },
      ],
    };
  }, [data]);

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
      )}
    </Grid>
  );
};

export default NodeVoltage;
