import React, { useEffect, useState } from "react";
import Axios from "axios";
import { apiUsername, apiPassword, apiURL } from "../../utils/api_secret";
import { Link } from "react-router-dom";
import {
  Grid,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import { ArrowBackIosOutlined } from "@material-ui/icons";

import GatewayVisual from "./WaterSensorVisuals/GatewayVisual";
import WaterSensorByGatewayTopbar from "./WaterSensorByGatewayTopbar";
import NodeSensorVisuals from "./WaterSensorVisuals/NodeSensorVisuals";

const useStyles = makeStyles((theme) => ({
  gridList: {
    width: "100%",
    height: "50px",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  titleBar: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  },
  icon: {
    color: "white",
  },
}));

const getNodeSerialNo = async (gatewayNo, year) => {
  return await Axios({
    method: "get",
    url: `${apiURL}/api/retrieve/nodes/by/gateway/${gatewayNo}/${year}`,
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  });
};

const WaterSensorByGateway = (props) => {
  const classes = useStyles();
  const gatewayNo =
    props.location.state.gatewaysno || props.match.params.gatewayId;

  const [bareNodeSerialNo, setBareNodeSerialNo] = useState([
    props.location.state.bareNodeSerialNo || "",
  ]);
  const [coverNodeSerialNo, setCoverNodeSerialNo] = useState([
    props.location.state.bareNodeSerialNo || "",
  ]);
  const [loading, setLoading] = useState(false);
  const [activeChip, setActiveChip] = useState("");
  const [loadingNodes, setLoadingNodes] = useState(false);

  const [bareNodeObject, setBareNodeObject] = useState({});
  const [coverNodeObject, setCoverNodeObject] = useState({});
  const [year, setYear] = useState(props.location.state.year);
  //   get all nodes in the gateway, and get all sensors in each node
  //    this can be done by making a nested object here
  /* eg. gatewayNo: {
    nodeNumber: {
        sensorDataObject: {},
        nodeInfo:{}
    },
    nodeNumber:{}
}

*/

  // first lets get node serial number

  const setNodeArrays = (nodeData, resolve, reject) => {
    let bareNodeArray = [];
    let coverNodeArray = [];
    let bareNodeObject = {};
    let coverNodeObject = {};

    let innerPromise = new Promise(async (resolve, reject) => {
      for (let node in nodeData) {
        //   let i = 0;
        //   console.log(node);
        if (nodeData[node]["bare_node_serial_no"] !== null)
          if (!bareNodeArray.includes(nodeData[node]["bare_node_serial_no"])) {
            bareNodeArray.push(nodeData[node]["bare_node_serial_no"]);
          }
        if (nodeData[node]["cover_node_serial_no"] !== null)
          if (
            !coverNodeArray.includes(nodeData[node]["cover_node_serial_no"])
          ) {
            coverNodeArray.push(nodeData[node]["cover_node_serial_no"]);
          }
        //   i++;
      }
      setBareNodeSerialNo(bareNodeArray);
      setCoverNodeSerialNo(coverNodeArray);

      for (let nodeSerialNo in bareNodeArray) {
        bareNodeObject[bareNodeArray[nodeSerialNo]] = false;
      }
      setBareNodeObject(bareNodeObject);
      for (let nodeSerialNo in coverNodeArray) {
        coverNodeObject[coverNodeArray[nodeSerialNo]] = false;
      }
      setCoverNodeObject(coverNodeObject);
      // setBareNodeSerialNo(bareNodeArray);
      if (bareNodeArray.length > 0) resolve(bareNodeArray[0]);
      else if (coverNodeArray.length > 0) resolve(coverNodeArray[0]);
      else resolve(null);
    });

    innerPromise.then((val) => {
      //   set active chip to first bare/cover node serial number
      console.log("bareNodeSerialNo.length", val);
      resolve(setActiveChip(val));
    });
  };
  useEffect(() => {
    setLoading(true);
    let nodeSerialNosPromise = getNodeSerialNo(
      gatewayNo,
      props.location.state.year
    );

    nodeSerialNosPromise
      .then((nodesObject) => {
        if (nodesObject.data.status === "success") {
          let nodeData = nodesObject.data.data;
          let promise = new Promise((resolve, reject) => {
            setNodeArrays(nodeData, resolve, reject);
            setLoading(false);
            // return promise;
          });

          promise.then(() => {
            // console.log('Promise resolved');
          });
        }
      })
      .then(() => {
        // console.log(coverNodeObject);
      });
  }, []);

  useEffect(() => {
    setLoadingNodes(!loadingNodes);
  }, [activeChip]);

  return !loading ? (
    <div>
      <GridList spacing={1} className={classes.gridList}>
        <GridListTile key={gatewayNo} style={{ width: "100%", height: "50px" }}>
          <GridListTileBar
            title={"All Farm Codes"}
            style={{
              zIndex: "999",
            }}
            titlePosition="top"
            actionIcon={
              <Link to="/water-sensors">
                <IconButton
                  aria-label={`Back`}
                  tooltip="Back"
                  className={classes.icon}
                  to="/water-sensors"
                >
                  <ArrowBackIosOutlined />
                </IconButton>
              </Link>
            }
            actionPosition="left"
            className={classes.titleBar}
          />
        </GridListTile>
      </GridList>
      <Grid container style={{ marginTop: "2em" }}>
        <Grid item xs={12}>
          <GatewayVisual gatewayNo={gatewayNo} year={year} />
        </Grid>
      </Grid>

      <Grid container style={{ marginTop: "2em" }}>
        <Grid item md={12}>
          <WaterSensorByGatewayTopbar
            bareNodes={bareNodeSerialNo}
            coverNodes={coverNodeSerialNo}
            activeChip={activeChip}
            setActiveChip={setActiveChip}
            year={props.location.state.year}
            loadingNodes={loadingNodes}
            setLoadingNodes={setLoadingNodes}
          />
        </Grid>
        <Grid item md={12}>
          <NodeSensorVisuals
            bareNodeSerialNo={bareNodeSerialNo}
            coverNodeSerialNo={coverNodeSerialNo}
            activeChip={activeChip}
            chartWidth={12}
            year={props.location.state.year}
            loadingNodes={loadingNodes}
            setLoadingNodes={setLoadingNodes}
          />
        </Grid>
      </Grid>
    </div>
  ) : (
    "Loading..."
  );
};

export default WaterSensorByGateway;
