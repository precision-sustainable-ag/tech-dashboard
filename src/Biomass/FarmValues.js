import { Grid, Typography } from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";
import { Fragment } from "react";
import { Context } from "../Store/Store";
import { onfarmAPI } from "../utils/api_secret";
import { CustomLoader, YearsAndAffiliations } from "../utils/CustomComponents";
import { uniqueYears } from "../utils/SharedFunctions";

import FarmValuesTable from "./FarmValuesTable";

const currentYear = new Date().getFullYear();
const FarmValues = () => {
  const [state] = useContext(Context);
  const [fetching, setFetching] = useState(false);
  const [farmValues, setFarmValues] = useState([]);
  const [farmYears, setFarmYears] = useState([]);
  const [affiliations, setAffiliations] = useState([]);

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

    if (state.userInfo.apikey) {
      setFetching(true);
      fetchData(state.userInfo.apikey)
        .then((response) => {
          setFarmValues(response);
          let allYears = response.map((record) => record.year);

          setFarmYears(uniqueYears(allYears));

          const affiliations = response
            .reduce(
              (prev, curr, index, arr) =>
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

          setFetching(false);
        })
        .catch((e) => {
          console.error(e);
          setFetching(false);
        });
    }
  }, [state.userInfo.apikey]);

  return (
    <Grid container spacing={3}>
      {fetching ? (
        <CustomLoader />
      ) : farmValues.length === 0 ? (
        <Grid item>
          <Typography variant="h5">No Data</Typography>
        </Grid>
      ) : (
        <Fragment>
          {/* Years and Affiliation */}
          <YearsAndAffiliations
            title={"Farm Values"}
            years={farmYears}
            handleActiveYear={handleActiveYear}
            affiliations={affiliations}
            handleActiveAffiliation={handleActiveAffiliation}
            showYears={true}
          />
          {/* Farm Values Table */}
          <Grid item container xs={12}>
            <FarmValuesTable
              data={farmValues}
              year={activeFarmYear() || currentYear}
              affiliation={activeAffiliation() || "all"}
            />
          </Grid>
        </Fragment>
      )}
    </Grid>
  );
};

export default FarmValues;
