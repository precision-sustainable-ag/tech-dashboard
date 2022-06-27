import { Grid, Snackbar } from '@material-ui/core';
import React, { useState, useEffect, Fragment } from 'react';
import { onfarmAPI } from '../../utils/api_secret';
import { BannedRoleMessage, CustomLoader } from '../../utils/CustomComponents';
import MuiAlert from '@material-ui/lab/Alert';
import FarmValuesTable from './components/FarmValuesTable/FarmValuesTable';
import { useSelector } from 'react-redux';

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const FarmValues = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const [fetching, setFetching] = useState(true);
  const [farmValues, setFarmValues] = useState([]);
  const [farmYears, setFarmYears] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
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

          let allAffiliations = response
            .filter((record) => record.affiliation !== undefined)
            .reduce(
              (prev, curr) =>
                !prev.includes(curr.affiliation) ? [...prev, curr.affiliation] : [...prev],
              [],
            );
          allAffiliations.sort();
          allAffiliations.unshift('All');
          setAffiliations(allAffiliations);
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
          {/* Farm Values Table */}
          <Grid item container xs={12}>
            <FarmValuesTable
              data={farmValues}
              setSnackbarData={setSnackbarData}
              farmYears={farmYears}
              affiliations={affiliations}
            />
          </Grid>
        </Fragment>
      )}
    </Grid>
  );
};

export default FarmValues;
