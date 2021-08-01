import { Grid, Snackbar, Button } from "@material-ui/core";
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

import FarmValuesTable from "./FarmValuesTable";

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const currentYear = new Date().getFullYear();
const FarmValues = () => {
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
      const response = await fetch(`${onfarmAPI}/biomass?subplot=separate`, {
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

  const [units, setUnits] = useState("kg/ha");

  return (
    <Grid container spacing={3} style={{ maxHeight: "90vh" }}>
      {fetching ? (
        <CustomLoader />
      ) : farmValues.length === 0 ? (
        <Grid item xs={12}>
          <BannedRoleMessage title="Biomass - Farm Values" />
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
                title={"Farm Values"}
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
          >
            <div>
              <Button
                variant="contained"
                size="small"
                title={`Change Units to ${
                  units === "kg/ha" ? "lbs/ac" : "kg/ha"
                }`}
                onClick={() =>
                  units === "kg/ha" ? setUnits("lbs/ac") : setUnits("kg/ha")
                }
              >
                Toggle Units
              </Button>
            </div>
          </Grid>
          {/* Farm Values Table */}
          <Grid item container xs={12}>
            <FarmValuesTable
              units={units}
              data={farmValues}
              year={activeFarmYear() || currentYear}
              affiliation={activeAffiliation() || "all"}
              setSnackbarData={setSnackbarData}
            />
          </Grid>
        </Fragment>
      )}
    </Grid>
  );
};

export default FarmValues;
