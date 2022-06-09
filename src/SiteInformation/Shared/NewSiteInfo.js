// Dependency Imports
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { setEditLocationModalOpen, setEditLocationModalData } from '../../Store/actions';
// Local Imports
import { apiURL, apiUsername, apiPassword } from '../../utils/api_secret';
import EditLocationModal from './EditLocationModal';
import { useSelector, useDispatch } from 'react-redux';
import { setEnrollmentData } from '../../Store/actions';

// Default function
export const NewSiteInfo = () => {
  const dispatch = useDispatch();
  const enrollmentData = useSelector((state) => state.enrollmentData.data);
  const [shuffleSites, setShuffleSites] = useState(false);
  const [totalSites, setTotalSites] = useState(0);

  useEffect(() => {
    setTotalSites(0);
  }, [enrollmentData.growerInfo.producerId]);

  useEffect(() => {
    const fetchSiteCodes = async (size, affiliation) => {
      // TODO: check university or partner
      return await Axios.get(`${apiURL}/api/sites/codes/unused/${affiliation}/${size}`, {
        auth: {
          username: apiUsername,
          password: apiPassword,
        },
      });
    };

    if (totalSites !== 0) {
      let siteCodesPromise = fetchSiteCodes(totalSites, enrollmentData.affiliation);
      siteCodesPromise.then((resp) => {
        let unusedSites = resp.data.data;
        let siteTemplate = unusedSites.map((site) => {
          return {
            code: site,
            irrigation: false,
            address: '',
            county: '',
            latitude: '',
            longitude: '',
            additionalContact: '',
            notes: '',
          };
        });
        siteTemplate = siteTemplate.sort((a, b) => b.code < a.code);
        dispatch(
          setEnrollmentData({
            ...enrollmentData,
            growerInfo: { ...enrollmentData.growerInfo, sites: siteTemplate },
          }),
        );
      });
    }
  }, [totalSites, enrollmentData.affiliation, shuffleSites]);

  const handleDialogOpen = (siteInfo) => {
    dispatch(setEditLocationModalOpen(true));
    dispatch(
      setEditLocationModalData({
        county: siteInfo.county,
        state: siteInfo.state,
        latitude: siteInfo.latitude,
        longitude: siteInfo.longitude,
        address: siteInfo.address,
        notes: siteInfo.notes,
        additional_contact: siteInfo.additional_contact,
        irrigation: siteInfo.irrigation,
        code: siteInfo.code,
        year: enrollmentData.year,
        affiliation: enrollmentData.affiliation,
        producer_id: enrollmentData.growerInfo.producerId,
        last_name: enrollmentData.growerInfo.lastName,
        email: enrollmentData.growerInfo.email,
      }),
    );
  };

  const shuffleSitesFunc = () => {
    let temp_code = shuffleSites;
    setShuffleSites(!temp_code);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">
          Site Information for {enrollmentData.growerInfo.lastName}[
          {enrollmentData.growerInfo.producerId}]
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Select
          autoFocus
          fullWidth
          value={totalSites}
          onChange={(e) => setTotalSites(parseInt(e.target.value))}
        >
          <MenuItem value={0}>No Sites</MenuItem>
          {[1, 2, 3, 4, 5, 6].map((sites, index) => (
            <MenuItem key={`totalSites-${index}`} value={sites}>
              {index === 0 ? `${sites} Site` : `${sites} Sites`}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Total number of sites to be assigned</FormHelperText>
      </Grid>
      <Grid item xs={12} md={6} spacing={3}>
        <Button size="small" variant="outlined" onClick={shuffleSitesFunc}>
          Shuffle Code
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {enrollmentData.growerInfo.sites && enrollmentData.growerInfo.sites.length > 0
            ? enrollmentData.growerInfo.sites.map((siteInfo, index) => (
                <Grid item xs={12} md={4} key={`newSites-${index}`}>
                  <Card>
                    <CardHeader title={siteInfo.code} />
                    <CardContent>
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <Typography variant="body2">County</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {siteInfo.county ? siteInfo.county : 'No Data'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">State</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {siteInfo.state ? siteInfo.state : 'No Data'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">Latitude</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {siteInfo.latitude ? siteInfo.latitude : 'No Data'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">Longitude</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {siteInfo.longitude ? siteInfo.longitude : 'No Data'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">Field Address</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {siteInfo.address ? siteInfo.address : 'No Data'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">Notes</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {siteInfo.notes ? siteInfo.notes : 'No Data'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">Additional Contact</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {siteInfo.additionalContact ? siteInfo.additionalContact : 'No Data'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">Irrigation</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {siteInfo.irrigation ? 'Yes' : 'No'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Button variant="outlined" onClick={() => handleDialogOpen(siteInfo)}>
                        Open map to edit
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            : ''}
        </Grid>
      </Grid>
      <EditLocationModal action="create" />
    </Grid>
  );
};
