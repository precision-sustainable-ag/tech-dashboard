import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  Radio,
  TextField,
  Typography,
  Snackbar,
  makeStyles,
} from '@material-ui/core';
import { Check, Save } from '@material-ui/icons';
import Axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import InputMask from 'react-input-mask';
import PropTypes from 'prop-types';
import { Context } from '../Store/Store';

// Local Imports
import { apiPassword, apiURL, apiUsername } from '../utils/api_secret';
import { fetchGrowerByLastName, ucFirst } from '../utils/constants';
import { NewSiteInfo } from './NewSiteInfo';
import { callAzureFunction } from '../utils/SharedFunctions';
import { useAuth0 } from '../Auth/react-auth0-spa';
import MuiAlert from '@material-ui/lab/Alert';

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(() => ({
  cardHeight: {
    height: '100%',
  },
  cardContent: {
    height: '60%',
  },
  cardHeaderFooter: {
    height: '20%',
  },
}));

//Global Vars
const qs = require('qs');

// Default function
const GrowerInformation = ({
  enrollmentData,
  setEnrollmentData,
  editSite,
  code,
  producerId,
  year,
  affiliation,
  closeModal,
  setValuesEdited,
}) => {
  const [growerType, setGrowerType] = useState('existing');
  const [growerLastNameSearch, setGrowerLastNameSearch] = useState('');
  const [allGrowers, setAllGrowers] = useState([]);
  const [, setSiteCodes] = useState([]);
  const [showSitesInfo, setShowSitesInfo] = useState(false);
  const [savingProducerId, setSavingProducerId] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: '',
    severity: 'success',
  });
  const [state] = useContext(Context);
  const { getTokenSilently } = useAuth0();

  const handleNewGrowerInfo = () => {
    if (window.confirm('Are you sure you want to save this grower?')) {
      if (
        Object.keys(enrollmentData.growerInfo).length === 0 ||
        enrollmentData.growerInfo.lastName === ''
      ) {
        alert('Please enter grower information: Last Name');
      } else {
        setSavingProducerId(true);
        let newGrowerPromise = saveNewGrowerAndFetchProducerId(enrollmentData);
        newGrowerPromise.then((resp) => {
          let newProducerId = resp.data.producerId;
          setEnrollmentData({
            ...enrollmentData,
            growerInfo: {
              ...enrollmentData.growerInfo,
              producerId: newProducerId,
            },
          });
          setSavingProducerId(false);
        });
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (growerType === 'existing' && growerLastNameSearch !== '') {
      let lastNamePromise = fetchGrowerByLastName(growerLastNameSearch, state.userInfo.apikey);
      lastNamePromise.then((resp) => {
        let data = resp;
        if (data.length > 0) {
          setAllGrowers(data);
        } else {
          setAllGrowers([]);
          setSiteCodes([]);
        }
      });
    }
    setEnrollmentData((enroll) => ({
      ...enroll,
      growerInfo: {
        collaborationStatus: 'University',
        producerId: '',
        phone: '',
        firstName: '',
        lastName: '',
        email: '',
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [growerLastNameSearch, growerType]);

  return (
    <>
      <Grid item sm={12}>
        <Typography variant="h4">Grower Information</Typography>
      </Grid>
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
      <Grid item sm={12}>
        <Grid container alignContent="center" justifyContent="center" spacing={2}>
          <Grid item>
            <FormControlLabel
              value="existing"
              checked={growerType === 'existing' ? true : false}
              onChange={() => setGrowerType('existing')}
              control={<Radio color="primary" />}
              label="Use Existing Grower"
              labelPlacement="top"
            />
            {/* <Button variant="contained">Use Existing Grower</Button> */}
          </Grid>
          <Grid item>
            <FormControlLabel
              value="new"
              onChange={() => setGrowerType('new')}
              checked={growerType === 'new' ? true : false}
              control={<Radio color="primary" />}
              label="Add New Grower"
              labelPlacement="top"
            />
            {/* <Button variant="contained">Add New Grower</Button> */}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {growerType === 'existing' ? (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h5">Existing Grower</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                value={growerLastNameSearch}
                onChange={(e) => setGrowerLastNameSearch(e.target.value)}
                fullWidth
                label="Search Growers By Last Name"
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <ExistingGrowersGrid
                  allGrowers={allGrowers}
                  growerLastName={growerLastNameSearch}
                  enrollmentData={enrollmentData}
                  setEnrollmentData={setEnrollmentData}
                />
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h5">New Grower</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Name"
                value={enrollmentData.growerInfo.firstName}
                onChange={(e) =>
                  setEnrollmentData({
                    ...enrollmentData,
                    growerInfo: {
                      ...enrollmentData.growerInfo,
                      firstName: e.target.value,
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Name"
                value={enrollmentData.growerInfo.lastName}
                onChange={(e) =>
                  setEnrollmentData({
                    ...enrollmentData,
                    growerInfo: {
                      ...enrollmentData.growerInfo,
                      lastName: e.target.value,
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={enrollmentData.growerInfo.email}
                onChange={(e) =>
                  setEnrollmentData({
                    ...enrollmentData,
                    growerInfo: {
                      ...enrollmentData.growerInfo,
                      email: e.target.value,
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              {/* <TextField
                fullWidth
                label="Phone"
                value={enrollmentData.growerInfo.phone}
                onChange={(e) =>
                  setEnrollmentData({
                    ...enrollmentData,
                    growerInfo: {
                      ...enrollmentData.growerInfo,
                      phone: e.target.value,
                    },
                  })
                }
              /> */}
              {/* a.split("(").join("").split(")").join("").split(" ").join("").split("-").join("") */}
              <InputMask
                mask="(999) 999-9999"
                value={enrollmentData.growerInfo.phone}
                disabled={false}
                onChange={(e) =>
                  setEnrollmentData({
                    ...enrollmentData,
                    growerInfo: {
                      ...enrollmentData.growerInfo,
                      phone: e.target.value,
                    },
                  })
                }
              >
                {() => <TextField fullWidth label="Phone number" />}
              </InputMask>
              {/* <CustomPhoneInput
                placeholder="Enter phone number"
                value={enrollmentData.growerInfo.phone}
                onChange={(e) => {
                  setEnrollmentData({
                    ...enrollmentData,
                    growerInfo: {
                      ...enrollmentData.growerInfo,
                      phone: e.target.value,
                    },
                  });
                }}
              /> */}
              {/* <Input
                country="US"
                international={false}
                inputComponent={CustomPhoneInput}
                placeholder="Enter phone number"
              /> */}
            </Grid>
            {/* <Grid item xs={12}>
              <Select
                fullWidth
                value={
                  Object.keys(enrollmentData.growerInfo).length === 0 ||
                  enrollmentData.growerInfo.collaborationStatus === ""
                    ? "University"
                    : enrollmentData.growerInfo.collaborationStatus
                }
                onChange={(e) =>
                  setEnrollmentData({
                    ...enrollmentData,
                    growerInfo: {
                      ...enrollmentData.growerInfo,
                      collaborationStatus: e.target.value,
                    },
                  })
                }
                inputProps={{
                  name: "collab-status",
                  id: "enroll-collab-status",
                }}
              >
                <MenuItem value="University">University</MenuItem>
                <MenuItem value="Partner">Partner</MenuItem>
              </Select>
            </Grid> */}
            {!editSite && (
              <Grid item xs={12}>
                <Button size="small" variant="outlined" onClick={handleNewGrowerInfo}>
                  <Save fontSize="small" />
                  &nbsp;Save
                </Button>
              </Grid>
            )}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        {/* <SiteSelection /> */}
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            {!editSite ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setShowSitesInfo(true);
                  window.scrollTo(0, document.body.scrollHeight);
                }}
                disabled={
                  enrollmentData.growerInfo.producerId === '' ||
                  Object.keys(enrollmentData.growerInfo).length === 0 ||
                  showSitesInfo
                    ? true
                    : false
                }
              >
                {savingProducerId ? 'Saving New Grower' : 'Next Step'}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  let id =
                    growerType === 'existing' ? enrollmentData.growerInfo.producerId : producerId;
                  let updateData = updateSite(
                    enrollmentData,
                    getTokenSilently,
                    code,
                    id,
                    year,
                    affiliation,
                    growerType,
                  );
                  updateData
                    .then(() => {
                      setSnackbarData({
                        open: true,
                        text: `Updated grower successfully. Please edit the site information if necessary.`,
                        severity: 'success',
                      });
                    })
                    .catch(() => {
                      setSnackbarData({
                        open: true,
                        text: `Oops! Could not update grower information.`,
                        severity: 'error',
                      });
                    })
                    .finally(() => {
                      setTimeout(() => {
                        closeModal();
                        setValuesEdited(true);
                      }, 2500);
                    });
                }}
                color="primary"
                variant="contained"
              >
                Update
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
      {showSitesInfo && enrollmentData.growerInfo.producerId ? (
        <Grid item xs={12}>
          <NewSiteInfo enrollmentData={enrollmentData} setEnrollmentData={setEnrollmentData} />
        </Grid>
      ) : (
        ''
      )}
    </>
  );
};

export default GrowerInformation;

// Helper functions
const ExistingGrowersGrid = ({
  allGrowers = [],
  growerLastName = '',
  enrollmentData = {},
  setEnrollmentData = () => {},
}) => {
  const classes = useStyles();

  return allGrowers.length > 0 ? (
    allGrowers.map((grower, index) => {
      // fetchSiteCodesFor(grower.producer_id);

      return (
        <Grid item key={`existing-grower-${index}`} sm={6} md={3} className={classes.cardHeight}>
          <Card className={classes.cardHeight}>
            <CardHeader
              avatar={<Avatar>{grower.last_name.charAt(0).toUpperCase()}</Avatar>}
              title={ucFirst(grower.last_name)}
              className={classes.cardHeaderFooter}
            />

            <CardContent className={classes.cardContent}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Producer ID</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{grower.producer_id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Email</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{grower.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Phone</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{grower.phone}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Site Code</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{grower.codes.split('.').join(', ')}</Typography>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions className={classes.cardHeaderFooter}>
              <Button
                size="small"
                color={
                  enrollmentData.growerInfo.producerId === grower.producer_id
                    ? 'primary'
                    : 'default'
                }
                variant="contained"
                onClick={() => {
                  setEnrollmentData({
                    ...enrollmentData,
                    growerInfo: {
                      producerId: grower.producer_id,
                      collaborationStatus: grower.collaboration_status
                        ? grower.collaboration_status
                        : 'University',
                      phone: grower.phone,
                      lastName: grower.last_name,
                      email: grower.email,
                    },
                  });
                }}
                startIcon={
                  enrollmentData.growerInfo.producerId === grower.producer_id ? <Check /> : <Save />
                }
              >
                {enrollmentData.growerInfo.producerId === grower.producer_id
                  ? 'Selected'
                  : 'Select'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      );
    })
  ) : growerLastName.length === 0 ? (
    ''
  ) : (
    <Typography variant="body1">Grower Not Found</Typography>
  );
};

const saveNewGrowerAndFetchProducerId = async (enrollmentData = {}) => {
  let dataObject = {
    firstName: enrollmentData.growerInfo.firstName,
    lastName: enrollmentData.growerInfo.lastName,
    email: enrollmentData.growerInfo.email,
    phone: enrollmentData.growerInfo.phone
      .split('(')
      .join('')
      .split(')')
      .join('')
      .split(' ')
      .join('')
      .split('-')
      .join(''),
    year: enrollmentData.year,
    affiliation: enrollmentData.affiliation,
    collaborationStatus: enrollmentData.growerInfo.collaborationStatus,
  };
  let dataString = qs.stringify(dataObject);
  return await Axios.post(`${apiURL}/api/growers/add`, dataString, {
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });
};

const updateGrowerInfo = async (enrollmentData = {}) => {
  let dataObject = {
    firstName: enrollmentData.growerInfo.firstName,
    lastName: enrollmentData.growerInfo.lastName,
    email: enrollmentData.growerInfo.email,
    phone: enrollmentData.growerInfo.phone
      .split('(')
      .join('')
      .split(')')
      .join('')
      .split(' ')
      .join('')
      .split('-')
      .join(''),
    year: enrollmentData.year,
    affiliation: enrollmentData.affiliation,
    collaborationStatus: enrollmentData.growerInfo.collaborationStatus,
  };
  let dataString = qs.stringify(dataObject);
  return await Axios.post(`${apiURL}/api/growers/add`, dataString, {
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });
};

const updateSite = async (
  enrollmentData = {},
  getTokenSilently,
  code,
  producerId,
  year,
  affiliation,
  growerType,
) => {
  if (growerType !== 'existing') {
    let newGrowerPromise = updateGrowerInfo({
      ...enrollmentData,
      year: year,
      affiliation: affiliation,
    });
    newGrowerPromise.then((resp) => {
      let apiStatus = callAzureFunction(
        null,
        `crowndb/site_information/producers/${resp.data.producerId}/${code}`,
        'POST',
        getTokenSilently,
      );
      apiStatus
        .then(() => {
          return 'success';
        })
        .catch(() => {
          return 'error';
        });
    });
  } else {
    let apiStatus = callAzureFunction(
      null,
      `crowndb/site_information/producers/${producerId}/${code}`,
      'POST',
      getTokenSilently,
    );
    apiStatus
      .then(() => {
        return 'success';
      })
      .catch(() => {
        return 'error';
      });
  }
};

GrowerInformation.propTypes = {
  enrollmentData: PropTypes.object,
  setEnrollmentData: PropTypes.func,
  editSite: PropTypes.bool,
  producerId: PropTypes.string,
  code: PropTypes.string,
  year: PropTypes.any,
  affiliation: PropTypes.string,
  closeModal: PropTypes.func,
  setValuesEdited: PropTypes.func,
};

ExistingGrowersGrid.propTypes = {
  allGrowers: PropTypes.array,
  growerLastName: PropTypes.string,
  enrollmentData: PropTypes.object,
  setEnrollmentData: PropTypes.func,
};
