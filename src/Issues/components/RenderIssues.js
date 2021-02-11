import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import { BugReport, ExpandMore } from "@material-ui/icons";
import { Octokit } from "@octokit/rest";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Loading from "react-loading";
import { useAuth0 } from "../../Auth/react-auth0-spa";
import { githubToken } from "../../utils/api_secret";
import { bannedRoles, ucFirst } from "../../utils/constants";

import MDEditor from "@uiw/react-md-editor";
import { Link } from "react-router-dom";
import "./RenderIssues.scss";

/**
 * A component to render issues based on a given state label
 *
 * @example
 * const stateLabel = "NC"
 * const userRole = "all"
 * @returns {JSX.Element} Component template
 */
export const RenderIssues = ({ stateLabel, userRole }) => {
  const [showIssues, setShowIssues] = useState(false);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth0();
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  //   useEffect(() => {
  //     if (bannedRoles.includes(userRole)) {
  //       setLoading(false);
  //       setShowIssues(false);
  //     } else {
  // const octokit = new Octokit({ auth: githubToken });
  //             octokit
  //         .request("GET /repos/{owner}/{repo}/collaborators", {
  //           owner: "precision-sustainable-ag",
  //           repo: "data_corrections",
  //         })
  //         .then((res) => {
  //           const nicknames = res.data.map((response) => response.login);
  //           if (nicknames.includes(user.nickname)) {
  //             console.log("User exists");
  //           } else {
  //             setLoading(false);
  //             console.log("User does not exist, needs to be added");
  //           }
  //           setShowIssues(true);
  //         }).catch(e => {
  //           console.error(e)
  //         })

  //     }
  //   }, [user.nickname, userRole]);

  // simple array to store issue creator usernames
  const [userNames, setUserNames] = useState([]);
  // object that holds issue created by 'user' data
  const [userNameData, setUserNameData] = useState({});
  // flag to make sure usernames gave been set in userNames state
  const [doneSettingUsernames, setDoneSettingUsernames] = useState(false);

  useEffect(() => {
    if (doneSettingUsernames) {
      const octokit = new Octokit({ auth: githubToken });

      userNames.forEach((username) => {
        getUser(octokit, username)
          .then((res) => {
            if (res.data)
              setUserNameData((d) => {
                return { ...d, [username]: res.data };
              });
          })
          .catch((e) => console.error(e));
      });
    }
  }, [doneSettingUsernames, userNames]);

  useEffect(() => {
    if (stateLabel) {
      const octokit = new Octokit({ auth: githubToken });
      setLoading(true);
      setShowIssues(false);

      getIssues(octokit, stateLabel)
        .then((resp) => {
          // console.log(resp);
          setLoading(false);
          setShowIssues(true);

          const data = resp.data.map((res) => {
            // get username from response body

            let username = res.body.split("By: @");
            username = username[1].split("**")[0].replace(/\s/g, "");
            setUserNames((old) =>
              !old.includes(username) ? [...old, username] : [username]
            );
            // convert date strings to date objects
            return {
              ...res,
              created_at: new Date(res.created_at),
              updated_at: new Date(res.updated_at),
              body: res.body.split("** Issue Created By")[0],
              username: username,
            };
          });

          // sorting based on most recent updated first
          const sortedIssues = data.sort((a, b) => a.updated_at - b.updated_at);
          setIssues(sortedIssues);
        })
        .then(() => setDoneSettingUsernames(true))
        .catch((e) => {
          console.error(e);
        });
    }
  }, [stateLabel]);

  const RenderUserCredits = ({ username, show }) => {
    if (show && Object.keys(userNameData).length === userNames.length) {
      return (
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              src={
                userNameData[username]
                  ? userNameData[username].avatar_url
                    ? userNameData[username].avatar_url
                    : ""
                  : ""
              }
              alt={
                userNameData[username]
                  ? userNameData[username].name
                    ? userNameData[username].name
                    : ""
                  : ""
              }
            />
          </Grid>
          <Grid item>
            <Typography variant="body1">
              Created By{" "}
              <Button
                href={
                  userNameData[username] ? userNameData[username].html_url : ""
                }
                rel="noreferrer"
                target="_blank"
              >
                {userNameData[username] ? userNameData[username].name : ""}
              </Button>
            </Typography>
          </Grid>
        </Grid>
      );
    } else {
      return "";
    }
  };
  return loading ? (
    <div className="issuesWrapper">
      <div className="loaderRow">
        <Loading type="bars" color="#3f51b5" width="200px" height="200px" />
      </div>
    </div>
  ) : showIssues ? (
    <Grid container spacing={2}>
      {issues.length > 0 ? (
        issues.map((issue, index) => (
          <Grid item xs={12} key={index}>
            <Accordion
              expanded={expanded === index}
              onChange={handleAccordionChange(index)}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar>
                      <BugReport />
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">
                      {ucFirst(issue.title)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption">
                      {`Created on ${issue.created_at.toDateString()}`}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} className="issueMarkdown">
                    <MDEditor.Markdown source={issue.body} />
                  </Grid>
                  <Grid item xs={12}>
                    <RenderUserCredits
                      username={issue.username}
                      show={doneSettingUsernames}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
              <AccordionActions style={{ justifyContent: "flex-start" }}>
                <Button
                  component={Link}
                  to={`/issues/${issue.number}`}
                  variant="contained"
                  color="primary"
                >
                  Comments
                </Button>
              </AccordionActions>
            </Accordion>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography variant="h5">No issues</Typography>
        </Grid>
      )}
    </Grid>
  ) : (
    <Box component={Paper} elevation={0}>
      <Typography variant={"h6"} align="center">
        Your access level does not permit this action.
      </Typography>
    </Box>
  );
};

// Helper function
const getUser = async (octokit, username) => {
  return await octokit.request("GET /users/{username}", {
    username: username,
  });
};

const getIssues = async (octokit, label) => {
  if (label === "all") {
    return await octokit.request("GET /repos/{owner}/{repo}/issues", {
      owner: "precision-sustainable-ag",
      repo: "data_corrections",
      state: "open",
    });
  } else {
    return await octokit.request("GET /repos/{owner}/{repo}/issues", {
      owner: "precision-sustainable-ag",
      repo: "data_corrections",
      state: "open",
      labels: label,
    });
  }
};

// Property typings
RenderIssues.defaultProps = {
  stateLabel: "NC",
};
RenderIssues.propTypes = {
  stateLabel: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
};