/* eslint-disable */
import React, { useState } from 'react';
import { Grid, Box, Tab, Typography } from "@material-ui/core";
import { TabList, TabContext } from "@material-ui/lab";
import { useHistory } from "react-router-dom";
import CPUHealthChart from './CPUHealthChart';
import SDSpaceChart from './SDSpaceChart';
import ProbabilitiesChart from './ProbabilitiesChart';

const StressCamVisuals = (/* props */) => {
    const history = useHistory();
    const originalData = history.location.state.data;
    const [value, setValue] = useState("1");
    // const [data, setData] = useState(history.location.state.data);
    let rep1CoverData = originalData.filter(ele => ele.rep === 1 && ele.trt === 'cover');
    let rep2CoverData = originalData.filter(ele => ele.rep === 2 && ele.trt === 'cover');
    let rep1BareData = originalData.filter(ele => ele.rep === 1 && ele.trt === 'bare');
    let rep2BareData = originalData.filter(ele => ele.rep === 2 && ele.trt === 'bare');

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                          <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="CPU Health Charts" value="1" />
                            <Tab label="SD Space Charts" value="2" />
                            <Tab label="Probability Charts" value="3" />
                          </TabList>
                      </Box>
                    </TabContext>
                </Box>
            </Grid>
            <Grid item xs={12}>
                {value === '1' && 
                    <Grid item>
                        <Typography variant="h5" gutterBottom align="center">
                            CPU Health for Cover Rep 1
                        </Typography>
                        {rep1CoverData.length > 0 ? 
                            <CPUHealthChart data={rep1CoverData} /> : 
                            <>Sorry, no data available!</>}
                    </Grid>
                }
                {value === '2' && 
                    <Grid item>
                        <Typography variant="h5" gutterBottom align="center">
                            SD Free Space for Cover Rep 1
                        </Typography>
                        {rep1CoverData.length > 0 ? 
                            <SDSpaceChart data={rep1CoverData} /> : 
                            <>Sorry, no data available!</>}
                    </Grid>
                }
                {value === '3' && 
                    <Grid item>
                        <Typography variant="h5" gutterBottom align="center">
                            Probabilities for Cover Rep 1
                        </Typography>
                        {rep1CoverData.length > 0 ? 
                            <ProbabilitiesChart data={rep1CoverData} /> : 
                            <>Sorry, no data available!</>}
                    </Grid>
                }
            </Grid>
            <Grid item xs={12}>
                {value === '1' && 
                    <Grid item>
                        <Typography variant="h5" gutterBottom align="center">
                            CPU Health for Cover Rep 2
                        </Typography>
                        {rep2CoverData.length > 0 ? 
                            <CPUHealthChart data={rep2CoverData} /> : 
                            <>Sorry, no data available!</>}
                    </Grid>
                }
                {value === '2' && 
                    <Grid item>
                        <Typography variant="h5" gutterBottom align="center">
                            SD Free Space for Cover Rep 2
                        </Typography>
                        {rep2CoverData.length > 0 ? 
                            <SDSpaceChart data={rep2CoverData} /> : 
                            <>Sorry, no data available!</>}
                    </Grid>
                }
                {value === '3' && 
                    <Grid item>
                        <Typography variant="h5" gutterBottom align="center">
                            Probabilities for Cover Rep 2
                        </Typography>
                        {rep2CoverData.length > 0 ? 
                            <ProbabilitiesChart data={rep2CoverData} /> : 
                            <>Sorry, no data available!</>}
                    </Grid>
                }
            </Grid>
            <Grid item xs={12}>
                {value === '1' && 
                    <Grid item>
                        <Typography variant="h5" gutterBottom align="center">
                            CPU Health for Bare Rep 1
                        </Typography>
                        {rep1BareData.length > 0 ? 
                            <CPUHealthChart data={rep1BareData} /> : 
                            <>Sorry, no data available!</>}
                    </Grid>
                }
                {value === '2' && 
                    <Grid item>
                        <Typography variant="h5" gutterBottom align="center">
                            SD Free Space for Bare Rep 1
                        </Typography>
                        {rep1BareData.length > 0 ? 
                            <SDSpaceChart data={rep1BareData} /> : 
                            <>Sorry, no data available!</>}
                    </Grid>
                }
                {value === '3' && 
                    <Grid item>
                        <Typography variant="h5" gutterBottom align="center">
                            Probabilities for Bare Rep 1
                        </Typography>
                        {rep1BareData.length > 0 ? 
                            <ProbabilitiesChart data={rep1BareData} /> : 
                            <>Sorry, no data available!</>}
                    </Grid>
                }
            </Grid>
            <Grid item xs={12}>
                {value === '1' && 
                    <Grid item>
                        <Typography variant="h5" gutterBottom align="center">
                            CPU Health for Bare Rep 2
                        </Typography>
                        {rep2BareData.length > 0 ? 
                            <CPUHealthChart data={rep2BareData} /> : 
                            <>Sorry, no data available!</>}
                    </Grid>
                }
                {value === '2' && 
                    <Grid item>
                        <Typography variant="h5" gutterBottom align="center">
                            SD Free Space for Bare Rep 2
                        </Typography>
                        {rep2BareData.length > 0 ? 
                            <SDSpaceChart data={rep2BareData} /> : 
                            <>Sorry, no data available!</>}
                    </Grid>
                }
                {value === '3' && 
                    <Grid item>
                        <Typography variant="h5" gutterBottom align="center">
                            Probabilities for Bare Rep 2
                        </Typography>
                        {rep2BareData.length > 0 ? 
                            <ProbabilitiesChart data={rep2BareData} /> : 
                            <>Sorry, no data available!</>}
                    </Grid>
                }
            </Grid>
        </Grid>
    );
};

export default StressCamVisuals;
