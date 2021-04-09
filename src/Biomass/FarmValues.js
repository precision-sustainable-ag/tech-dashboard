import { Chip, Grid, Paper, Typography } from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";
import { Fragment } from "react";
import { Context } from "../Store/Store";
import { onfarmAPI } from "../utils/api_secret";
import { CustomLoader } from "../utils/CustomComponents";
import AffiliationsChips from "./AffiliationsChips";
import RenderFarmValues from "./RenderFarmValues";
import YearsChips from "./YearsChips";

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
          //   get unique years, sort by highest to lowest and activate highest year
          const uniqueYears = allYears
            .filter((val, index, arr) => arr.indexOf(val) === index)
            .sort((a, b) => b - a)
            .map((year, index) => {
              return { active: index === 0 ? true : false, year: year };
            });
          setFarmYears(uniqueYears);

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
          <Grid item xs={12}>
            <Typography variant="h4">Farm Values</Typography>
          </Grid>
          {/* Years and Affiliations */}
          <Grid item container spacing={3} xs={12}>
            <Grid item sm={2} md={1} xs={12}>
              <Typography variant="body1">Years</Typography>
            </Grid>
            <YearsChips years={farmYears} handleActiveYear={handleActiveYear} />
          </Grid>

          <Grid item container spacing={2} xs={12}>
            <Grid item sm={2} md={1} xs={12}>
              <Typography variant="body1">Affiliations</Typography>
            </Grid>

            <Grid item>
              <Chip
                label={"All"}
                color={activeAffiliation() === "all" ? "primary" : "default"}
                onClick={() => {
                  handleActiveAffiliation("all");
                }}
              />
            </Grid>

            {affiliations.length > 1 && (
              <AffiliationsChips
                affiliations={affiliations}
                handleActiveAffiliation={handleActiveAffiliation}
              />
            )}
          </Grid>

          {/* Farm Values Table */}
          <Grid item container xs={12}>
            <RenderFarmValues
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
