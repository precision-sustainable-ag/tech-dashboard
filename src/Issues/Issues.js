import React, { Fragment } from "react";
import { Context } from "../Store/Store";
import "./Issues.scss";
import Axios from "axios";
import Loading from "react-loading";
import Skeleton from "@material-ui/lab/Skeleton";
import RepositoriesComponent from "./Repositories";
import { Box, Paper, Typography } from "@material-ui/core";
import { bannedRoles } from "../utils/constants";

const getAllRepoNames = async url => {
  let data = await Axios.get(url)
    .then(response => {
      //   console.log(response);
      return response.data;
    })
    .then(response => {
      let dataObject = {};
      if (response.length > 0)
        dataObject = {
          success: true,
          data: response
        };
      else
        dataObject = {
          success: false,
          data: response
        };

      return dataObject;
    })
    .then(bl => {
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

export const ReposComponent = () => {
  const [state, dispatch] = React.useContext(Context);
  const [showIssues, setShowIssues] = React.useState(false);
  const allReposAPIURL =
    "https://api.github.com/orgs/precision-sustainable-ag/repos";

  React.useEffect(() => {
    if (bannedRoles.includes(state.userRole)) {
      setShowIssues(false);
    } else {
      let fetchRepos = getAllRepoNames(allReposAPIURL);
      fetchRepos.then(data => {
        dispatch({
          type: "UPDATE_ALL_REPOS",
          data: data
        });
      });
      setShowIssues(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return showIssues ? (
    <div className="issuesWrapper">
      {state.repositories.length === 0 ? (
        <div className="loaderRow">
          <Loading type="cubes" color="#3f51b5" width="400px" height="400px" />
        </div>
      ) : (
        <RepositoriesComponent data={state.repositories} />
      )}
    </div>
  ) : (
    <Box component={Paper} elevation={0}>
      <Typography variant={"h6"} align="center">
        Your access level does not permit this action.
      </Typography>
    </Box>
  );
};

export default ReposComponent;
