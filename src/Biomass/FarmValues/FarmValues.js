import { Grid } from '@material-ui/core';
import React, { useState, useEffect, Fragment } from 'react';
import { onfarmAPI } from '../../utils/api_secret';
import { BannedRoleMessage, CustomLoader } from '../../utils/CustomComponents';
import FarmValuesTable from './components/FarmValuesTable/FarmValuesTable';
import { useSelector } from 'react-redux';
import { cleanYears, cleanAff } from '../../TableComponents/SharedTableFunctions';

const FarmValues = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const [fetching, setFetching] = useState(true);
  const [farmValues, setFarmValues] = useState([]);
  const [farmYears, setFarmYears] = useState([]);
  const [affiliations, setAffiliations] = useState([]);

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
          setFarmYears(cleanYears(response));
          setAffiliations(cleanAff(response));

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
          {/* Farm Values Table */}
          <Grid item container xs={12}>
            <FarmValuesTable data={farmValues} farmYears={farmYears} affiliations={affiliations} />
          </Grid>
        </Fragment>
      )}
    </Grid>
  );
};

export default FarmValues;
