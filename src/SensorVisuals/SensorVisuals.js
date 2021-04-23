import { Grid, TextField, Typography } from "@material-ui/core";
import React, { useState, useEffect, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { apiPassword, apiUsername, onfarmAPI } from "../utils/api_secret";
import { Context } from "../Store/Store";
import { CustomLoader } from "../utils/CustomComponents";
import YearsChips from "../utils/YearsChips";
import { groupBy } from "../utils/constants";
import FarmCodeCard from "./Components/FarmCodeCard";
import { Search } from "@material-ui/icons";

// const allYears

const datesURL = onfarmAPI + `/raw?table=site_information`;

const stressCamAPIEndpoint = ``;

const SensorVisuals = (props) => {
  const { type } = props;
  const displayTitle =
    type === "watersensors" ? "Water Sensors" : "Stress Cams";
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [state] = useContext(Context);
  const [codeSearchText, setCodeSearchText] = useState("");

  const handleActiveYear = (year = "") => {
    const newYears = years.map((yearInfo) => {
      return { active: year === yearInfo.year, year: yearInfo.year };
    });
    const sortedNewYears = newYears.sort((a, b) => b - a);

    setYears(sortedNewYears);
  };

  useEffect(() => {
    const fetchData = async (apiKey) => {
      setLoading(true);
      const endpoint =
        type === "watersensors" ? datesURL : stressCamAPIEndpoint;
      if (apiKey) {
        try {
          const records = await fetch(endpoint, {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
            },
          });
          const response = await records.json();
          setData(response);
          const recs = groupBy(response, "year");
          const uniqueYears = Object.keys(recs)
            .sort((a, b) => b - a)
            .map((y, i) => {
              return {
                year: y,
                active: i === 0 ? true : false,
              };
            });
          setYears(uniqueYears);
        } catch (e) {
          console.error("Error:" + e);
          setYears([]);
        }
      } else {
        setYears([]);
      }
      setLoading(false);
    };

    fetchData(state.userInfo.apikey);
  }, [state.userInfo.apikey, type]);

  const activeYearData = useMemo(() => {
    const activeYear = years.reduce((acc, curr, ind, arr) => {
      if (curr.active) {
        return curr.year;
      } else return acc;
    }, "");

    if (!codeSearchText) {
      return data.filter((data) => data.year === activeYear);
    } else {
      return data.filter(
        (data) => data.year === activeYear && data.code.includes(codeSearchText)
      );
    }
  }, [years, data, codeSearchText]);

  const activeYear = useMemo(() => {
    return years.reduce((acc, curr, ind, arr) => {
      if (curr.active) {
        return curr.year;
      } else return acc;
    }, "");
  }, [years]);
  //   console.log(Object.entries(data).filter((data) => data[0] === activeYear));

  return loading && data.length === 0 ? (
    <CustomLoader />
  ) : (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5">{displayTitle}</Typography>
      </Grid>
      <Grid item container justify="space-between">
        <Grid item container spacing={2} xs={12} md={6} lg={9}>
          <YearsChips years={years} handleActiveYear={handleActiveYear} />
        </Grid>
        <Grid item container direction="row-reverse">
          <Grid item xs={12} md={6} lg={3}>
            <TextField
              variant="outlined"
              label="Search Codes"
              fullWidth
              InputProps={{
                startAdornment: <Search />,
              }}
              value={codeSearchText}
              onChange={(e) => setCodeSearchText(e.target.value.toUpperCase())}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item container spacing={4} xs={12}>
        {activeYearData.map((data, index) => (
          <Grid item key={index} xl={2} lg={3} md={4} sm={6} xs={12}>
            <FarmCodeCard code={data.code} year={activeYear} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

SensorVisuals.defaultProps = {
  type: "watersensors",
};

SensorVisuals.propTypes = {
  type: PropTypes.oneOf(["watersensors", "stresscams"]).isRequired,
};

export default SensorVisuals;
