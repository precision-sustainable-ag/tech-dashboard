// Dependency Imports
import React, { useContext } from "react";
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
} from "@material-ui/core";

// Local Imports
import { Context } from "../Store/Store";
import { useAuth0 } from "../Auth/react-auth0-spa";

// Default function 
const Profile = () => {
  const [state, dispatch] = useContext(Context);
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [value, setValue] = React.useState(2);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Paper elevation={0}>
      <Box paddingTop={"2em"} padding={"1em"} minHeight={"80vh"} gridGap={2}>
        <Box>
          <Grid container spacing={2}>
            <Grid item lg={4}>
              <Card elevation={2}>
                <CardHeader
                  title={
                    <Typography variant="h6" align="left">
                      {user.name}
                    </Typography>
                  }
                  avatar={
                    <Avatar alt={user.name} src={user.picture}>
                      A
                    </Avatar>
                  }
                />
                <CardContent>
                  <TableContainer component={Paper} elevation={0}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Profile</TableCell>
                          <TableCell>GitHub</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Nickname</TableCell>
                          <TableCell>{user.nickname}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Email</TableCell>
                          <TableCell>{user.email}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Verified</TableCell>
                          <TableCell>
                            {user.email_verified.toString()}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Sub</TableCell>
                          <TableCell>{user.sub}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item lg={8}>
              <Card elevation={2}>
                <CardHeader
                  title={
                    <Typography variant="h6" align="left">
                      You have the following roles and permissions
                    </Typography>
                  }
                />
                <CardContent>
                  <Grid container>
                    <Grid item lg={12}>
                      <table style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th>State</th>
                            <th>Role</th>
                            <th>Permissions</th>
                            <th>View Protected</th>
                          </tr>
                        </thead>
                        <tbody>
                          {state.userInfo ? (
                            <tr style={{ textAlign: "center" }}>
                              <td>{state.userInfo.state}</td>
                              <td>{state.userInfo.role}</td>
                              <td>{state.userInfo.permissions}</td>
                              <td>
                                {state.userInfo.view_protected === 1
                                  ? "Yes"
                                  : "No"}
                              </td>
                            </tr>
                          ) : (
                            ""
                          )}
                        </tbody>
                      </table>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        {/* <Grid container>
          <Grid item lg={6}>
            <Paper square>
              <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                aria-label="disabled tabs example"
              >
                <Tab label="Active" />
                <Tab label="Disabled" disabled />
                <Tab label="Active" />
              </Tabs>
            </Paper>
          </Grid>
        </Grid> */}

        {/* <Grid container lg={12} spacing={2}>
          <Grid item>
            <Button>Request Access</Button>
            <Button>API Access</Button>
          </Grid>
        </Grid> */}
        {/* <Grid container lg={6}></Grid> */}
      </Box>
    </Paper>
  );
};

export default Profile;
