// Dependency Imports
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Grid, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import Axios from 'axios';
import { Alert } from '@material-ui/lab';
import PropTypes from 'prop-types';
// Local Imports
// import { Context } from '../Store/Store';
import GrowerInformation from './GrowerInformation';
import { apiPassword, apiURL, apiUsername } from '../utils/api_secret';
import { useSelector } from 'react-redux';

//Global Vars
const qs = require('qs');

// const useStyles = makeStyles(() => ({
//   labelRoot: {
//     fontSize: "1.2rem",
//   },
// }));

// Default function
const EnrollNewSite = (props) => {
  // const [state] = useContext(Context);
  const userInfo = useSelector((state) => state.theStore.userInfo);
  // const theme = useTheme();
  // const styles = useStyles(theme);
  // const mediumUpScreen = useMediaQuery(theme.breakpoints.up("md"));

  const [loading, setLoading] = useState();
  const currentYear = new Date().getFullYear();
  const [allAffiliations, setAllAffiliations] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState({
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
  });
  const history = useHistory();

  useEffect(() => {
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
    });
  }, [props.enrollNewSite]);
  const finalConfirm = () => {
    enrollmentData.growerInfo.sites.forEach((sitesData) => {
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

      //   console.log(dataObject);

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
          });
          props.setEnrollNewSite(false);
          props.setSaveData(true);
        })
        .catch((e) => {
          console.error(e);
        });
    });

    history.push(`/site-information/contact-enrollment`, {});
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
  const [affiliationError, setAffiliationError] = useState(false);
  const [enrollmentYearError, setEnrollmentYearError] = useState(false);
  return (
    <LoadingWrapper loading={loading}>
      {/* {mediumUpScreen ? ( */}

      <Grid container spacing={3} alignItems="center">
        {!props.editSite && (
          <>
            <Grid item xs={12}>
              <Typography variant="h4">Basic Information</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <InputLabel
                // classes={{ root: styles.labelRoot }}
                error={enrollmentYearError}
                htmlFor="enroll-year"
              >
                Cash Crop Year
              </InputLabel>
              <Select
                fullWidth
                error={enrollmentYearError}
                value={enrollmentData.year}
                onChange={(e) => {
                  if (e.target.value !== 'none') {
                    setEnrollmentYearError(false);
                    setEnrollmentData({ ...enrollmentData, year: e.target.value });
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
                    setEnrollmentData({
                      ...enrollmentData,
                      affiliation: e.target.value,
                    });
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
              ''
            )}
          </>
        )}
        {/* Grower Information  */}
        {enrollmentData.affiliation === 'none' ||
        enrollmentData.affiliation === '' ||
        enrollmentData.year === 'none' ? (
          ''
        ) : (
          <GrowerInformation
            enrollmentData={enrollmentData}
            setEnrollmentData={setEnrollmentData}
            editSite={props.editSite}
            code={props.code}
            producerId={props.producerId}
            year={props.year}
          />
        )}

        {props.editSite && (
          <GrowerInformation
            enrollmentData={enrollmentData}
            setEnrollmentData={setEnrollmentData}
            editSite={props.editSite}
            code={props.code}
            producerId={props.producerId}
            year={props.year}
            affiliation={props.affiliation}
            // closeModal={props.closeModal}
            // setValuesEdited={props.setValuesEdited}
          />
        )}

        {enrollmentData.growerInfo.sites && enrollmentData.growerInfo.sites.length > 0 ? (
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
  setEnrollNewSite: PropTypes.func,
  setSaveData: PropTypes.func,
  enrollNewSite: PropTypes.any,
  editSite: PropTypes.bool,
  code: PropTypes.string,
  producerId: PropTypes.string,
  year: PropTypes.any,
  affiliation: PropTypes.string,
  // closeModal: PropTypes.func,
  // setValuesEdited: PropTypes.func,
};

// Helper functions
const LoadingWrapper = ({ children, loading }) => {
  return loading ? 'Loading' : <>{children}</>;
};

LoadingWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  loading: PropTypes.bool,
};

const fetchSiteAffiliations = async () => {
  return await Axios.get(`${apiURL}/api/retrieve/grower/affiliation/all`, {
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  });
};
