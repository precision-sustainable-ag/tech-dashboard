// Dependency Imports
import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
  makeStyles,
} from "@material-ui/core";
import Axios from "axios";
import { Alert } from "@material-ui/lab";

// Local Imports
import { Context } from "../Store/Store";
import GrowerInformation from "./GrowerInformation";
import { apiPassword, apiURL, apiUsername } from "../utils/api_secret";

//Global Vars
const qs = require("qs");

const useStyles = makeStyles((theme) => ({
  labelRoot: {
    fontSize: "1.2rem",
  },
}));

// Default function
const EnrollNewSite = (props) => {
  const [state, dispatch] = useContext(Context);
  const theme = useTheme();
  const styles = useStyles(theme);
  const mediumUpScreen = useMediaQuery(theme.breakpoints.up("md"));

  const [loading, setLoading] = useState();
  const currentYear = new Date().getFullYear();
  const [allAffiliations, setAllAffiliations] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState({
    year: "none",
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
      year: "none",
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
            year: "none",
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
        let permittedAffiliations = [];
        const dbPermittedAffiliations = state.userInfo.state
          .toUpperCase()
          .split(",");
        dbPermittedAffiliations.forEach((element) => {
          let a = affiliations.filter((data) => data.affiliation === element);
          permittedAffiliations.push(a);
        });
        setAllAffiliations(permittedAffiliations.flat());
      })
      .then(() => {
        setLoading(false);
      });
  }, []);
  const [affiliationError, setAffiliationError] = useState(false);
  const [enrollmentYearError, setEnrollmentYearError] = useState(false);
  return (
    <LoadingWrapper loading={loading}>
      {/* {mediumUpScreen ? ( */}

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="h4">Basic Information</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <InputLabel
            // classes={{ root: styles.labelRoot }}
            error={enrollmentYearError}
            htmlFor="enroll-year"
          >
            Year
          </InputLabel>
          <Select
            fullWidth
            error={enrollmentYearError}
            value={enrollmentData.year}
            onChange={(e) => {
              if (e.target.value !== "none") {
                setEnrollmentYearError(false);
                setEnrollmentData({ ...enrollmentData, year: e.target.value });
              } else {
                setEnrollmentYearError(true);
              }
            }}
            inputProps={{
              name: "year",
              id: "enroll-year",
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
        enrollmentData.year === "none" ? (
          <Grid item xs={12}>
            <Alert severity="info">
              <Typography variant="body2">
                Make sure you have selected the <b>year</b> and{" "}
                <b>affiliation</b>
              </Typography>
            </Alert>
          </Grid>
        ) : (
          ""
        )}

        {/* Grower Information  */}
        {enrollmentData.affiliation === "none" ||
        enrollmentData.affiliation === "" ||
        enrollmentData.year === "none" ? (
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
      </Grid>
    </LoadingWrapper>
  );
};

export default EnrollNewSite;

// Helper functions
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
