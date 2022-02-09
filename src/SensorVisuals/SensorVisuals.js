import { Grid, TextField, Typography } from '@material-ui/core';
import React, { useState, useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { onfarmAPI } from '../utils/api_secret';
import { Context } from '../Store/Store';
import { CustomLoader } from '../utils/CustomComponents';
import YearsChips from '../utils/YearsChips';
import { groupBy } from '../utils/constants';
import FarmCodeCard from './Components/FarmCodeCard';
import { Search } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { green, grey } from '@material-ui/core/colors';
import moment from 'moment-timezone';

// const allYears

const datesURL = onfarmAPI + `/raw?table=site_information`;

const stressCamAPIEndpoint = ``;

const SensorVisuals = (props) => {
  const { isDarkTheme, type } = props;
  const { location } = useHistory();

  const displayTitle = type === 'watersensors' ? 'Water Sensors' : 'Stress Cams';
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [, setAffiliations] = useState([]);
  const [state] = useContext(Context);
  const [codeSearchText, setCodeSearchText] = useState('');

  // Styles
  const deviceColors = {
    bothSubplots: green[800],
    oneSubplot: green[400],
    loading: grey[400],
    default: 'default',
  };

  const handleActiveYear = (year = '') => {
    const newYears = years.map((yearInfo) => {
      return { active: year === yearInfo.year, year: yearInfo.year };
    });
    const sortedNewYears = newYears.sort((a, b) => b.year - a.year);

    setYears(sortedNewYears);
  };

  async function getCameraStatus(data, apiKey) {
    let allCodes = '';
    let allResponses = {};
    let responseArray = [];

    data.forEach((entry) => {
      allCodes = allCodes.concat(entry.code.toLowerCase() + ',');
      allResponses[entry.code.toLowerCase()] = [];
      responseArray.push(entry);
    });

    const waterSensorInstallEndpoint = onfarmAPI + `/raw?table=wsensor_install&code=${allCodes}`;

    await fetch(waterSensorInstallEndpoint, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    }).then((res) => {
      res.json().then((resJson) => {
        resJson.forEach((response) => {
          if (response.code) {
            allResponses[response.code.toLowerCase()].push(response);
          }
        });

        Object.keys(allResponses).forEach((key, index) => {
          if (allResponses[key].length === 0) {
            responseArray[index] = {
              ...responseArray[index],
              code: key,
              color: deviceColors.default,
              lastUpdated: '',
            };
          } else {
            let tz = moment.tz.guess();

            let lastUpdatedString;
            if (allResponses[key][allResponses[key].length - 1].time_begin) {
              let deviceSessionBegin = allResponses[key][allResponses[key].length - 1].time_begin;
              // get device session begin as user local time
              let deviceDateLocal = moment.tz(deviceSessionBegin, 'Africa/Abidjan').tz(tz);

              let deviceDateFormatted = deviceDateLocal.fromNow();
              lastUpdatedString = 'Form registered ' + deviceDateFormatted;
            } else {
              lastUpdatedString = 'No timestamp';
            }

            if (allResponses[key].length === 1) {
              responseArray[index] = {
                ...responseArray[index],
                code: key,
                color: deviceColors.oneSubplot,
                lastUpdated: lastUpdatedString,
              };
            } else {
              let foundSubplotOne = false;
              let foundSubplotTwo = false;

              allResponses[key].forEach((entry) => {
                if ('subplot' in entry) {
                  if (entry.subplot === 1) {
                    foundSubplotOne = true;
                  } else if (entry.subplot === 2) foundSubplotTwo = true;
                }

                if (foundSubplotOne && foundSubplotTwo) {
                  responseArray[index] = {
                    ...responseArray[index],
                    code: key,
                    color: deviceColors.bothSubplots,
                    lastUpdated: lastUpdatedString,
                  };
                } else if (foundSubplotOne || foundSubplotTwo) {
                  responseArray[index] = {
                    ...responseArray[index],
                    code: key,
                    color: deviceColors.oneSubplot,
                    lastUpdated: lastUpdatedString,
                  };
                } else {
                  responseArray[index] = {
                    ...responseArray[index],
                    code: key,
                    color: deviceColors.default,
                    lastUpdated: ' ',
                  };
                }
              });
            }
          }
        });
        setLoading(false);
        let responseWithFilter = responseArray.filter((r) => {
          return r.protocols_enrolled !== '-999';
        });
        setData(responseWithFilter);
      });
    });
  }

  useEffect(() => {
    if (location.state && location.state.data) {
      setData(location.state.data);
    }

    const fetchData = async (apiKey) => {
      setLoading(true);
      const endpoint = type === 'watersensors' ? datesURL : stressCamAPIEndpoint;
      if (apiKey) {
        try {
          const records = await fetch(endpoint, {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
            },
          });
          const response = await records.json();

          if (data.length === 0) {
            let newData = response.map((entry) => {
              return {
                ...entry,
                color: deviceColors.loading,
                lastUpdated: 'Fetching last update time',
              };
            });

            getCameraStatus(newData, state.userInfo.apikey);
          }

          const recs = groupBy(response, 'year');
          const currentYear = new Date().getFullYear().toString();

          const uniqueYears = Object.keys(recs)
            .sort((a, b) => b - a)
            .map((y) => {
              if (location.state) {
                if (location.state.year)
                  return {
                    year: y,
                    active: location.state.year === y,
                  };
                else
                  return {
                    year: y,
                    active: currentYear === y,
                  };
              } else {
                return {
                  year: y,
                  active: currentYear === y,
                };
              }
            });
          setYears(uniqueYears);

          const uniqueAffiliations = Object.keys(groupBy(response, 'affiliation'))
            .sort((a, b) => b - a)
            .map((a, i) => {
              return {
                affiliation: a,
                active: i === 0,
              };
            });

          setAffiliations(uniqueAffiliations);
        } catch (e) {
          console.error('Error:' + e);
          setYears([]);
          setAffiliations([]);
        }
      } else {
        setYears([]);
        setAffiliations([]);
      }
    };

    fetchData(state.userInfo.apikey);
  }, [state.userInfo.apikey, type, location.state, data.length]);

  const activeData = useMemo(() => {
    // console.log(JSON.stringify(data))
    const activeYear = years.reduce((acc, curr) => {
      if (curr.active) {
        return curr.year;
      } else return acc;
    }, '');

    // const activeAffiliation = affiliations.reduce((acc, curr, index, array) => {
    //   if (curr.active) return curr.affiliation;
    //   else return acc;
    // }, "");
    if (!codeSearchText) {
      return data.filter((data) => data.year === activeYear);
    } else {
      return data.filter(
        (data) => data.year === activeYear && data.code.includes(codeSearchText.toLowerCase()),
      );
    }
  }, [years, data, codeSearchText]);

  const activeYear = useMemo(() => {
    return years.reduce((acc, curr) => {
      if (curr.active) {
        return curr.year;
      } else return acc;
    }, '');
  }, [years]);

  // const activeAffiliation = useMemo(() => {
  //   return affiliations.reduce((acc, curr, index, array) => {
  //     if (curr.active) return curr.affiliation;
  //     else return acc;
  //   }, "");
  // }, [affiliations]);

  return loading && data.length === 0 ? (
    <CustomLoader />
  ) : (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5">{displayTitle}</Typography>
      </Grid>
      <Grid item container justifyContent="space-between" spacing={2}>
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
        {activeData.map((entry, index) => (
          <Grid item key={index} xl={2} lg={3} md={4} sm={6} xs={12}>
            <FarmCodeCard
              code={entry.code}
              year={activeYear}
              color={entry.color}
              lastUpdated={entry.lastUpdated}
              data={data}
              isDarkTheme={isDarkTheme}
            />
            {/* <div>{data.code}</div> */}
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

SensorVisuals.defaultProps = {
  type: 'watersensors',
};

SensorVisuals.propTypes = {
  type: PropTypes.oneOf(['watersensors', 'stresscams']).isRequired,
  isDarkTheme: PropTypes.bool.isRequired,
};

export default SensorVisuals;
