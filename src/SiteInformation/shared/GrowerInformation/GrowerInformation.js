import { Button, FormControlLabel, Grid, Radio, TextField, Typography } from '@material-ui/core';
import { Save } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import PropTypes from 'prop-types';

// Local Imports
import { NewSiteInfo } from '../NewSiteInfo/NewSiteInfo';
import { useAuth0 } from '../../../Auth/react-auth0-spa';
import { useDispatch, useSelector } from 'react-redux';
import {
  setReassignSiteModalOpen,
  setEnrollmentValuesEdited,
  setEnrollmentData,
  setSnackbarData,
} from '../../../Store/actions';
import ExistingGrowersGrid from '../ExistingGrowersGrid/ExistingGrowersGrid';
import { saveNewGrowerAndFetchProducerId, fetchGrowerByLastName, updateSite } from '../functions';

// Default function
const GrowerInformation = ({ editSite }) => {
  const dispatch = useDispatch();
  const { getTokenSilently } = useAuth0();

  const [growerType, setGrowerType] = useState('existing');
  const [growerLastNameSearch, setGrowerLastNameSearch] = useState('');
  const [allGrowers, setAllGrowers] = useState([]);
  const [showSitesInfo, setShowSitesInfo] = useState(false);
  const [savingProducerId, setSavingProducerId] = useState(false);

  const reassignSiteModalOpen = useSelector((state) => state.tableData.reassignSiteModalOpen);
  const reassignSiteModalData = useSelector((state) => state.tableData.reassignSiteModalData);
  const enrollmentData = useSelector((state) => state.enrollmentData.data);
  const userInfo = useSelector((state) => state.userInfo);
  const enrollmentValuesEdited = useSelector(
    (state) => state.sharedSiteInfo.enrollmentValuesEdited,
  );

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
          dispatch(
            setEnrollmentData({
              ...enrollmentData,
              growerInfo: {
                ...enrollmentData.growerInfo,
                producerId: newProducerId,
              },
            }),
          );
          setSavingProducerId(false);
        });
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (growerType === 'existing' && growerLastNameSearch !== '') {
      let lastNamePromise = fetchGrowerByLastName(growerLastNameSearch, userInfo.apikey);
      lastNamePromise.then((resp) => {
        let data = resp;
        if (data.length > 0) {
          setAllGrowers(data);
        } else {
          setAllGrowers([]);
        }
      });
    }
    dispatch(
      setEnrollmentData({
        ...enrollmentData,
        growerInfo: {
          collaborationStatus: 'University',
          producerId: '',
          phone: '',
          firstName: '',
          lastName: '',
          email: '',
        },
      }),
    );
  }, [growerLastNameSearch, growerType]);

  return (
    <>
      <Grid item sm={12}>
        <Typography variant="h4">Grower Information</Typography>
      </Grid>
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
                  dispatch(
                    setEnrollmentData({
                      ...enrollmentData,
                      growerInfo: {
                        ...enrollmentData.growerInfo,
                        firstName: e.target.value,
                      },
                    }),
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Name"
                value={enrollmentData.growerInfo.lastName}
                onChange={(e) =>
                  dispatch(
                    setEnrollmentData({
                      ...enrollmentData,
                      growerInfo: {
                        ...enrollmentData.growerInfo,
                        lastName: e.target.value,
                      },
                    }),
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={enrollmentData.growerInfo.email}
                onChange={(e) =>
                  dispatch(
                    setEnrollmentData({
                      ...enrollmentData,
                      growerInfo: {
                        ...enrollmentData.growerInfo,
                        email: e.target.value,
                      },
                    }),
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <InputMask
                mask="(999) 999-9999"
                value={enrollmentData.growerInfo.phone}
                disabled={false}
                onChange={(e) =>
                  dispatch(
                    setEnrollmentData({
                      ...enrollmentData,
                      growerInfo: {
                        ...enrollmentData.growerInfo,
                        phone: e.target.value,
                      },
                    }),
                  )
                }
              >
                {() => <TextField fullWidth label="Phone number" />}
              </InputMask>
            </Grid>
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
                  updateSite(
                    enrollmentData,
                    getTokenSilently,
                    reassignSiteModalData.code,
                    reassignSiteModalData.producerId,
                    reassignSiteModalData.year,
                    reassignSiteModalData.affiliation,
                    growerType,
                  )
                    .then(() => {
                      dispatch(
                        setSnackbarData({
                          open: true,
                          text: `Updated grower successfully. Please edit the site information if necessary.`,
                          severity: 'success',
                        }),
                      );
                    })
                    .catch(() => {
                      dispatch(
                        setSnackbarData({
                          open: true,
                          text: `Oops! Could not update grower information.`,
                          severity: 'error',
                        }),
                      );
                    })
                    .finally(() => {
                      setTimeout(() => {
                        dispatch(setReassignSiteModalOpen(!reassignSiteModalOpen));
                        dispatch(setEnrollmentValuesEdited(!enrollmentValuesEdited));
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
          <NewSiteInfo />
        </Grid>
      ) : (
        ''
      )}
    </>
  );
};

export default GrowerInformation;

GrowerInformation.propTypes = {
  editSite: PropTypes.bool,
};
