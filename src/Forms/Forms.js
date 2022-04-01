// Dependency Imports
import React, { useEffect, useState, useContext } from 'react';
import { Typography, Grid, List, Paper } from '@material-ui/core';

// Local Imports
import getAllKoboAssets from './KoboFormAuth';
import FormsLoadingSkeleton from './FormsLoadingSkeleton';
import { Context } from '../Store/Store';
import { bannedRoles } from '../utils/constants';

import { BannedRoleMessage } from '../utils/CustomComponents';

import FormsStatus from './components/FormsStatus';

// Default function
const Forms = () => {
  const [isPSALoading, setIsPSALoading] = useState(true);
  const [showForms, setShowForms] = useState(false);
  const [state] = useContext(Context);

  const [psaForms, setPsaForms] = useState([]);

  useEffect(() => {
    setIsPSALoading(true);
    if (bannedRoles.includes(state.userRole)) {
      setShowForms(false);
      setIsPSALoading(false);
    } else {
      getAllKoboAssets('psa')
        .then((response) => {
          const allForms = response.data.data.results;
          console.log(allForms);
          const forms = allForms
            .filter(
              (form) =>
                !form.name.match(/^.*DEPRECATED*.$/gi) && !form.name.match(/^.*TESTING*.$/gi),
            )
            .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
          setPsaForms(forms);
        })
        .then(() => {
          setShowForms(true);
          setIsPSALoading(false);
        });
    }
  }, [state.userRole]);

  // useEffect(() => {
  //   if (state.userInfo) getKoboUsernames(state);
  // }, [state]);

  return showForms ? (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" className="mb-2">
          PSA Forms
        </Typography>
      </Grid>

      {isPSALoading ? (
        <Grid item xs={12}>
          <FormsLoadingSkeleton />
        </Grid>
      ) : psaForms.length > 0 ? (
        <List>
          <Grid item xs={12} container spacing={2}>
            {psaForms.map((form, index) =>
              form.name !== '' && form.deployment__active ? (
                <Grid item xs={12} key={`psa-form-${index}`}>
                  <Paper elevation={state.isDarkTheme ? 3 : 1}>
                    <FormsStatus form={form} />
                  </Paper>
                </Grid>
              ) : (
                ''
              ),
            )}
          </Grid>
        </List>
      ) : (
        ''
      )}
    </Grid>
  ) : isPSALoading ? (
    <FormsLoadingSkeleton />
  ) : (
    <BannedRoleMessage title="Forms Page" />
  );
};

export default Forms;
