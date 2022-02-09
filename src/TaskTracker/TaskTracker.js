import { Grid, Snackbar, Card } from "@material-ui/core";
import React, { useState, useEffect, useContext, Fragment } from "react";
import { Context } from "../Store/Store";
import { onfarmAPI } from "../utils/api_secret";
import {
  BannedRoleMessage,
  CustomLoader,
  YearsAndAffiliations,
} from "../utils/CustomComponents";
import { uniqueYears } from "../utils/SharedFunctions";
import MuiAlert from "@material-ui/lab/Alert";
import TaskTrackerCard from "./TaskTrackerCard.js";

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
 
  const handleActiveYear = (year = "") => {
    const newFarmYears = farmYears.map((yearInfo) => {
      return { active: year === yearInfo.year, year: yearInfo.year };
    });
    const sortedNewFarmYears = newFarmYears.sort((a, b) => b - a);
    setFarmYears(sortedNewFarmYears);
  };

  const handleActiveAffiliation = (affiliation = "all") => {
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
  useEffect(() => {
    const fetchData = async (apiKey) => {
        const response = await fetch(`${onfarmAPI}/raw?table=decomp_biomass_dry`, {
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


  return (
    <Grid container spacing={3} style={{ maxHeight: "90vh" }}>
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
            <Grid item xs={12} md={3} lg={2} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                <TaskTrackerCard
                    title={"Decomp bag dry weights"}
                    table={"decomp_biomass_dry"}
                    year={activeFarmYear()}
                    affiliation={activeAffiliation() || ""}
                    complete_col={"dry_biomass_wt"}
                />
                </Card>
            </Grid>
            <Grid item xs={12} md={3} lg={2} sm={6} spacing={3}>
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
                    complete_col={"latitude"}
                />
                </Card>
            </Grid>
            <Grid item xs={12} md={3} lg={2} sm={6} spacing={3}>
                <Card
                style={deviceCardStyle}
                variant="elevation"
                elevation={3}
                className="deviceDataWrapper"
                >
                    {<div>{"Decomp Bags"}
                    </div>}
                </Card>

            </Grid>
                
          </Grid>
        </Fragment>
      )}
    </Grid>
  );
};

export default TaskTracker;

