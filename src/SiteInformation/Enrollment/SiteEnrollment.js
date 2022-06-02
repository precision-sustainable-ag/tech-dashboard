// Dependency Imports
import { Button, Grid, Snackbar, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEnrollNewSite, setSavedData } from '../../Store/actions';

// Local Imports
import { bannedRoles } from '../../utils/constants';
import { BannedRoleMessage, CustomLoader } from '../../utils/CustomComponents';
import EnrollNewSite from '../Shared/EnrollNewSite';
import { getStats } from '../Shared/functions';

// Default function
const SiteEnrollment = () => {
  const dispatch = useDispatch();

  const [totalSitesEnrolled, setTotalSitesEnrolled] = useState(0);
  const [stateSitesEnrolled, setStateSitesEnrolled] = useState(0);
  const [showStateSpecificSites, setShowStateSpecificSites] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [bannedRolesCheckMessage, setBannedRolesCheckMessage] = useState(
    'Checking your permissions..',
  );

  const enrollNewSite = useSelector((state) => state.enrollmentData.enrollNewSite);
  const savedData = useSelector((state) => state.enrollmentData.savedData);
  const userInfo = useSelector((state) => state.userInfo);

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
          onClick={() => dispatch(setEnrollNewSite(!enrollNewSite))}
          color={enrollNewSite ? 'secondary' : 'primary'}
        >
          {enrollNewSite ? 'Cancel' : 'Enroll Site'}
        </Button>
      </Grid>

      {enrollNewSite ? (
        <EnrollNewSite />
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
        onClose={() => dispatch(setSavedData(false))}
      >
        <Alert onClose={() => dispatch(setSavedData(false))} severity="success">
          Site successfully enrolled!
        </Alert>
      </Snackbar>
    </Grid>
  ) : (
    <div>{bannedRolesCheckMessage}</div>
  );
};

export default SiteEnrollment;
