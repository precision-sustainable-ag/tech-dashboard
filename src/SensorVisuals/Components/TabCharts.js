import React, { Fragment } from 'react';
import { lazy } from "react";
import { Grid, Typography} from "@material-ui/core";
// import { TabList, TabContext } from "@material-ui/lab";
import PropTypes from "prop-types";

import GatewayChart from "./GatewayChart";
const NodeVoltage = lazy(() => import("./NodeVoltage"));
const SoilTemp = lazy(() => import("./SoilTemp"));
const TempByLbs = lazy(() => import("./LitterbagTemp"));
const VolumetricWater = lazy(() => import("./VolumetricWater"));

const TabCharts = (props) => {
    let {
        gatewayData,
        activeCharts,
        // nodeData,
        tdrData,
    } = props;

    if(activeCharts === "gateway"){
        return (
            <Grid container spacing={3}>
                {(gatewayData.length > 0) ? (
                    <Grid item container spacing={4}>
                        <Grid item container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h5" align="center">
                                Node Health
                                </Typography>
                            </Grid>
                            <NodeVoltage />
                            {(gatewayData.length > 0) && (
                                <Grid item xs={12}>
                                    <GatewayChart data={gatewayData} />
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                ) : (
                    "Node data unavailable"
                )}
            </Grid>
        );
    } else if (activeCharts === "vwc") {
        return (
            <Grid container spacing={3}>
                {(tdrData.length > 0) ? (
                    <Grid item container spacing={4}>
                        <Grid item container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h5" align="center">
                                VWC
                                </Typography>
                            </Grid>
                            <VolumetricWater tdrData={tdrData} />
                        </Grid>
                    </Grid>
                ) : (
                    "VWC data unavailable"
                )}
            </Grid>
        );
    } else if (activeCharts === "temp"){
        return (
            <Grid container spacing={3}>
                {(tdrData.length > 0) ? (
                    <Grid item container spacing={4}>
                        <Grid item container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h5" align="center">
                                Soil Temperature
                                </Typography>
                            </Grid>
                            <SoilTemp tdrData={tdrData} />
                        </Grid>

                        <Grid item container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h5" align="center">
                                Litterbag Temperature
                                </Typography>
                            </Grid>
                            <TempByLbs />
                        </Grid>
                    </Grid>
                ) : (
                    "Temperature data unavailable"
                )}
            </Grid>
        );
    } else {
        return <Fragment></Fragment>;
    }
};

TabCharts.propTypes = {
    // type: PropTypes.oneOf(["watersensors", "stresscams"]).isRequired,
    // isDarkTheme: PropTypes.bool.isRequired,
    value: PropTypes.string,
    handleChange: PropTypes.func,
    gatewayData: PropTypes.array,
    activeCharts: PropTypes.string,
    nodeData: PropTypes.array,
    tdrData: PropTypes.array,
  };

export default TabCharts;
