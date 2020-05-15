import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Grid, Typography } from "@material-ui/core";
import Axios from "axios";
import { apiUsername, apiPassword } from "../../../utils/api_secret";

// Load Highcharts modules
require("highcharts/modules/exporting")(Highcharts);

const styles = {
  chartStyle: {
    height: "400px",
    maxHeight: "400px",
  },
};

const fetchBareNodeData = async (nodeSerialNo) => {
  return await Axios({
    url: `https://techdashboard.tk/api/retrieve/table/water_node_data/by/node/${nodeSerialNo}`,
    method: "get",
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  });
};

const fetchNodeSensorData = async (nodeSerialNo) => {
  return await Axios({
    url: `https://techdashboard.tk/api/retrieve/table/water_sensor_data/by/node/${nodeSerialNo}`,
    method: "get",
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  });
};

const NodeSensorVisual = (props) => {
  //NOTE:   lets assume for now that the above array length == 1
  const bareNodeSerialNo = props.bareNodeSerialNo;
  const coverNodeSerialNo = props.coverNodeSerialNo;
  // this should be between 1 to 12
  const chartWidth = props.chartWidth || 12;
  const [nodeData, setNodeData] = useState({});
  const [coverNodeData, setCoverNodeData] = useState({});
  const [volatageChartOptions, setVoltageChartOptions] = useState({
    title: {
      text: "Node Voltage",
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
      text: "Node Solar Current",
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

  const [signalStrengthChartOptions, setSignalStrengthChartOptions] = useState({
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

  const [centerDepthChartOptions, setCenterDepthChartOptions] = useState({
    title: {
      text: "Sensor Center Depth",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "Depth",
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
        name: "Sensor Depth",
        data: [],
      },
    ],
  });

  const [soilTempChartOptions, setSoilTempChartOptions] = useState({
    title: {
      text: "Sensor Soil Temperature",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "Temperature",
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
        name: "Soil Temperature",
        data: [],
      },
    ],
  });

  const [vwcChartOptions, setVwcChartOptions] = useState({
    title: {
      text: "Volumetric Water Content",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "VWC (%)",
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
        name: "VWC",
        data: [],
      },
    ],
  });

  const [permittivityChartOptions, setPermittivityChartOptions] = useState({
    title: {
      text: "Permittivity",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "Permittivity",
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
        name: "Permittivity",
        data: [],
      },
    ],
  });

  const [ecBulkChartOptions, setEcBulkChartOptions] = useState({
    title: {
      text: "EC Bulk",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "EC",
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
        name: "EC Bulk",
        data: [],
      },
    ],
  });

  const [ecPoreWaterChartOptions, setEcPoreWaterChartOptions] = useState({
    title: {
      text: "EC Pore Water",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "EC Pore Water",
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
        name: "EC Pore Water",
        data: [],
      },
    ],
  });

  const parseNodeSensorData = (sensorData) => {
    let centerDepth = { a: [], b: [], c: [] };
    let soilTemp = { a: [], b: [], c: [] };
    let vwc = { a: [], b: [], c: [] };
    let permittivity = { a: [], b: [], c: [] };
    let ecBulk = { a: [], b: [], c: [] };
    let ecPoreWater = { a: [], b: [], c: [] };

    for (let i = 0; i < sensorData.length; i++) {
      let time = new Date(sensorData[i].timestamp).getTime();

      if (
        sensorData[i].tdr_address === "A" ||
        sensorData[i].tdr_address === "a"
      ) {
        centerDepth.a.push([time, parseFloat(sensorData[i].center_depth)]);
        soilTemp.a.push([time, parseFloat(sensorData[i].soil_temp)]);
        vwc.a.push([time, parseFloat(sensorData[i].vwc)]);
        permittivity.a.push([time, parseFloat(sensorData[i].permittivity)]);
        ecBulk.a.push([time, parseFloat(sensorData[i].ec_bulk)]);
        ecPoreWater.a.push([time, parseFloat(sensorData[i].ec_pore_water)]);
      } else if (
        sensorData[i].tdr_address === "B" ||
        sensorData[i].tdr_address === "b"
      ) {
        centerDepth.b.push([time, parseFloat(sensorData[i].center_depth)]);
        soilTemp.b.push([time, parseFloat(sensorData[i].soil_temp)]);
        vwc.b.push([time, parseFloat(sensorData[i].vwc)]);
        permittivity.b.push([time, parseFloat(sensorData[i].permittivity)]);
        ecBulk.b.push([time, parseFloat(sensorData[i].ec_bulk)]);
        ecPoreWater.b.push([time, parseFloat(sensorData[i].ec_pore_water)]);
      } else if (
        sensorData[i].tdr_address === "C" ||
        sensorData[i].tdr_address === "c"
      ) {
        centerDepth.c.push([time, parseFloat(sensorData[i].center_depth)]);
        soilTemp.c.push([time, parseFloat(sensorData[i].soil_temp)]);
        vwc.c.push([time, parseFloat(sensorData[i].vwc)]);
        permittivity.c.push([time, parseFloat(sensorData[i].permittivity)]);
        ecBulk.c.push([time, parseFloat(sensorData[i].ec_bulk)]);
        ecPoreWater.c.push([time, parseFloat(sensorData[i].ec_pore_water)]);
      } else {
        // centerDepth.push([time, parseFloat(sensorData[i].center_depth)]);
        // soilTemp.push([time, parseFloat(sensorData[i].soil_temp)]);
        // vwc.push([time, parseFloat(sensorData[i].vwc)]);
        // permittivity.push([time, parseFloat(sensorData[i].permittivity)]);
        // ecBulk.push([time, parseFloat(sensorData[i].ec_bulk)]);
        // ecPoreWater.push([time, parseFloat(sensorData[i].ec_pore_water)]);
      }
    }

    return [centerDepth, soilTemp, vwc, permittivity, ecBulk, ecPoreWater];
  };

  const parseNodeData = (nodeData) => {
    // console.log("Node Data", nodeData);
    // let chartObjectFormat = {};
    let nodeBatteryVoltage = [];
    let nodeSolarCurrent = [];
    let nodeSolarVoltage = [];
    let nodeSignalStrength = [];

    // let timestamps = [];
    for (let i = 0; i < nodeData.length; i++) {
      let time = new Date(nodeData[i].timestamp).getTime();
      //   console.log("time", time);
      nodeBatteryVoltage.push([time, parseFloat(nodeData[i].nd_batt_voltage)]);
      nodeSolarCurrent.push([time, parseFloat(nodeData[i].nd_solar_current)]);
      nodeSolarVoltage.push([time, parseFloat(nodeData[i].nd_solar_voltage)]);
      if (nodeData[i].signal_strength === null) {
        nodeSignalStrength.push([time, null]);
      } else {
        nodeSignalStrength.push([
          time,
          parseFloat(nodeData[i].signal_strength),
        ]);
      }
    }
    return [
      nodeBatteryVoltage.sort(),
      nodeSolarCurrent.sort(),
      nodeSolarVoltage.sort(),
      nodeSignalStrength.sort(),
    ];

    // gatewayData.map((val, index) => {
    //     val['timestamp']
    // });
  };

  useEffect(() => {
    if (props.activeChip.length > 0) {
      console.log("bareNodeSerialNo: ", props.activeChip);
      fetchBareNodeData(props.activeChip)
        .then((activeChipObj) => {
          // console.log(bareNodeObj.data.data);
          // setBareNodeData(bareNodeObj.data.data);
          let nodeDataArray = parseNodeData(activeChipObj.data.data);
          return nodeDataArray;
        })
        .then((nodeArr) => {
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
              },
              {
                name: "Solar Voltage",
                data: nodeArr[2],
              },
            ],
          });

          setCurrentChartOptions({
            ...currentChartOptions,
            series: [
              {
                name: "Solar Current",
                data: nodeArr[1],
              },
            ],
          });

          setSignalStrengthChartOptions({
            ...signalStrengthChartOptions,
            series: [
              {
                name: "Signal Strength",
                data: nodeArr[3],
              },
            ],
          });
        })
        .then(() => {
          // fetch sensor data for active node
          fetchNodeSensorData(props.activeChip)
            .then((activeChipObj) => {
              let nodeSensorDataArray = parseNodeSensorData(
                activeChipObj.data.data
              );
              return nodeSensorDataArray;
            })
            .then((sensorArr) => {
              // centerDepth, soilTemp, vwc, permittivity, ecBulk, ecPoreWater
              setCenterDepthChartOptions({
                ...centerDepthChartOptions,
                // chart: {
                //   type: "scatter",
                //   zoomType: "xy",
                // },
                series: [
                  {
                    name: "Top Depth",
                    data: sensorArr[0].a,
                  },
                  {
                    name: "Middle Depth",
                    data: sensorArr[0].b,
                  },
                  {
                    name: "Deep Depth",
                    data: sensorArr[0].c,
                  },
                ],
              });

              //   console.log(sensorArr[1]);
              setSoilTempChartOptions({
                ...soilTempChartOptions,
                // chart: {
                //   type: "scatter",
                //   zoomType: "xy",
                // },
                series: [
                  {
                    name: "Top Depth",
                    data: sensorArr[1].a,
                  },
                  {
                    name: "Middle Depth",
                    data: sensorArr[1].b,
                  },
                  {
                    name: "Deep Depth",
                    data: sensorArr[1].c,
                  },
                ],
              });
              setVwcChartOptions({
                ...vwcChartOptions,
                // chart: {
                //   type: "scatter",
                //   zoomType: "xy",
                // },
                series: [
                  {
                    name: "Top Depth",
                    data: sensorArr[2].a,
                  },
                  {
                    name: "Middle Depth",
                    data: sensorArr[2].b,
                  },
                  {
                    name: "Deep Depth",
                    data: sensorArr[2].c,
                  },
                ],
              });
              setPermittivityChartOptions({
                ...permittivityChartOptions,
                // chart: {
                //   type: "scatter",
                //   zoomType: "xy",
                // },
                series: [
                  {
                    name: "Top Depth",
                    data: sensorArr[3].a,
                  },
                  {
                    name: "Middle Depth",
                    data: sensorArr[3].b,
                  },
                  {
                    name: "Deep Depth",
                    data: sensorArr[3].c,
                  },
                ],
              });

              setEcBulkChartOptions({
                ...ecBulkChartOptions,
                // chart: {
                //   type: "scatter",
                //   zoomType: "xy",
                // },
                series: [
                  {
                    name: "Top Depth",
                    data: sensorArr[4].a,
                  },
                  {
                    name: "Middle Depth",
                    data: sensorArr[4].b,
                  },
                  {
                    name: "Deep Depth",
                    data: sensorArr[4].c,
                  },
                ],
              });

              setEcPoreWaterChartOptions({
                ...ecPoreWaterChartOptions,
                // chart: {
                //   type: "scatter",
                //   zoomType: "xy",
                // },
                series: [
                  {
                    name: "Top Depth",
                    data: sensorArr[5].a,
                  },
                  {
                    name: "Middle Depth",
                    data: sensorArr[5].b,
                  },
                  {
                    name: "Deep Depth",
                    data: sensorArr[5].c,
                  },
                ],
              });
            });
        });
    }
  }, [props.activeChip]);

  return (
    <div>
      {props.activeChip.length > 0 ? (
        <div>
          <Grid container>
            <Grid item md={12}>
              <Typography variant="h5" align="center">
                Node Data for {props.activeChip}
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              item
              md={chartWidth}
              // style={chartWidth < 12 ? styles.chartStyle : ""}
            >
              <HighchartsReact
                highcharts={Highcharts}
                options={volatageChartOptions}
              />
            </Grid>
            <Grid
              item
              md={chartWidth}
              // style={chartWidth < 12 ? styles.chartStyle : ""}
            >
              <HighchartsReact
                highcharts={Highcharts}
                options={currentChartOptions}
              />
            </Grid>
            <Grid
              item
              md={chartWidth}
              // style={chartWidth < 12 ? styles.chartStyle : ""}
            >
              <HighchartsReact
                highcharts={Highcharts}
                options={signalStrengthChartOptions}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              item
              md={chartWidth}
              // style={chartWidth < 12 ? styles.chartStyle : ""}
            >
              <HighchartsReact
                highcharts={Highcharts}
                options={soilTempChartOptions}
              />
            </Grid>
            <Grid
              item
              md={chartWidth}
              // style={chartWidth < 12 ? styles.chartStyle : ""}
            >
              <HighchartsReact
                highcharts={Highcharts}
                options={centerDepthChartOptions}
              />
            </Grid>

            <Grid
              item
              md={chartWidth}
              // style={chartWidth < 12 ? styles.chartStyle : ""}
            >
              <HighchartsReact
                highcharts={Highcharts}
                options={vwcChartOptions}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              item
              md={chartWidth}
              // style={chartWidth < 12 ? styles.chartStyle : ""}
            >
              <HighchartsReact
                highcharts={Highcharts}
                options={permittivityChartOptions}
              />
            </Grid>
            <Grid
              item
              md={chartWidth}
              // style={chartWidth < 12 ? styles.chartStyle : ""}
            >
              <HighchartsReact
                highcharts={Highcharts}
                options={ecBulkChartOptions}
              />
            </Grid>
            <Grid
              item
              md={chartWidth}
              // style={chartWidth < 12 ? {return (styles.chartStyle);} : ""}
            >
              <HighchartsReact
                highcharts={Highcharts}
                options={ecPoreWaterChartOptions}
              />
            </Grid>
          </Grid>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default NodeSensorVisual;
