import React from "react";
// import ReactDOM from "react-dom";
import { VictoryPie, VictoryTooltip } from "victory";

import "./TaskPieChart.css";

const data = [{ x: "-1", y: 5}, { x: "0", y: 25 }, { x: "1", y: 50 }];

export default class TaskPieChart extends React.Component {
  render() {
    return (
<VictoryPie
  data={data}
  labelComponent={<VictoryTooltip />}
  colorScale={["red", "yellow", "green"]}
/>
    );
  }
}
