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
import { ucFirst } from "../utils/constants";
import { apiPassword, apiURL, apiUsername } from "../utils/api_secret";
import { Fragment } from "react";

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
    isAuthenticated && (
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
    )
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
          {/* <TableRow style={{ textAlign: "center" }}>
            <TableCell>
              <Typography variant="body1">{ucFirst(userInfo.state)}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">{ucFirst(userInfo.role)}</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                {ucFirst(userInfo.permissions)}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">
                {userInfo.view_protected === 1 ? "Yes" : "No"}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" component="div">
                {userInfo.apikey ? showAPIKey(userInfo.apikey) : "N/A"}
              </Typography>
            </TableCell>
          </TableRow> */}
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

// <Grid item xs={12}>
//   <Typography variant="h4">Your Roles and Permissions</Typography>
// </Grid>
// <Grid item>
//   <Card>
//     <CardHeader title="State" />
//     <CardContent>{ucFirst(state.userInfo.state)}</CardContent>
//   </Card>
// </Grid>
// <Grid item>
//   <Card>
//     <CardHeader title="Role" />
//     <CardContent>{ucFirst(state.userInfo.role)}</CardContent>
//   </Card>
// </Grid>
// <Grid item>
//   <Card>
//     <CardHeader title="Permissions" />
//     <CardContent>
//       {ucFirst(state.userInfo.permissions.split(",").join(", "))}
//     </CardContent>
//   </Card>
// </Grid>
// {state.userInfo.apikey ? (
//   <Grid item>
//     <Card>
//       <CardHeader title="API Key" />
//       <CardContent>
//         {showAPIKey(state.userInfo.apikey)}
//       </CardContent>
//     </Card>
//   </Grid>
// ) : (
//   "N/A"
// )}

// Default function
// const Profile = () => {
//   const [state, dispatch] = useContext(Context);
//   const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
//   const [value, setValue] = React.useState(2);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };
//   return (
//     <Paper elevation={0}>
//       <Box paddingTop={"2em"} padding={"1em"} minHeight={"80vh"} gridGap={2}>
//         <Box>
//           <Grid container spacing={2}>
//             <Grid item lg={4}>
//               <Card elevation={2}>
//                 <CardHeader
//                   title={
//                     <Typography variant="h6" align="left">
//                       {user.name}
//                     </Typography>
//                   }
//                   avatar={
//                     <Avatar alt={user.name} src={user.picture}>
//                       A
//                     </Avatar>
//                   }
//                 />
//                 <CardContent>
//                   <TableContainer
//                     component={Paper}
//                     elevation={0}
//                     style={{ minHeight: "50vh" }}
//                   >
// <Table>
//   <TableBody>
//     <TableRow>
//       <TableCell>Profile</TableCell>
//       <TableCell>GitHub</TableCell>
//     </TableRow>
//     <TableRow>
//       <TableCell>Nickname</TableCell>
//       <TableCell>{user.nickname}</TableCell>
//     </TableRow>
//     <TableRow>
//       <TableCell>Email</TableCell>
//       <TableCell>{user.email}</TableCell>
//     </TableRow>
//     <TableRow>
//       <TableCell>Verified</TableCell>
//       <TableCell>
//         {user.email_verified.toString()}
//       </TableCell>
//     </TableRow>
//     <TableRow>
//       <TableCell>Sub</TableCell>
//       <TableCell>{user.sub}</TableCell>
//     </TableRow>
//   </TableBody>
// </Table>
//                   </TableContainer>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item lg={8}>
//               <Card elevation={2}>
//                 <CardHeader
//                   title={
//                     <Typography variant="h6" align="left">
//                       You have the following roles and permissions
//                     </Typography>
//                   }
//                 />
//                 <CardContent>
//                   <Grid container style={{ minHeight: "50vh" }}>
//                     <Grid item lg={12}>
//                       <table
//                         style={{ width: "100%" }}
//                         className="profilePageTable"
//                       >
// <thead>
//   <tr>
//     <th>State</th>
//     <th>Role</th>
//     <th>Permissions</th>
//     <th>View Protected</th>
//     <th>API Key</th>
//   </tr>
// </thead>
// <tbody>
//   {state.userInfo ? (
//     <tr style={{ textAlign: "center" }}>
//       <td>{ucFirst(state.userInfo.state)}</td>
//       <td>{ucFirst(state.userInfo.role)}</td>
//       <td>{ucFirst(state.userInfo.permissions)}</td>
//       <td>
//         {state.userInfo.view_protected === 1
//           ? "Yes"
//           : "No"}
//       </td>
//       <td>
//         {state.userInfo.apikey
//           ? showAPIKey(state.userInfo.apikey)
//           : "N/A"}
//       </td>
//     </tr>
//   ) : (
//     ""
//   )}
// </tbody>
//                       </table>
//                     </Grid>
//                     <Grid item xs={12}>
//                       <RenderKoboPasswords states={state.userInfo.state} />
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </Box>
//       </Box>
//     </Paper>
//   );
// };

// const showAPIKey = (apiKey) => {
//   return (
//     <span
//       id="showAPIKeyBtn"
//       style={{
//         fontFamily: "Menlo, sans-serif",
//         fontSize: "0.8em",
//         fontStyle: "italic",
//       }}
//     >
//       <Button
//         onClick={() =>
//           (document.getElementById("showAPIKeyBtn").innerHTML = apiKey)
//         }
//         size="small"
//       >
//         Show
//       </Button>
//     </span>
//   );
// };

// const RenderKoboPasswords = ({ states }) => {
//   return (
//     <Grid container>
//       <Grid item xs={12}>
//         <Typography variant="h5">Kobo Account Details</Typography>
//         {states}
//       </Grid>
//     </Grid>
//   );
// };

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
