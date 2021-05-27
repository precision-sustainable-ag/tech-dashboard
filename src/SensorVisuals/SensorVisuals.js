import { Grid, TextField, Typography, useTheme } from "@material-ui/core";
import React, { useState, useEffect, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { apiPassword, apiUsername, onfarmAPI } from "../utils/api_secret";
import { Context } from "../Store/Store";
import { CustomLoader } from "../utils/CustomComponents";
import YearsChips from "../utils/YearsChips";
import { groupBy } from "../utils/constants";
import FarmCodeCard from "./Components/FarmCodeCard";
import { Search } from "@material-ui/icons";
import AffiliationsChips from "../utils/AffiliationsChips";
import { useHistory, useLocation } from "react-router-dom";
import { red, green, yellow, grey } from "@material-ui/core/colors";
import { setDate } from "date-fns/esm";
import moment from "moment-timezone";

// const allYears

const datesURL = onfarmAPI + `/raw?table=site_information`;

const stressCamAPIEndpoint = ``;

// Styles
const deviceColors = {
  bothSubplots: green[800],
  oneSubplot: green[400],
  loading: grey[400],
  default: "white",
};

const SensorVisuals = (props) => {
  const { type } = props;
  const { location } = useHistory();

  const displayTitle =
    type === "watersensors" ? "Water Sensors" : "Stress Cams";
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [state] = useContext(Context);
  const [codeSearchText, setCodeSearchText] = useState("");
  const [coloredSensors, setColoredSensors] = useState([]);
  const [index, setIndex] = useState(0);
  const theme = useTheme();
  // const [historyYear, setHistoryYear] = useState(
  //   // location.state.year ? location.state.year : null
  //   location.state ? (location.state.year ? location.state.year : null) : null
  // );

  // useEffect(() => {
  //   location.state.year && setHistoryYear(location.state.year);
  // }, [location.state]);

  const handleActiveYear = (year = "") => {
    const newYears = years.map((yearInfo) => {
      return { active: year === yearInfo.year, year: yearInfo.year };
    });
    const sortedNewYears = newYears.sort((a, b) => b - a);

    setYears(sortedNewYears);
  };

  async function getCameraStatus(data, apiKey) {
    setLoading(false);
    await data.forEach((entry, index) => {
      // console.log(entry.code)
      const waterSensorInstallEndpoint =
        onfarmAPI + `/raw?table=wsensor_install&code=${entry.code.toLowerCase()}`;
      fetch(waterSensorInstallEndpoint, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      }).then((res) => {
        res.json().then((res) => {
            // console.log(res)
            console.log(entry.code)
            if (res.length > 1){
              if('subplot' in res[0] && 'subplot' in res[1]){
                if((res[0].subplot == 1 || res[0].subplot == 2) && (res[1].subplot == 1 || res[1].subplot == 2)){
                  let newData = data.slice();
                  // newData[index].color = deviceColors.bothSubplots;
                  // console.log(res[0])
                  // let lastUpdated = new Date(res[0].time_begin);
                  // const currentTime = new Date();
                  // let timeDiff = Math.abs(new Date() - new Date(res[0].time_begin)) / 3600000;
                  // console.log(timeDiff);

                  // let timeString;

                  // if (Math.round(timeDiff) <= 1) {
                  //   timeString = "Active within last hour";
                  //   newData[index].color = deviceColors.bothSubplots;
                  // } else if (timeDiff > 1 && timeDiff <= 4) {
                  //   timeString = "Active within last 4 hours";
                  //   newData[index].color = deviceColors.oneSubplot;
                  // } else if (timeDiff > 4 && timeDiff <= 36) {
                  //   timeString = "Active within last 36 hours";
                  //   newData[index].color = deviceColors.lastThirtySixHours;
                  // } else if (timeDiff > 36 && timeDiff <= 730) {
                  //   timeString = "Active last month";
                  //   newData[index].color = deviceColors.loading;
                  // } else {
                  //   timeString = "Last active " + lastUpdated.toLocaleDateString("en-US");
                  //   newData[index].color = deviceColors.default;
                  // }

                  let tz = moment.tz.guess();

                  let deviceSessionBegin = res[0].time_begin;
                  // get device session begin as user local time
                  let deviceDateLocal = moment
                    .tz(deviceSessionBegin, "Africa/Abidjan")
                    .tz(tz);

                  // setDateStringFormatted(deviceDateLocal.format("MM/DD/YYYY hh:mm A"));

                  let deviceDateFormatted = deviceDateLocal.fromNow();

                  console.log(deviceDateFormatted)

                  newData[index].color = deviceColors.bothSubplots;
                  newData[index].lastUpdated = "Last active " + deviceDateFormatted;
                  setData(newData);
                }
                else{
                  let newData = data.slice();
                  newData[index].color = deviceColors.oneSubplot;
                  newData[index].lastUpdated = "Only one subplot";
                  setData(newData);
                }
              }
            }
            else{
              if (res.length == 1){
                let newData = data.slice();
                newData[index].color = deviceColors.oneSubplot;
                newData[index].lastUpdated = "Only one subplot";
                setData(newData);
              } else {
                let newData = data.slice();
                newData[index].color = deviceColors.default;
                newData[index].lastUpdated = "";
                setData(newData);
              }
            }
          }
        )
      })
    })
  }

  // let index = 0;
  useEffect(() => {
    // setData(location.data)
    // console.log(location.state.data)

    if(location.state){
      console.log(location.state.data);
      setData(location.state.data);
    }
      

    const fetchData = async (apiKey) => {
      // const coloredData = useMemo(() => {
      //   return 
      // }, [])
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

          console.log(index);
          console.log(response);

          if(!location.state){
            console.log("heyo");
            let newData = response.map((entry) => {
              return {...entry, color: deviceColors.loading, lastUpdated: "Fetching last update time"};
            })
            console.log(newData);
            
            // setData(newData);
            console.log(data);
            getCameraStatus(newData, state.userInfo.apikey);
          }

          
          
          let newIndex = index + 1;
          setIndex(newIndex);

          const recs = groupBy(response, "year");

          const uniqueYears = Object.keys(recs)
            .sort((a, b) => b - a)
            .map((y, i) => {
              if (location.state) {
                if (location.state.year)
                  return {
                    year: y,
                    active: location.state.year === y,
                  };
                else
                  return {
                    year: y,
                    active: i === 0,
                  };
              } else {
                return {
                  year: y,
                  active: i === 0,
                };
              }
            });
          setYears(uniqueYears);

          const uniqueAffiliations = Object.keys(
            groupBy(response, "affiliation")
          )
            .sort((a, b) => b - a)
            .map((a, i) => {
              return {
                affiliation: a,
                active: i === 0,
              };
            });

          setAffiliations(uniqueAffiliations);
        } catch (e) {
          console.error("Error:" + e);
          setYears([]);
          setAffiliations([]);
        }
      } else {
        setYears([]);
        setAffiliations([]);
      }
      // setLoading(false);
    };
    
    fetchData(state.userInfo.apikey);
  }, [state.userInfo.apikey, type, location.state]);

  const activeData = useMemo(() => {
    // console.log(JSON.stringify(data))
    const activeYear = years.reduce((acc, curr, ind, arr) => {
      if (curr.active) {
        return curr.year;
      } else return acc;
    }, "");

    const activeAffiliation = affiliations.reduce((acc, curr, index, array) => {
      if (curr.active) return curr.affiliation;
      else return acc;
    }, "");
    if (!codeSearchText) {
      return data.filter((data) => data.year === activeYear);
    } else {
      return data.filter(
        (data) => data.year === activeYear && data.code.includes(codeSearchText)
      );
    }

    
  }, [years, data, codeSearchText, affiliations]);

  const activeYear = useMemo(() => {
    return years.reduce((acc, curr, ind, arr) => {
      if (curr.active) {
        return curr.year;
      } else return acc;
    }, "");
  }, [years]);

  const activeAffiliation = useMemo(() => {
    return affiliations.reduce((acc, curr, index, array) => {
      if (curr.active) return curr.affiliation;
      else return acc;
    }, "");
  }, [affiliations]);

  

  // const handleActiveAffiliation = (affiliation = "all") => {
  //   console.log(affiliations);

  //       const newAffs =  affiliations.reduce((acc, curr, index, array) => {
  //     if (curr.affiliation === affiliation) {
  //       let obj = {affiliation : affiliation, active: true}
  //     }
  //     else return acc;
  //   }, "");

  // };

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
      {/* <Grid item container xs={12} spacing={2}>
        <AffiliationsChips
          affiliations={affiliations}
          activeAffiliation={activeAffiliation || "all"}
          handleActiveAffiliation={handleActiveAffiliation}
        />
      </Grid> */}
      <Grid item container spacing={4} xs={12}>
        {activeData.map((entry, index) => (
          <Grid item key={index} xl={2} lg={3} md={4} sm={6} xs={12}>
            <FarmCodeCard code={entry.code} year={activeYear} color={entry.color} lastUpdated={entry.lastUpdated} data={data}/>
            {/* <div>{data.code}</div> */}
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
