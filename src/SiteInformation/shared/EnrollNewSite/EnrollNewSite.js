// Dependency Imports
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Grid, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import Axios from 'axios';
import { Alert } from '@material-ui/lab';
import PropTypes from 'prop-types';
// Local Imports
import GrowerInformation from '../GrowerInformation/GrowerInformation';
import { apiPassword, apiURL, apiUsername } from '../../../utils/api_secret';
import { useSelector } from 'react-redux';
import { setEnrollmentData, setEnrollNewSite, setSavedData } from '../../../Store/actions';
import { useDispatch } from 'react-redux';
import { fetchSiteAffiliations } from '../functions';

//Global Vars
const qs = require('qs');

// Default function
const EnrollNewSite = (props) => {
  const { editSite } = props;
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.userInfo);
  const enrollNewSite = useSelector((state) => state.enrollmentData.enrollNewSite);
  const enrollmentData = useSelector((state) => state.enrollmentData.data);

  const [loading, setLoading] = useState();
  const currentYear = new Date().getFullYear();
  const [allAffiliations, setAllAffiliations] = useState([]);
  const [affiliationError, setAffiliationError] = useState(false);
  const [enrollmentYearError, setEnrollmentYearError] = useState(false);

  const history = useHistory();

  useEffect(() => {
    dispatch(
      setEnrollmentData({
        year: 'none',
        affiliation: 'none',
        growerInfo: {
          collaborationStatus: 'University',
          producerId: '',
          phone: '',
          lastName: '',
          email: '',
          sites: [],
        },
      }),
    );
  }, [enrollNewSite]);

  const finalConfirm = () => {
    enrollmentData.growerInfo.sites.forEach((sitesData, index) => {
      let dataObject = {
        producerId: enrollmentData.growerInfo.producerId,
        year: enrollmentData.year,
        code: sitesData.code,
        affiliation: enrollmentData.affiliation,
        irrigation: sitesData.irrigation,
        county: sitesData.county,
        address: sitesData.address,
        state: sitesData.state,
        additionalContact: sitesData.additionalContact,
        notes: sitesData.notes,
        latitude: sitesData.latitude,
        longitude: sitesData.longitude,
      };

      let dataString = qs.stringify(dataObject);
      Axios.post(`${apiURL}/api/sites/add`, dataString, {
        auth: {
          username: apiUsername,
          password: apiPassword,
        },
        headers: {
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      })
        .then((res) => {
          console.log(res.data);
        })
        .then(() => {
          // reset everything
          dispatch(
            setEnrollmentData({
              year: 'none',
              affiliation: 'none',
              growerInfo: {
                collaborationStatus: 'University',
                producerId: '',
                phone: '',
                lastName: '',
                email: '',
                sites: [],
              },
            }),
          );
          dispatch(setEnrollNewSite(false));
          dispatch(setSavedData(true));
          if (index === enrollmentData.growerInfo.sites.length - 1)
            history.push(`/site-information/contact-enrollment`, {});
        })
        .catch((e) => {
          console.error(e);
        });
    });
  };

  useEffect(() => {
    setLoading(true);
    // get remote data
    let siteAffResponse = fetchSiteAffiliations();

    siteAffResponse
      .then((res) => {
        let affiliations = res.data.data;
        let permittedAffiliations = [];
        if (userInfo.state === 'all') {
          setAllAffiliations(affiliations);
        } else {
          const dbPermittedAffiliations = userInfo.state.split(',');
          dbPermittedAffiliations.forEach((element) => {
            let a = affiliations.filter((data) => data.affiliation === element);
            permittedAffiliations.push(a);
          });
          setAllAffiliations(permittedAffiliations.flat());
        }
      })
      .then(() => {
        setLoading(false);
      });
  }, [userInfo.state]);

  return (
    <LoadingWrapper loading={loading}>
      <Grid container spacing={3} alignItems="center">
        {!editSite && (
          <>
            <Grid item xs={12}>
              <Typography variant="h4">Basic Information</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <InputLabel error={enrollmentYearError} htmlFor="enroll-year">
                Cash Crop Year
              </InputLabel>
              <Select
                fullWidth
                error={enrollmentYearError}
                value={enrollmentData.year}
                onChange={(e) => {
                  if (e.target.value !== 'none') {
                    setEnrollmentYearError(false);
                    dispatch(setEnrollmentData({ ...enrollmentData, year: e.target.value }));
                  } else {
                    setEnrollmentYearError(true);
                  }
                }}
                inputProps={{
                  name: 'year',
                  id: 'enroll-year',
                }}
              >
                <MenuItem value="none"></MenuItem>
                <MenuItem value={currentYear}>{currentYear}</MenuItem>
                <MenuItem value={currentYear + 1}>{currentYear + 1}</MenuItem>
                <MenuItem value={currentYear + 2}>{currentYear + 2}</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} md={6}>
              <InputLabel
                // classes={{ root: styles.labelRoot }}
                error={affiliationError}
                htmlFor="enroll-affiliation"
              >
                Affiliation
              </InputLabel>
              <Select
                fullWidth
                value={enrollmentData.affiliation}
                error={affiliationError}
                onChange={(e) => {
                  if (e.target.value !== 'none') {
                    setAffiliationError(false);
                    dispatch(
                      setEnrollmentData({
                        ...enrollmentData,
                        affiliation: e.target.value,
                      }),
                    );
                  } else {
                    setAffiliationError(true);
                  }
                }}
                inputProps={{
                  name: 'year',
                  id: 'enroll-year',
                }}
              >
                <MenuItem value="none"></MenuItem>
                {allAffiliations.map((data, index) => (
                  <MenuItem key={`aff-${index}`} value={data.affiliation}>
                    {data.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            {enrollmentData.affiliation === '' ||
            enrollmentData.affiliation === 'none' ||
            enrollmentData.year === 'none' ? (
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="body2">
                    Make sure you have selected the <b>year</b> and <b>affiliation</b>
                  </Typography>
                </Alert>
              </Grid>
            ) : (
              <GrowerInformation editSite={false} />
            )}
          </>
        )}

        {editSite && <GrowerInformation editSite={true} />}

        {enrollmentData?.growerInfo?.sites && enrollmentData?.growerInfo?.sites?.length > 0 ? (
          <Grid item xs={12}>
            <Grid container justifyContent="center" alignItems="center">
              <Button size="large" variant="contained" color="primary" onClick={finalConfirm}>
                Confirm Site Information
              </Button>
            </Grid>
          </Grid>
        ) : (
          ''
        )}
      </Grid>
    </LoadingWrapper>
  );
};

export default EnrollNewSite;

EnrollNewSite.propTypes = {
  editSite: PropTypes.bool,
};

// Helper functions
const LoadingWrapper = ({ children, loading }) => {
  return loading ? 'Loading' : <>{children}</>;
};

LoadingWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  loading: PropTypes.bool,
};
