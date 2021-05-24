import React, { useState, useEffect, useContext, useMemo } from "react";

import { Grid, Typography } from "@material-ui/core";
import { onfarmAPI } from "../../utils/api_secret";
import { useParams } from "react-router-dom";
import { Context } from "../../Store/Store";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { CustomLoader } from "../../utils/CustomComponents";

const chartOptions = {
  //   global: {
  //     useUTC: false,
  //   },

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
      text: "VWC",
    },
    type: "logarithmic",
  },

  series: [
    {
      name: "vwc",
      data: [],
      tooltip: {
        pointFormat:
          "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
      },
    },
  ],
};

const VolumetricWater = () => {
  const [state] = useContext(Context);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { code, year } = useParams();

  const waterSensorDataEndpoint =
    onfarmAPI +
    `/soil_moisture?type=tdr&code=${code.toLowerCase()}&start=${year}-01-01&end=${year}-12-31&datetimes=unix&cols=timestamp,vwc,subplot,trt`;
  // const chartOptions = useMemo(
  //   () => (),
  //   [vwcData, type]
  // );

  useEffect(() => {
    const setNodeData = async (apiKey) => {
      setLoading(true);
      const response = await fetch(waterSensorDataEndpoint, {
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

    setNodeData(state.userInfo.apikey).then(() => {
      setLoading(false);
    });
  }, [state.userInfo.apikey, waterSensorDataEndpoint]);

  const bareSub1Data = useMemo(() => {
    const filteredData = data.filter(
      (rec) => rec.trt === "b" && rec.subplot === 1
    );

    const topDepth = filteredData
      .filter((rec) => rec.center_depth === -15)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const middleDepth = filteredData
      .filter((rec) => rec.center_depth === -45)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const deepDepth = filteredData
      .filter((rec) => rec.center_depth === -80)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const surfaceDepth = filteredData
      .filter((rec) => rec.center_depth === -5)
      .map((rec) => [rec.timestamp, rec.vwc]);

    return {
      ...chartOptions,
      title: {
        text: "VWC - Rep 1 Bare",
      },
      series: [
        {
          name: "Top",
          data: topDepth,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Middle",
          data: middleDepth,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Deep",
          data: deepDepth,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Surface",
          data: surfaceDepth,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
          },
        },
      ],
    };
  }, [data]);
  const bareSub2Data = useMemo(() => {
    const filteredData = data.filter(
      (rec) => rec.trt === "b" && rec.subplot === 2
    );

    const topDepth = filteredData
      .filter((rec) => rec.center_depth === -15)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const middleDepth = filteredData
      .filter((rec) => rec.center_depth === -45)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const deepDepth = filteredData
      .filter((rec) => rec.center_depth === -80)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const surfaceDepth = filteredData
      .filter((rec) => rec.center_depth === -5)
      .map((rec) => [rec.timestamp, rec.vwc]);

    return {
      ...chartOptions,
      title: {
        text: "VWC - Rep 2 Bare",
      },
      series: [
        {
          name: "Top",
          data: topDepth,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Middle",
          data: middleDepth,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Deep",
          data: deepDepth,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Surface",
          data: surfaceDepth,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
          },
        },
      ],
    };
  }, [data]);
  const coverSub1Data = useMemo(() => {
    const filteredData = data.filter(
      (rec) => rec.trt === "c" && rec.subplot === 1
    );

    const topDepth = filteredData
      .filter((rec) => rec.center_depth === -15)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const middleDepth = filteredData
      .filter((rec) => rec.center_depth === -45)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const deepDepth = filteredData
      .filter((rec) => rec.center_depth === -80)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const surfaceDepth = filteredData
      .filter((rec) => rec.center_depth === -5)
      .map((rec) => [rec.timestamp, rec.vwc]);

    return {
      ...chartOptions,
      title: {
        text: "VWC - Rep 1 Cover",
      },
      series: [
        {
          name: "Top",
          data: topDepth,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Middle",
          data: middleDepth,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Deep",
          data: deepDepth,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Surface",
          data: surfaceDepth,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
          },
        },
      ],
    };
  }, [data]);
  const coverSub2Data = useMemo(() => {
    const filteredData = data.filter(
      (rec) => rec.trt === "c" && rec.subplot === 2
    );

    const topDepth = filteredData
      .filter((rec) => rec.center_depth === -15)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const middleDepth = filteredData
      .filter((rec) => rec.center_depth === -45)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const deepDepth = filteredData
      .filter((rec) => rec.center_depth === -80)
      .map((rec) => [rec.timestamp, rec.vwc]);
    const surfaceDepth = filteredData
      .filter((rec) => rec.center_depth === -5)
      .map((rec) => [rec.timestamp, rec.vwc]);

    return {
      ...chartOptions,
      title: {
        text: "VWC - Rep 2 Cover",
      },
      series: [
        {
          name: "Top",
          data: topDepth,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Middle",
          data: middleDepth,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Deep",
          data: deepDepth,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
          },
        },
        {
          name: "Surface",
          data: surfaceDepth,
          tooltip: {
            pointFormat:
              "Date: <b>{point.x:%Y-%m-%d %H:%M}</b><br/>vwc: <b>{point.y}</b><br/>",
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

export default VolumetricWater;
