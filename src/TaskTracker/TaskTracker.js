import { Grid, Snackbar, Card, Typography } from "@material-ui/core";
import React, { useState, useEffect, useContext, Fragment } from "react";
import { Context } from "../Store/Store";
import { onfarmAPI } from "../utils/api_secret";
import {
  BannedRoleMessage,
  CustomLoader,
  YearsAndAffiliations,
  Codes
} from "../utils/CustomComponents";
import { uniqueYears } from "../utils/SharedFunctions";
import MuiAlert from "@material-ui/lab/Alert";
import TaskTrackerCard from "./TaskTrackerCard";

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const deviceCardStyle = {
    height: "210px",
  };
  
// const currentYear = new Date().getFullYear();
const TaskTracker = () => {
  const [state] = useContext(Context);
  const [fetching, setFetching] = useState(true);
  const [farmValues, setFarmValues] = useState([]);
  const [farmYears, setFarmYears] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [codes, setCodes] = useState([]);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: "",
    severity: "success",
  });

  const activeFarmYear = () => {
    const activeYear = farmYears
      .filter((rec) => rec.active)
      .map((rec) => rec.year);

    return parseInt(activeYear);
  };
  const activeAffiliation = () => {
    return (
      affiliations
        .filter((rec) => rec.active)
        .map((rec) => rec.affiliation)
        .toString() || "all"
    );
  };
  const activeCode = () => {
    return (
      codes
        .filter((rec) => rec.active)
        .map((rec) => rec.code)
        .toString() || "all"
    );
  };
 
  const handleActiveYear = (year = "") => {
    const newFarmYears = farmYears.map((yearInfo) => {
      return { active: year === yearInfo.year, year: yearInfo.year };
    });
    const sortedNewFarmYears = newFarmYears.sort((a, b) => b - a);
    setFarmYears(sortedNewFarmYears);
  };

  const handleActiveAffiliation = (affiliation = "all") => {
    console.log("new change");
    const newAffiliations = affiliations.map((rec) => {
      return {
        active: affiliation === rec.affiliation,
        affiliation: rec.affiliation,
      };
    });
    const sortedNewAffiliations = newAffiliations.sort((a, b) =>
      b.affiliation < a.affiliation ? 1 : b.affiliation > a.affiliation ? -1 : 0
    );

    setAffiliations(sortedNewAffiliations);
  };

  const handleActiveCode = (code = "all") => {
    const newCodes = codes.map((rec) => {
      return {
        active: code === rec.code,
        code: rec.code,
      };
    });
    const sortedNewCodes = newCodes.sort((a, b) =>
      b.code < a.code ? 1 : b.code > a.code ? -1 : 0
    );

    setCodes(sortedNewCodes);
  };
  useEffect(() => {
    const fetchData = async (apiKey) => {
        const response = await fetch(`${onfarmAPI}/raw?table=site_information`, {
            headers: {
          "x-api-key": apiKey,
        },
      });

      const data = await response.json();
      return data;
    };
    if (farmValues.length > 0) return false;

    if (state.userInfo.apikey) {
      setFetching(true);
      fetchData(state.userInfo.apikey)
        .then((response) => {
          setFarmValues(response);
          
          let allYears = response.map((record) => record.year);
          setFarmYears(uniqueYears(allYears));

          const affiliations = response
            .filter(record => record.affiliation !== undefined)
            .reduce(
              (prev, curr) =>
                !prev.includes(curr.affiliation)
                  ? [...prev, curr.affiliation]
                  : [...prev],
              []
            )
            .map((aff) => {
              return {
                affiliation: aff,
                active: false,
              };
            });
          const sortedAffiliations = affiliations.sort((a, b) =>
            b.affiliation < a.affiliation
              ? 1
              : b.affiliation > a.affiliation
              ? -1
              : 0
          );
          setAffiliations(sortedAffiliations);
        })
        .then(() => setFetching(false))
        .catch((e) => {
          console.error(e);
          setFetching(false);
        });
    }
  }, [state.userInfo.apikey, farmValues.length]);

  useEffect(() => {
    const fetchData = async (apiKey) => {
        const response = await fetch(`${onfarmAPI}/raw?table=site_information&affiliation=${activeAffiliation()}&year=${activeFarmYear()}`, {
            headers: {
          "x-api-key": apiKey,
        },
      });
      const data = await response.json();
      return data;
    };
    // if (activeAffiliation()=='all') return false;

    if (state.userInfo.apikey) {
      setFetching(true);
      fetchData(state.userInfo.apikey)
        .then((response) => {

          const codes = response
            .filter(record => record.code !== undefined)
            .reduce(
              (prev, curr) =>
                !prev.includes(curr.code)
                  ? [...prev, curr.code]
                  : [...prev],
              []
            )
            .map((aff) => {
              return {
                code: aff,
                active: false,
              };
            });
          const sortedCodes = codes.sort((a, b) =>
            b.code < a.code
              ? 1
              : b.code > a.code
              ? -1
              : 0
          );
          setCodes(sortedCodes);
        })
        .then(() => setFetching(false))
        .catch((e) => {
          console.error(e);
          setFetching(false);
        });
    }
  }, [state.userInfo.apikey, activeAffiliation(), activeFarmYear()]);
  return (
    <Grid container spacing={3} >
      {fetching ? (
        <CustomLoader />
      ) : farmValues.length === 0 ? (
        <Grid item xs={12}>
          <BannedRoleMessage title="TaskTracker - Farm Values" />
        </Grid>
      ) : (
        <Fragment>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            open={snackbarData.open}
            autoHideDuration={10000}
            onClose={() =>
              setSnackbarData({ ...snackbarData, open: !snackbarData.open })
            }
          >
            <Alert severity={snackbarData.severity}>{snackbarData.text}</Alert>
          </Snackbar>
          {/* Years and Affiliation */}
          <Grid item lg={9} sm={12}>
            <Grid container spacing={3}>
              <YearsAndAffiliations
                title={"Task Tracker"}
                years={farmYears}
                handleActiveYear={handleActiveYear}
                affiliations={affiliations}
                handleActiveAffiliation={handleActiveAffiliation}
                showYears={true}
              />
            </Grid>
          </Grid>
          {/* Codes */}
          <Grid item lg={9} sm={12}>
            <Grid container spacing={3}>
              <Codes
                codes={codes}
                handleActiveCode={handleActiveCode}
              />
            </Grid>
          </Grid>
          <Grid
            item
            lg={3}
            sm={12}
            container
            justifyContent="flex-end"
            alignItems="center"
            component="label"
          >

          </Grid>
          {/* Farm Values Table */}
          <Grid container xs={12} spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h5">Site Enrollment</Typography>
              </Grid>
              <Grid item xs={12} md={4} lg={3} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                <TaskTrackerCard
                    title={"Address"}
                    table={"site_information"}
                    year={activeFarmYear()}
                    affiliation={activeAffiliation() || ""}
                    code={activeCode() || ""}
                    list_code={codes}
                    complete_col={"address"}
                    time={""}
                />
                </Card> 
            </Grid>
            <Grid item xs={12} md={4} lg={3} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                <TaskTrackerCard
                    title={"County"}
                    table={"site_information"}
                    year={activeFarmYear()}
                    affiliation={activeAffiliation() || ""}
                    code={activeCode() || ""}
                    list_code={codes}
                    complete_col={"county"}
                    time={""}
                />
                </Card> 
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h5">Biomass</Typography>
              </Grid>
              <Grid item xs={12} md={4} lg={3} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                <TaskTrackerCard
                    title={"Fresh weight"}
                    table={"biomass_in_field"}
                    year={activeFarmYear()}
                    affiliation={activeAffiliation() || ""}
                    code={activeCode() || ""}
                    list_code={codes}
                    complete_col={"fresh_wt_a"}
                    time={""}
                />
                </Card> 
            </Grid>
            <Grid item xs={12} md={4} lg={3} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                <TaskTrackerCard
                    title={"Legumes"}
                    table={"biomass_in_field"}
                    year={activeFarmYear()}
                    affiliation={activeAffiliation() || ""}
                    code={activeCode() || ""}
                    list_code={codes}
                    complete_col={"legumes_40"}
                    time={""}
                />
                </Card> 
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h5">Decomp Bag</Typography>
              </Grid>
              <Grid item xs={12} md={4} lg={3} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                <TaskTrackerCard
                    title={"T0 Decomp bag dry weights"}
                    table={"decomp_biomass_dry"}
                    year={activeFarmYear()}
                    affiliation={activeAffiliation() || ""}
                    code={activeCode() || ""}
                    list_code={codes}
                    complete_col={"dry_biomass_wt"}
                    time={"0"}
                />
                </Card> 
            </Grid>
            <Grid item xs={12} md={4} lg={3} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                <TaskTrackerCard
                    title={"T1 Decomp bag dry weights"}
                    table={"decomp_biomass_dry"}
                    year={activeFarmYear()}
                    affiliation={activeAffiliation() || ""}
                    code={activeCode() || ""}
                    list_code={codes}
                    complete_col={"dry_biomass_wt"}
                    time={"1"}
                />
                </Card> 
            </Grid>
            <Grid item xs={12} md={4} lg={3} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                <TaskTrackerCard
                    title={"T2 Decomp bag dry weights"}
                    table={"decomp_biomass_dry"}
                    year={activeFarmYear()}
                    affiliation={activeAffiliation() || ""}
                    code={activeCode() || ""}
                    list_code={codes}
                    complete_col={"dry_biomass_wt"}
                    time={"2"}
                />
                </Card> 
            </Grid>
            <Grid item xs={12} md={4} lg={3} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                <TaskTrackerCard
                    title={"T3 Decomp bag dry weights"}
                    table={"decomp_biomass_dry"}
                    year={activeFarmYear()}
                    affiliation={activeAffiliation() || ""}
                    code={activeCode() || ""}
                    list_code={codes}
                    complete_col={"dry_biomass_wt"}
                    time={"3"}
                />
                </Card> 
            </Grid>
            <Grid item xs={12} md={4} lg={3} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                <TaskTrackerCard
                    title={"T4 Decomp bag dry weights"}
                    table={"decomp_biomass_dry"}
                    year={activeFarmYear()}
                    affiliation={activeAffiliation() || ""}
                    code={activeCode() || ""}
                    list_code={codes}
                    complete_col={"dry_biomass_wt"}
                    time={"4"}
                />
                </Card> 
            </Grid>
            <Grid item xs={12} md={4} lg={3} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                <TaskTrackerCard
                    title={"T5 Decomp bag dry weights"}
                    table={"decomp_biomass_dry"}
                    year={activeFarmYear()}
                    affiliation={activeAffiliation() || ""}
                    code={activeCode() || ""}
                    list_code={codes}
                    complete_col={"dry_biomass_wt"}
                    time={"5"}
                />
                </Card> 
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h5">Sensor Installation</Typography>
              </Grid>
              <Grid item xs={12} md={4} lg={3} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                <TaskTrackerCard
                    title={"T0 Decomp bag dry weights"}
                    table={"decomp_biomass_dry"}
                    year={activeFarmYear()}
                    affiliation={activeAffiliation() || ""}
                    code={activeCode() || ""}
                    list_code={codes}
                    complete_col={"dry_biomass_wt"}
                    time={"0"}
                />
                </Card> 
            </Grid>
            <Grid item xs={12} md={4} lg={3} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                <TaskTrackerCard
                    title={"T0 Decomp bag dry weights"}
                    table={"decomp_biomass_dry"}
                    year={activeFarmYear()}
                    affiliation={activeAffiliation() || ""}
                    code={activeCode() || ""}
                    list_code={codes}
                    complete_col={"dry_biomass_wt"}
                    time={"0"}
                />
                </Card> 
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h5">Yield</Typography>
              </Grid>
              <Grid item xs={12} md={4} lg={3} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                <TaskTrackerCard
                    title={"T0 Decomp bag dry weights"}
                    table={"decomp_biomass_dry"}
                    year={activeFarmYear()}
                    affiliation={activeAffiliation() || ""}
                    code={activeCode() || ""}
                    list_code={codes}
                    complete_col={"dry_biomass_wt"}
                    time={"0"}
                />
                </Card> 
            </Grid>
            <Grid item xs={12} md={4} lg={3} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                <TaskTrackerCard
                    title={"T0 Decomp bag dry weights"}
                    table={"decomp_biomass_dry"}
                    year={activeFarmYear()}
                    affiliation={activeAffiliation() || ""}
                    code={activeCode() || ""}
                    list_code={codes}
                    complete_col={"dry_biomass_wt"}
                    time={"0"}
                />
                </Card> 
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">Basic Information</Typography>
            </Grid>
            <Grid item xs={12} md={4} lg={3} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                <TaskTrackerCard
                    title={"Decomp bag pickups"}
                    table={"decomp_biomass_dry"}
                    year={activeFarmYear()}
                    affiliation={activeAffiliation() || ""}
                    code={activeCode() || ""}
                    list_code={codes}
                    complete_col={"recovery_date"}
                    time={""}
                />
                </Card> 
            </Grid>
            <Grid item xs={12} md={4} lg={3} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                <TaskTrackerCard
                    title={"GPS corners"}
                    table={"gps_corners"}
                    year={activeFarmYear()}
                    affiliation={activeAffiliation() || ""}
                    code={activeCode() || ""}
                    list_code={codes}
                    complete_col={"latitude"}
                    time={""}
                />
                </Card> 
            </Grid>                 
          </Grid>
        </Fragment>
      )}
    </Grid>
  );
};

export default TaskTracker;

