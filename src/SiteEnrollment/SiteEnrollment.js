//Dependency Imports
import {
  Button,
  Grid,
  Paper,
  Slide,
  Snackbar,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Axios from "axios";
import React, { useState, useEffect, useContext } from "react";

//Local Imports
import { Context } from "../Store/Store";
import { apiPassword, apiURL, apiUsername } from "../utils/api_secret";
import { bannedRoles } from "../utils/constants";
import { BannedRoleMessage } from "../utils/CustomComponents";
import EnrollNewSite from "./EnrollNewSite";

const SiteEnrollment = (props) => {
  const [state, dispatch] = useContext(Context);
  const [totalSitesEnrolled, setTotalSitesEnrolled] = React.useState(0);
  const [stateSitesEnrolled, setStateSitesEnrolled] = React.useState(0);
  const [showStateSpecificSites, setShowStateSpecificSites] = React.useState(
    false
  );
  const [showContent, setShowContent] = React.useState(false);
  const [bannedRolesCheckMessage, setBannedRolesCheckMessage] = React.useState(
    "Checking your permissions.."
  );
  const [enrollNewSite, setEnrollNewSite] = useState(false);
  const [savedData, setSavedData] = useState(false);
  useEffect(() => {
    if (state.userInfo.state) {
      if (state.userInfo.role) {
        if (bannedRoles.includes(state.userRole)) {
          setShowContent(false);
          setBannedRolesCheckMessage(
            <BannedRoleMessage title="Site Enrollment" />
          );
        } else {
          setShowContent(true);
          if (state.userInfo.state === "all") {
            setShowStateSpecificSites(false);
          } else {
            setShowStateSpecificSites(true);
          }
          getStats(state.userInfo.state).then((data) => {
            setTotalSitesEnrolled(data.total);
            setStateSitesEnrolled(data.state);
          });
        }
      }
    }
  }, [state.userInfo]);

  return showContent ? (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={() => setEnrollNewSite(!enrollNewSite)}
          color={enrollNewSite ? "secondary" : "primary"}
        >
          {enrollNewSite ? "Cancel" : "Enroll Site"}
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
          {showStateSpecificSites ? (
            <Typography variant="body1" gutterBottom>
              {stateSitesEnrolled} sites enrolled in your team:{" "}
              {state.userInfo.state}
            </Typography>
          ) : (
            ""
          )}
          <Typography variant="body1">
            {totalSitesEnrolled} sites enrolled across all teams.
          </Typography>
        </Grid>
      )}
      <Snackbar
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
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

const getStats = async (state) => {
  let records = await fetchStats(state);

  let data = records.data.data;

  return data;
};

const fetchStats = async (state) => {
  return await Axios.get(`${apiURL}/api/total/sites/${state}`, {
    headers: {
      "Content-Type": "application/json",
    },
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  });
};
