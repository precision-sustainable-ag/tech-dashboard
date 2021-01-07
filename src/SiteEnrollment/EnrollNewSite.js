//Dependency Imports
import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import Axios from "axios";
import { Alert } from "@material-ui/lab";

//Local Imports
import { Context } from "../Store/Store";
import GrowerInformation from "./GrowerInformation";
import { apiPassword, apiURL, apiUsername } from "../utils/api_secret";

const qs = require("qs");

const EnrollNewSite = (props) => {
  const [state, dispatch] = useContext(Context);
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const [loading, setLoading] = useState();
  const currentYear = new Date().getFullYear();
  const [allAffiliations, setAllAffiliations] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState({
    year: currentYear + 1,
    affiliation: "none",
    growerInfo: {
      collaborationStatus: "University",
      producerId: "",
      phone: "",

      lastName: "",
      email: "",
      sites: [],
    },
  });
  useEffect(() => {
    setEnrollmentData({
      year: currentYear + 1,
      affiliation: "none",
      growerInfo: {
        collaborationStatus: "University",
        producerId: "",
        phone: "",
        lastName: "",
        email: "",
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
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      })
        .then((res) => {
          console.log(res.data);
        })
        .then((res) => {
          // reset everything
          setEnrollmentData({
            year: currentYear + 1,
            affiliation: "NC",
            growerInfo: {
              collaborationStatus: "University",
              producerId: "",
              phone: "",
              lastName: "",
              email: "",
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
  };
  useEffect(() => {
    setLoading(true);
    // get remote data
    let siteAffResponse = fetchSiteAffiliations();

    siteAffResponse
      .then((res) => {
        let affiliations = res.data.data;
        setAllAffiliations(affiliations);
      })
      .then(() => {
        setLoading(false);
      });
  }, []);
  const [affiliationError, setAffiliationError] = useState(false);
  return (
    <LoadingWrapper loading={loading}>
      <Grid item xs={12}>
        <Typography variant="h4">Basic Information</Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <InputLabel htmlFor="enroll-year">Year</InputLabel>
        <Select
          fullWidth
          value={enrollmentData.year}
          onChange={(e) => {
            setEnrollmentData({ ...enrollmentData, year: e.target.value });
          }}
          inputProps={{
            name: "year",
            id: "enroll-year",
          }}
        >
          <MenuItem value={currentYear}>{currentYear}</MenuItem>
          <MenuItem value={currentYear + 1}>{currentYear + 1}</MenuItem>
          <MenuItem value={currentYear + 2}>{currentYear + 2}</MenuItem>
        </Select>
      </Grid>

      <Grid item xs={12} md={6}>
        <InputLabel htmlFor="enroll-affiliation">Affiliation</InputLabel>
        <Select
          fullWidth
          value={enrollmentData.affiliation}
          error={affiliationError}
          onChange={(e) => {
            if (e.target.value !== "none") {
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
            name: "year",
            id: "enroll-year",
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
      {enrollmentData.affiliation === "" ||
      enrollmentData.affiliation === "none" ||
      enrollmentData.year === "" ? (
        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              Make sure you have selected the <b>year</b> and <b>affiliation</b>
            </Typography>
          </Alert>
        </Grid>
      ) : (
        ""
      )}

      {/* Grower Information  */}
      {enrollmentData.affiliation === "none" ||
      enrollmentData.affiliation === "" ? (
        ""
      ) : (
        <GrowerInformation
          enrollmentData={enrollmentData}
          setEnrollmentData={setEnrollmentData}
        />
      )}

      {enrollmentData.growerInfo.sites &&
      enrollmentData.growerInfo.sites.length > 0 ? (
        <Grid item xs={12}>
          <Grid container justify="center" alignItems="center">
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={finalConfirm}
            >
              Confirm Site Information
            </Button>
          </Grid>
        </Grid>
      ) : (
        ""
      )}
    </LoadingWrapper>
  );
};

export default EnrollNewSite;

const LoadingWrapper = ({ children, loading }) => {
  return loading ? "Loading" : <>{children}</>;
};

const fetchSiteAffiliations = async () => {
  return await Axios.get(`${apiURL}/api/retrieve/grower/affiliation/all`, {
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  });
};
