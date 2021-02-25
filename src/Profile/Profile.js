// Dependency Imports
import React, { useContext, useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  Paper,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  TableContainer,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Button,
  TableHead,
} from "@material-ui/core";

// Local Imports
import { Context } from "../Store/Store";
import { useAuth0 } from "../Auth/react-auth0-spa";
import { bannedRoles, ucFirst } from "../utils/constants";
import { apiPassword, apiURL, apiUsername } from "../utils/api_secret";
import { Fragment } from "react";
import { BannedRoleMessage } from "../utils/CustomComponents";

/**
 * Logged in User's Profile Page
 */

const Profile = () => {
  const [state] = useContext(Context);
  const { isAuthenticated, user } = useAuth0();
  const [koboDetails, setKoboDetails] = useState({
    data: [],
    allStates: false,
  });

  useEffect(() => {
    if (state.userInfo.state) {
      const response = fetchKoboPasswords({
        state: state.userInfo.state,
        showAllStates:
          state.userInfo.state.toLowerCase() === "all" ? true : false,
      });
      response.then(({ status, data, showAllStates }) => {
        if (status === "success") {
          setKoboDetails({ data: data, allStates: showAllStates });
        } else {
          console.error(data);
        }
      });
    }
    return () => {};
  }, [state.userInfo.state]);

  const fetchKoboPasswords = async ({ state, showAllStates }) => {
    let response = await fetch(`${apiURL}/api/kobo/passwords/${state}`, {
      headers: new Headers({
        Authorization: `Basic ${btoa(`${apiUsername}:${apiPassword}`)}`,
      }),
    });

    let payload = await response.json();
    let { status, data } = payload;

    return { status, data, showAllStates };
  };

  return (
    isAuthenticated &&
    (bannedRoles.includes(state.userInfo.role) ||
    bannedRoles.includes(state.userInfo.state) ? (
      <BannedRoleMessage title="profile page" />
    ) : (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Welcome, {user.name}</Typography>
        </Grid>

        {Object.keys(state.userInfo).length > 0 && (
          <Grid item xs={12}>
            <Grid container spacing={6}>
              <Grid item>
                <Card>
                  <CardHeader title="Github Details" />
                  <CardContent style={{ minHeight: "50vh" }}>
                    <RenderGithubDetails user={user} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
                <Card>
                  <CardHeader title="Account Details" />
                  <CardContent style={{ minHeight: "50vh" }}>
                    <RenderGeneralInfo userInfo={state.userInfo} />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
                <Card>
                  <CardHeader title="Kobo Details" />
                  <CardContent style={{ minHeight: "50vh" }}>
                    <RenderKoboDetails koboData={koboDetails} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    ))
  );
};

const RenderGeneralInfo = ({ userInfo }) => {
  const invisibleKeys = ["data", "updated", "userid"];
  const transformKey = (key = "", val) => {
    return key === "apikey"
      ? "api key"
      : key === "state"
      ? val.split(",").length > 1 || val === "all"
        ? "States"
        : "State"
      : key.replace("_", " ");
  };
  const transformVal = (key = "", val = "") => {
    const stringSplitter = (val = "") => {
      return val.split(",").reduce((accumulator, current, index, arr) => {
        if (arr.length === 1) return current;
        else {
          if (index === arr.length - 1) {
            return accumulator + " and " + current;
          } else if (index === 0) {
            return `${current}`;
          } else {
            return `${accumulator}, ${current}`;
          }
        }
      }, "");
    };

    switch (key) {
      case "state":
        return val.toLowerCase() === "all" ? "All" : stringSplitter(val);

      case "permissions":
        return ucFirst(stringSplitter(val)).replace("And", "and");

      case "role":
        return ucFirst(val);

      case "view_protected":
        return val === 1 ? "Yes" : "No";

      default:
        return val;
    }
  };
  return (
    <TableContainer>
      <Table>
        <TableBody>
          {Object.keys(userInfo).length > 0 &&
            Object.keys(userInfo).map((key, index) =>
              invisibleKeys.includes(key) ? (
                ""
              ) : (
                <TableRow key={`userinfo${index}`}>
                  <TableCell>
                    <Typography variant="body1">
                      {ucFirst(transformKey(key, userInfo[key]))}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {key === "apikey"
                        ? showAPIKey(userInfo[key])
                        : transformVal(key, userInfo[key])}
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const RenderGithubDetails = ({ user }) => {
  const invisibleKeys = ["picture", "updated_at", "email_verified"];
  return (
    <TableContainer>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography variant="body1">Profile</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">GitHub</Typography>
            </TableCell>
          </TableRow>
          {Object.keys(user).map(
            (userKey, index) =>
              !invisibleKeys.includes(userKey) && (
                <TableRow>
                  <TableCell>
                    <Typography variant="body1">{ucFirst(userKey)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{user[userKey]}</Typography>
                  </TableCell>
                </TableRow>
              )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
const RenderKoboDetails = ({ koboData = { data: [], allStates: false } }) => {
  return koboData.data.length > 0 ? (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="body1">State</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">Username</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">Password</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {koboData.data.map((item, index) => (
            <TableRow key={`koboTableRow${index}`}>
              <TableCell>
                <Typography variant="body1">{item.state}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">{item.kobo_account}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">{item.password}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    ""
  );
};

const showAPIKey = (apiKey) => {
  return (
    <span
      id="showAPIKeyBtn"
      style={{
        fontFamily: "Menlo, sans-serif",
        fontSize: "0.8em",
        fontStyle: "italic",
      }}
    >
      {apiKey ? (
        <Button
          onClick={() =>
            (document.getElementById("showAPIKeyBtn").innerHTML = apiKey)
          }
          size="small"
        >
          Show
        </Button>
      ) : (
        "N/A"
      )}
    </span>
  );
};
export default Profile;
