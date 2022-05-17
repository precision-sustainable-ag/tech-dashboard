// Dependency Imports
import { Button, Grid, Snackbar, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// Local Imports
// import { Context } from '../Store/Store';
import { apiPassword, apiURL, apiUsername } from '../utils/api_secret';
import { bannedRoles } from '../utils/constants';
import { BannedRoleMessage, CustomLoader } from '../utils/CustomComponents';
import EnrollNewSite from './EnrollNewSite';

// Default function
const SiteEnrollment = (props) => {
  // const [state] = useContext(Context);
  const userInfo = useSelector((state) => state.userInfo);
  const [totalSitesEnrolled, setTotalSitesEnrolled] = useState(0);
  const [stateSitesEnrolled, setStateSitesEnrolled] = useState(0);
  const [showStateSpecificSites, setShowStateSpecificSites] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [bannedRolesCheckMessage, setBannedRolesCheckMessage] = useState(
    'Checking your permissions..',
  );
  const [enrollNewSite, setEnrollNewSite] = useState(false);
  const [savedData, setSavedData] = useState(false);
  const [fetchingStats, setFetchingStats] = useState(true);
  useEffect(() => {
    if (userInfo.state) {
      if (userInfo.role) {
        if (bannedRoles.includes(userInfo.role)) {
          setShowContent(false);
          setBannedRolesCheckMessage(<BannedRoleMessage title="Site Enrollment" />);
        } else {
          setShowContent(true);
          if (userInfo.state === 'all') {
            setShowStateSpecificSites(false);
          } else {
            setShowStateSpecificSites(true);
          }
          setFetchingStats(true);
          getStats(userInfo.state)
            .then((data) => {
              setTotalSitesEnrolled(data.total);
              setStateSitesEnrolled(data.state);
            })
            .then(() => setFetchingStats(false));
        }
      }
    }
  }, [userInfo.apikey, userInfo.role, userInfo.state]);

  return showContent ? (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={() => setEnrollNewSite(!enrollNewSite)}
          color={enrollNewSite ? 'secondary' : 'primary'}
        >
          {enrollNewSite ? 'Cancel' : 'Enroll Site'}
        </Button>
      </Grid>

      {enrollNewSite ? (
        <EnrollNewSite
          enrollNewSite={enrollNewSite}
          setEnrollNewSite={setEnrollNewSite}
          saveData={savedData}
          setSaveData={setSavedData}
          {...props}
        />
      ) : (
        <Grid item xs={12}>
          {!fetchingStats ? (
            <>
              {showStateSpecificSites && (
                <Typography variant="body1" gutterBottom>
                  {stateSitesEnrolled} sites enrolled in your team
                  {userInfo.state.split(',').length > 1 ? 's' : ''}:{' '}
                  {userInfo.state.split(',').join(', ')}
                </Typography>
              )}
              <Typography variant="body1">
                {totalSitesEnrolled} sites enrolled across all teams.
              </Typography>
            </>
          ) : (
            <CustomLoader width="50px" height="50px" />
          )}
        </Grid>
      )}
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        open={savedData}
        autoHideDuration={6000}
        onClose={() => setSavedData(false)}
      >
        <Alert onClose={() => setSavedData(false)} severity="success">
          Site successfully enrolled!
        </Alert>
      </Snackbar>
    </Grid>
  ) : (
    <div>{bannedRolesCheckMessage}</div>
  );
};

export default SiteEnrollment;

// Helper functions
const getStats = async (state) => {
  let records = await fetchStats(state);

  let data = records.data.data;

  return data;
};

const fetchStats = async (state) => {
  return await Axios.get(`${apiURL}/api/total/sites/${state}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  });
};
