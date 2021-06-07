import React, { useState, useEffect, useContext, useMemo } from "react";

import { Grid } from "@material-ui/core";
import { onfarmAPI } from "../../utils/api_secret";
import { useParams } from "react-router-dom";
import { Context } from "../../Store/Store";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import "highcharts/modules/no-data-to-display";
import { CustomLoader } from "../../utils/CustomComponents";
const chartOptions = {
  chart: {
    type: "scatter",
    zoomType: "xy",
    borderColor: "black",
    borderWidth: 1,
  },
  title: {
    text: `Volumetric Water Content`,
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
      text: "t_lb",
    },
    type: "logarithmic",
  },

  series: [
    {
      name: "vwc",
      data: [],
      tooltip: {
        pointFormat:
          "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Current: <b>{point.y}</b><br/>",
      },
    },
  ],
  lang: { noData: "Your custom message" },
};
const TempByLbs = () => {
  const [state] = useContext(Context);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { code, year } = useParams();

  const waterAmbientSensorDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=ambient&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31&datetimes=unix&cols=timestamp,subplot,trt,t_lb&location=true`;

  useEffect(() => {
    const setNodeData = async (apiKey) => {
      setLoading(true);
      const response = await fetch(waterAmbientSensorDataEndpoint, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      });

      const records = await response.json();
      const timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000 * 2;
      const sortedByTimestamp = records
        .sort((a, b) => a - b)
        .map((rec) => ({ ...rec, timestamp: rec.timestamp * 1000 - timeZoneOffset}));

      setData(sortedByTimestamp);
    };

    setNodeData(state.userInfo.apikey).then(() => setLoading(false));
  }, [state.userInfo.apikey, waterAmbientSensorDataEndpoint]);

  // const bareSub1Data = useMemo(() => {
  //   const filteredData = data.filter(
  //     (rec) => rec.trt === "b" && rec.subplot === 1
  //   );

  //   const val = filteredData.map((rec) => [rec.timestamp, rec.t_lb]);
  //   return {
  //     ...chartOptions,
  //     title: {
  //       text: "Litterbag Temp - Rep 1 Bare",
  //     },
  //     series: [
  //       {
  //         name: "Litterbag Temp",
  //         data: val,
  //         tooltip: {
  //           pointFormat:
  //             "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Temp: <b>{point.y}</b><br/>",
  //         },
  //       },
  //     ],
  //   };
  // }, [data]);
  // const bareSub2Data = useMemo(() => {
  //   const filteredData = data.filter(
  //     (rec) => rec.trt === "b" && rec.subplot === 2
  //   );

  //   const val = filteredData.map((rec) => [rec.timestamp, rec.t_lb]);
  //   return {
  //     ...chartOptions,
  //     title: {
  //       text: "Litterbag Temp - Rep 2 Bare",
  //     },
  //     series: [
  //       {
  //         name: "Litterbag Temp",
  //         data: val,
  //         tooltip: {
  //           pointFormat:
  //             "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Temp: <b>{point.y}</b><br/>",
  //         },
  //       },
  //     ],
  //   };
  // }, [data]);
  const coverSub1Data = useMemo(() => {
    const filteredData = data.filter(
      (rec) => rec.trt === "c" && rec.subplot === 1
    );

    const val = filteredData.map((rec) => [rec.timestamp, rec.t_lb]);
    return {
      ...chartOptions,
      title: {
        text: "Litterbag Temp - Rep 1 Cover",
      },
      series: [
        {
          name: "Litterbag Temp",
          data: val,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Temp: <b>{point.y}</b><br/>",
          },
        },
      ],
    };
  }, [data]);
  const coverSub2Data = useMemo(() => {
    const filteredData = data.filter(
      (rec) => rec.trt === "c" && rec.subplot === 2
    );

    const val = filteredData.map((rec) => [rec.timestamp, rec.t_lb]);

    return {
      ...chartOptions,
      title: {
        text: "Litterbag Temp - Rep 2 Cover",
      },
      series: [
        {
          name: "Litterbag Temp",
          data: val,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>Temp: <b>{point.y}</b><br/>",
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
          {/* <Grid item lg={6} xs={12}>
        
            <HighchartsReact highcharts={Highcharts} options={bareSub1Data} />
          </Grid> */}
          <Grid item lg={6} xs={12}>
            {/* Cover subplot 1 */}
            <HighchartsReact highcharts={Highcharts} options={coverSub1Data} />
          </Grid>
          {/* <Grid item lg={6} xs={12}>
          
            <HighchartsReact highcharts={Highcharts} options={bareSub2Data} />
          </Grid> */}
          <Grid item lg={6} xs={12}>
            {/* Cover subplot 2 */}
            <HighchartsReact highcharts={Highcharts} options={coverSub2Data} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default TempByLbs;
