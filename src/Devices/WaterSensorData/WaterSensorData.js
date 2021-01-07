// Dependency Imports
import React, { useState, useEffect } from "react";
import {
  Grid,
  makeStyles,
  Chip,
} from "@material-ui/core";
import Axios from "axios";
import Skeleton from "@material-ui/lab/Skeleton";
import WaterSensorDataParser from "./WaterSensorDataParser";

// Local Imports
import { apiUsername, apiPassword, apiURL } from "../../utils/api_secret";

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

// Helper Functions
const getWaterSensorInstallDataByYear = async (year) => {
  return await Axios({
    url: `${apiURL}/api/retrieve/nodes/by/year/${year}`,
    method: "get",
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  });
};

const getUniqueYears = async () => {
  return await Axios({
    url: `${apiURL}/api/retrieve/nodes/years`,
    method: "get",
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  });
};

// Default Function
const WaterSensorData = () => {
  const classes = useStyles();
  const [type, setType] = useState("gateway");
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState([]);
  const [activeYear, setActiveYear] = useState(null);

  const [waterSensorInstallData, setWaterSensorInstallData] = useState([]);

  useEffect(() => {
    // get all possible years
    setLoading(true);
    getUniqueYears()
      .then((yearsObject) => {
        let yearsArray = [];
        // console.log(yearsObject.data);
        for (let index in yearsObject.data.data) {
          yearsArray.push(parseInt(yearsObject.data.data[index].years));
        }
        setYears(yearsArray);
        // pass the most recent year and set it active
        let { length, [length - 1]: mostRecentYear } = yearsArray;
        // if active year is not set up, set it up to the most recent year
        if (activeYear === null) {
          setActiveYear(mostRecentYear);
          return mostRecentYear;
        } else {
          return activeYear;
        }
      })
      .then((mostRecentYear) => {
        // use this year as selected (default) active year
        // get unique serial nos, then get node serial nos for each gateway
        getWaterSensorInstallDataByYear(mostRecentYear).then((object) => {
          setWaterSensorInstallData(object.data.data);
          setLoading(false);
        });
      });
  }, [activeYear]);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {loading ? (
            years.length === 0 ? (
              <Skeleton width="300" height="300" variant="rect" />
            ) : (
              years.map((year, index) => (
                <Chip
                  title={`Data for year ${year}`}
                  key={`year-${index}`}
                  label={year}
                  color={activeYear === year ? "primary" : "secondary"}
                  className={classes.chip}
                  onClick={() => setActiveYear(parseInt(year))}
                />
              ))
            )
          ) : (
            years.map((year, index) => (
              <Chip
                title={`Data for year ${year}`}
                key={`year-${index}`}
                label={year}
                color={activeYear === year ? "primary" : "secondary"}
                className={classes.chip}
                onClick={() => setActiveYear(parseInt(year))}
              />
            ))
          )}
        </Grid>
        {loading ? (
          <Skeleton width="300" height="300" variant="rect" />
        ) : (
          waterSensorInstallData.map((installData, index) => (
            <WaterSensorDataParser
              gatewaysno={installData.gateway_serial_no}
              farmCode={installData.code}
              bareNodeSerialNo={installData.bare_node_serial_no}
              coverNodeSerialNo={installData.cover_node_serial_no}
              timeBegin={installData.time_begin}
              timeEnd={installData.time_end}
              subplot={installData.subplot}
              index={index}
              paperClass={classes.paper}
              key={`gateway-${index}`}
              year={activeYear}
            />
          ))
        )}
      </Grid>
    </div>
  );
};

export default WaterSensorData;
