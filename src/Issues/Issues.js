// Dependency Imports
import React, { useEffect, useState } from "react";
import Axios from "axios";
import Loading from "react-loading";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import { Octokit } from "@octokit/rest";
import { Done } from "@material-ui/icons";

// Local Imports
import { Context } from "../Store/Store";
import "./Issues.scss";
import { githubToken } from "../utils/api_secret";
import { bannedRoles } from "../utils/constants";
import { useAuth0 } from "../Auth/react-auth0-spa";


// Helper function (unused)
const getAllRepoNames = async (url) => {
  let data = await Axios.get(url)
    .then((response) => {
      //   console.log(response);
      return response.data;
    })
    .then((response) => {
      let dataObject = {};
      if (response.length > 0)
        dataObject = {
          success: true,
          data: response,
        };
      else
        dataObject = {
          success: false,
          data: response,
        };

      return dataObject;
    })
    .then((bl) => {
      if (bl.success) {
        Promise.resolve("no error");
        return bl.data;
      } else {
        Promise.reject("error");
        return false;
      }
    });

  return data;
};

// Default function 
export const ReposComponent = () => {
  const octokit = new Octokit({ auth: githubToken });
  const [state, dispatch] = React.useContext(Context);
  const [showIssues, setShowIssues] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth0();
  const [issues, setIssues] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const allReposAPIURL =
    "https://api.github.com/orgs/precision-sustainable-ag/repos";

  useEffect(() => {
    if (bannedRoles.includes(state.userRole)) {
      setLoading(false);
      setShowIssues(false);
    } else {
      // Github Oktokit

      octokit
        .request("GET /repos/{owner}/{repo}/collaborators", {
          owner: "precision-sustainable-ag",
          repo: "data_corrections",
        })
        .then((res) => {
          const nicknames = res.data.map((response) => response.login);
          if (nicknames.includes(user.nickname)) {
            console.log("User exists");
          } else {
            setLoading(false);
            console.log("User does not exist");
          }
        });

      setShowIssues(true);
    }
  }, [state.userRole]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // if (selectedState) {

    getIssues(octokit, selectedState).then((resp) => {
      setLoading(false);
      setIssues(resp.data);
      // setSelectedState(state.userInfo ? state.userInfo.state.)
    });
    // }
  }, [selectedState]);

  const [openDialog, setOpenDialog] = useState(false);
  const [issueId, setIssueId] = useState(0);
  return loading ? (
    <div className="issuesWrapper">
      <div className="loaderRow">
        <Loading type="cubes" color="#3f51b5" width="400px" height="400px" />
      </div>
    </div>
  ) : showIssues ? (
    <div className="issuesWrapper">
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Typography variant="caption">
            <b>Note:</b> This page is still under development
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {/* {selectedState */}
          {/* ?  */}
          <Grid container spacing={2}>
            {state.userInfo.state.split(",").map((state, index) => (
              <Grid item>
                <Chip
                  avatar={<Avatar>{state[0]}</Avatar>}
                  clickable
                  onClick={() => setSelectedState(state)}
                  color={selectedState === state ? "primary" : "default"}
                  label={state}
                  key={index}
                  size="medium"
                  deleteIcon={selectedState === state ? <Done /> : ""}
                />
              </Grid>
            ))}
          </Grid>
          {/* : ""} */}
        </Grid>
        <Grid item xs={12}>
          {issues.length > 0 ? (
            <>
              {issues.map((issue, index) => (
                <Grid container>
                  <Grid item xs={12}>
                    <Card style={{ width: "100%" }}>
                      <CardActionArea href={`/issues/${issue.number}`}>
                        <CardContent>
                          <Typography variant="body1">{issue.title}</Typography>
                          <Typography variant="body2">
                            {"By: Rohit Bandooni"}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                </Grid>
              ))}
              <IssueDialog
                open={openDialog}
                issueId={issueId}
                setOpen={setOpenDialog}
              />
            </>
          ) : (
            <Grid container spacing={5} alignItems="center" justify="center">
              <Grid item xs={12}>
                <Typography variant="h5" align="center">
                  No issues for{" "}
                  {state.userInfo.state.split(",").length > 1
                    ? `"${state.userInfo.state.split(",").join(" and ")}"`
                    : `"${state.userInfo.state}"`}
                </Typography>
              </Grid>

              {/* <Button variant="contained" color="primary" size="large">
                Create New Issue
              </Button> */}
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  ) : (
    <Box component={Paper} elevation={0}>
      <Typography variant={"h6"} align="center">
        Your access level does not permit this action.
      </Typography>
    </Box>
  );
  // showIssues ? (
  //   <div className="issuesWrapper">
  //     <Issue />
  //   </div>
  // ) : (
  // <Box component={Paper} elevation={0}>
  //   <Typography variant={"h6"} align="center">
  //     Your access level does not permit this action.
  //   </Typography>
  // </Box>
  // );
};

export default ReposComponent;

// Helper function
const getIssues = async (octokit, labels) => {
  return await octokit.request("GET /repos/{owner}/{repo}/issues", {
    owner: "precision-sustainable-ag",
    repo: "data_corrections",
    labels: labels,
  });
};

// Helper function
const IssueDialog = ({ issueId, open = false, setOpen = () => {} }) => {
  return (
    <Dialog fullScreen open={open} onClose={setOpen(false)}>
      <DialogTitle> Issue Title</DialogTitle>
      <DialogContent>
        <DialogContentText>Issue Description</DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
