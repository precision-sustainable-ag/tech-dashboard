//Dependency Imports
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import Axios from "axios";
import React, { useState, useEffect } from "react";

//Local Imports
import Location from "../Location/Location";
import { apiURL, apiUsername, apiPassword } from "../utils/api_secret";

export const NewSiteInfo = ({
  enrollmentData = {},
  setEnrollmentData = () => {},
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [maxWidth, setMaxWidth] = useState("md");
  const [totalSites, setTotalSites] = useState(0);
  useEffect(() => {
    setTotalSites(0);
  }, [enrollmentData.growerInfo.producerId]);
  useEffect(() => {
    const fetchSiteCodes = async (size, affiliation) => {
      // TODO: check university or partner
      return await Axios.get(
        `${apiURL}/api/sites/codes/unused/${affiliation}/${size}`,
        {
          auth: {
            username: apiUsername,
            password: apiPassword,
          },
        }
      );
    };
    if (totalSites !== 0) {
      let siteCodesPromise = fetchSiteCodes(
        totalSites,
        enrollmentData.affiliation
      );
      siteCodesPromise.then((resp) => {
        let unusedSites = resp.data.data;
        let siteTemplate = unusedSites.map((site) => {
          return {
            code: site,
            irrigation: false,
            address: "",
            county: "",
            latitude: "",
            longitude: "",
            additionalContact: "",
            notes: "",
          };
        });
        siteTemplate = siteTemplate.sort((a, b) => b.code < a.code);
        setEnrollmentData({
          ...enrollmentData,
          growerInfo: { ...enrollmentData.growerInfo, sites: siteTemplate },
        });
      });
    }
  }, [totalSites]);

  const [modifyNewSiteDetailsModal, setModifyNewSiteDetailsModal] = useState(
    false
  );
  const [selectedToEditSite, setSelectedToEditSite] = useState({
    code: "",
    irrigation: false,
    address: "",
    county: "",
    latitude: null,
    longitude: null,
    additionalContact: "",
    notes: "",
  });
  const handleDialogClose = () => {
    setModifyNewSiteDetailsModal(!modifyNewSiteDetailsModal);
  };
  const handleDialogOpen = (siteInfo) => {
    setSelectedToEditSite(siteInfo);
    setModifyNewSiteDetailsModal(true);
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
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {enrollmentData.growerInfo.sites &&
          enrollmentData.growerInfo.sites.length > 0
            ? enrollmentData.growerInfo.sites.map((siteInfo, index) => (
                <Grid item xs={12} md={4} key={`newSites-${index}`}>
                  <Card>
                    <CardHeader title={siteInfo.code} />
                    <CardContent>
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <Typography variant="body2">Irrigation</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {siteInfo.irrigation ? "Yes" : "No"}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">Address</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {siteInfo.address ? siteInfo.address : "No Data"}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">County</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {siteInfo.county ? siteInfo.county : "No Data"}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">Latitude</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {siteInfo.latitude ? siteInfo.latitude : "No Data"}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">Longitude</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {siteInfo.longitude
                              ? siteInfo.longitude
                              : "No Data"}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">
                            Additional Contact
                          </Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {siteInfo.additionalContact
                              ? siteInfo.additionalContact
                              : "No Data"}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">Notes</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            {siteInfo.notes ? siteInfo.notes : "No Data"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="outlined"
                        onClick={() => handleDialogOpen(siteInfo)}
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            : ""}
        </Grid>
      </Grid>
      <Dialog
        fullScreen={fullScreen}
        maxWidth={maxWidth}
        fullWidth
        open={modifyNewSiteDetailsModal}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="h4">
                Edit Details for {selectedToEditSite.code}
              </Typography>
            </Grid>
            <Grid item>
              <Select
                label="Adjust Size"
                autoFocus
                value={maxWidth}
                onChange={(e) => {
                  setMaxWidth(e.target.value);
                }}
                inputProps={{
                  name: "max-width",
                  id: "max-width",
                }}
              >
                <MenuItem value="xs">x-small</MenuItem>
                <MenuItem value="sm">small</MenuItem>
                <MenuItem value="md">medium</MenuItem>
                <MenuItem value="lg">large</MenuItem>
                <MenuItem value="xl">x-large</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Location
                searchLabel="Search for an address"
                setSelectedToEditSite={setSelectedToEditSite}
                selectedToEditSite={selectedToEditSite}
                markerLatLng={{
                  lat: selectedToEditSite.latitude,
                  lng: selectedToEditSite.longitude,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={selectedToEditSite.address}
                // onChange={(e) =>
                //   setSelectedToEditSite({
                //     ...selectedToEditSite,
                //     address: e.target.value,
                //   })
                // }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="County"
                value={selectedToEditSite.county}
                onChange={(e) =>
                  setSelectedToEditSite({
                    ...selectedToEditSite,
                    county: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                label="Latitude"
                value={selectedToEditSite.latitude}
                onChange={(e) =>
                  setSelectedToEditSite({
                    ...selectedToEditSite,
                    latitude: e.target.valueAsNumber,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                label="Longitude"
                value={selectedToEditSite.longitude}
                onChange={(e) =>
                  setSelectedToEditSite({
                    ...selectedToEditSite,
                    longitude: e.target.valueAsNumber,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                rowsMax={4}
                fullWidth
                label="Additional Contact"
                value={selectedToEditSite.additionalContact}
                onChange={(e) =>
                  setSelectedToEditSite({
                    ...selectedToEditSite,
                    additionalContact: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                rowsMax={4}
                fullWidth
                label="Notes"
                value={selectedToEditSite.notes}
                onChange={(e) =>
                  setSelectedToEditSite({
                    ...selectedToEditSite,
                    notes: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} direction="row">
                <Grid item>
                  <Typography variant="body1">Irrigation</Typography>
                </Grid>
                <Grid item>
                  <Switch
                    color={
                      selectedToEditSite.irrigation ? "primary" : "secondary"
                    }
                    checked={selectedToEditSite.irrigation}
                    onChange={(e) => {
                      setSelectedToEditSite({
                        ...selectedToEditSite,
                        irrigation: e.target.checked,
                      });
                    }}
                    name="checkedA"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} direction="row">
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      //   get site with code not relevant to the modal (selectedtoeditsite)
                      let allSitesExceptCurrent = enrollmentData.growerInfo.sites.filter(
                        (sites) => {
                          return sites.code !== selectedToEditSite.code;
                        }
                      );
                      //   append new data
                      allSitesExceptCurrent.push(selectedToEditSite);

                      //   sort Alphabetical
                      const sortedAllSitesExceptCurrent = allSitesExceptCurrent.sort(
                        (a, b) => b.code < a.code
                      );
                      setEnrollmentData({
                        ...enrollmentData,
                        growerInfo: {
                          ...enrollmentData.growerInfo,
                          sites: sortedAllSitesExceptCurrent,
                        },
                      });
                      //   close the modal
                      setModifyNewSiteDetailsModal(!modifyNewSiteDetailsModal);
                    }}
                  >
                    Update
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="default"
                    onClick={handleDialogClose}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};
