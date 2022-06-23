import {
  Grid,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@material-ui/core';
import React, { useState, useEffect, Fragment } from 'react';
import { onfarmAPI } from '../../utils/api_secret';
import { BannedRoleMessage, CustomLoader } from '../../utils/CustomComponents';
import MuiAlert from '@material-ui/lab/Alert';
import FarmValuesTable from './components/FarmValuesTable/FarmValuesTable';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Header = styled.div`
  font-size: 2rem;
  margin-left: 1rem;
`;

const FarmValues = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const [fetching, setFetching] = useState(true);
  const [farmValues, setFarmValues] = useState([]);
  const [activeFarmYear, setActiveFarmYear] = useState(new Date().getFullYear());
  const [activeAffiliation, setActiveAffliation] = useState('all');
  const [farmYears, setFarmYears] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [units, setUnits] = useState('kg/ha');
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchData = async (apiKey) => {
      const response = await fetch(`${onfarmAPI}/biomass?subplot=separate`, {
        headers: {
          'x-api-key': apiKey,
        },
      });

      const data = await response.json();
      return data;
    };

    if (userInfo.apikey) {
      setFetching(true);
      fetchData(userInfo.apikey)
        .then((response) => {
          if (response.length === 0) {
            throw new Error('No data');
          }
          setFarmValues(response);

          let allYears = response.map((record) => record.year);
          setFarmYears([...new Set(allYears)]);

          const affiliations = response
            .filter((record) => record.affiliation !== undefined)
            .reduce(
              (prev, curr) =>
                !prev.includes(curr.affiliation) ? [...prev, curr.affiliation] : [...prev],
              [],
            )
            .sort();
          setAffiliations(affiliations);
        })
        .then(() => {
          setFetching(false);
        })
        .catch((e) => {
          console.error(e);
          setFetching(false);
        });
    }
  }, [userInfo.apikey, farmValues.length]);

  const handleSelectChangeYear = (event) => {
    setActiveFarmYear(event.target.value);
  };

  const handleSelectChangeAff = (event) => {
    setActiveAffliation(event.target.value);
  };

  return (
    <Grid container spacing={5} style={{ maxHeight: '90vh' }}>
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
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={snackbarData.open}
            autoHideDuration={10000}
            onClose={() => setSnackbarData({ ...snackbarData, open: !snackbarData.open })}
          >
            <Alert severity={snackbarData.severity}>{snackbarData.text}</Alert>
          </Snackbar>
          {/* Years and Affiliation */}
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Header>Farm Values</Header>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel id="year">Year</InputLabel>
                <Select
                  labelId="year"
                  defaultValue={activeFarmYear}
                  value={activeFarmYear}
                  onChange={handleSelectChangeYear}
                >
                  {Object.keys(farmYears).map((year) => (
                    <MenuItem key={farmYears[year]} value={farmYears[year]}>
                      {farmYears[year]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel id="affiliations">Affiliations</InputLabel>
                <Select
                  labelId="affiliations"
                  defaultValue={activeAffiliation}
                  value={activeAffiliation}
                  onChange={handleSelectChangeAff}
                >
                  {Object.keys(affiliations).map((aff) => (
                    <MenuItem key={affiliations[aff]} value={affiliations[aff]}>
                      {affiliations[aff]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  if (units === 'kg/ha') setUnits('lbs/ac');
                  else setUnits('kg/ha');
                }}
              >
                {units}
              </Button>
            </Grid>
          </Grid>
          {/* Farm Values Table */}
          <Grid item container xs={12}>
            <FarmValuesTable
              units={units}
              data={farmValues}
              year={parseInt(activeFarmYear) || new Date().getFullYear()}
              affiliation={activeAffiliation || 'all'}
              setSnackbarData={setSnackbarData}
            />
          </Grid>
        </Fragment>
      )}
    </Grid>
  );
};

export default FarmValues;
