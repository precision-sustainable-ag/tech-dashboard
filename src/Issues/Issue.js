// Dependency Imports
import {
  Button,
  Card,
  CardContent,
  Grid,
  Slide,
  Typography,
  Snackbar,
} from "@material-ui/core";
import { ArrowBack, PersonAdd } from "@material-ui/icons";
import { Octokit } from "@octokit/rest";
import React, { useState, useEffect, useContext } from "react";
import MDEditor from "@uiw/react-md-editor";
import MuiAlert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";


// Local Imports
import { Context } from "../Store/Store";
import { githubToken } from "../utils/api_secret";
import { bannedRoles } from "../utils/constants";
import { Link } from "react-router-dom";
import { useAuth0 } from "../Auth/react-auth0-spa";
import IssueBubbleBody from "./components/IssueBodyBubble";
import { SingleIssueBodyBubble } from "./components/SingleIssueBodyBubble";
import { createGithubComment } from "../utils/SharedFunctions"
import Comments from "../Comments/Comments"


  

// Global vars
var replyParser = require("node-email-reply-parser");

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// Default function
const Issue = (props) => {
  const {
    getTokenSilently,
  } = useAuth0();

  const issueNumber = props.match.params.issueNumber
    ? parseInt(props.match.params.issueNumber)
    : null;
  const [state, dispatch] = useContext(Context);
  const [showIssue, setShowIssue] = useState(false);
  const [issueBody, setIssueBody] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newCommentAdded, setNewCommentAdded] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [snackbarData, setSnackbarData] = useState({ open: false, text: "", severity: "success" });
  const { location } = useHistory();
  const history = useHistory();

  useEffect(() => {
    return () => {
      if (history.action === "POP") {
        history.push({
          pathname: "/issues",
          state: {
            activeAffiliation: location ? location.stateLabel : null,
          },
        });
      }
    };
  }, [history, location]);

  const hasIssueContent =
    props.location.state &&
    Object.keys(props.location.state).length > 0 &&
    props.location.state.body
      ? true
      : false;

  const { user } = useAuth0();

  const octokit = new Octokit({ auth: githubToken });

  useEffect(() => {
    if (bannedRoles.includes(state.userRole)) {
      setShowIssue(false);
    } else {
      fetchIssueComments();
    }
  }, [state.userRole]);

  const fetchIssueComments = () => {
    getIssueDetails().then((resp) => {
      const data = resp.data.map((data) => {
        const viaEmail = data.body.includes("<notifications@github.com>");
        const hasMention = data.body.includes("<br/> ** From");

        return {
          ...data,
          viaEmail: viaEmail,
          hasMention: hasMention,
          mention: hasMention
            ? data.body.split("<br/> ** From")[1].replace(/\s/g, "")
            : "",
          body: hasMention ? data.body.split("<br/>")[0] : data.body,
          parsedEmailBody: viaEmail
            ? replyParser(data.body)
            : hasMention
            ? data.body.split("<br/>")[0]
            : data.body,
        };
      });
      var issueBodyRev = [...data];
      setIssueBody(issueBodyRev);
      setShowIssue(true);
    });
  };

  async function handleNewComment(body) {
    let token = await getTokenSilently({
      audience: `https://precision-sustaibale-ag/tech-dashboard`
    });
    setButtonDisabled(true);

    createGithubComment(user.nickname, body, issueNumber, token)
      .then((res) => {
        setNewCommentAdded(!newCommentAdded);
        setNewComment("");
        setButtonDisabled(false);
        if(res){
          if(res.status === 201){
            setSnackbarData({
              open: true,
              text: `New comment has been created`,
              severity: "success"
              // text: "created test issue"
            });
          }
          else{
            console.log("Function could not create issue");
            setSnackbarData({
              open: true,
              text: `Could not create comment (error code 0)`,
              severity: "error"
              // text: "created test issue"
            });
          }
        } else {
          console.log("No response from function, likely cors");
          setSnackbarData({
            open: true,
            text: `Could not create comment (error code 1)`,
            severity: "error"
            // text: "created test issue"
          });
        }
      }
    )
  }

  useEffect(() => {
    fetchIssueComments();
  }, [newCommentAdded]);

  useEffect(() => {
    if (isNaN(issueNumber)) setShowIssue(false);
    else setShowIssue(true);
  }, [issueNumber]);

  const [showPreview, setShowPreview] = useState(false);

  const getIssueDetails = async () => {
    return await octokit.request(
      "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: "precision-sustainable-ag",
        repo: "data_corrections",
        issue_number: issueNumber,
        headers: {
          'If-None-Match': ''
        }
      }
    );
  };

  // const getUserFullName = async (username) => {
  //   let user = (await fetch(`https://api.github.com/users/${username}`)).json();

  //   return `${user.name}`;
  // };

  const [githubUsers, setGithubUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      const octokit = new Octokit({ auth: githubToken });
      return await octokit.request("GET /repos/{owner}/{repo}/collaborators", {
        owner: "precision-sustainable-ag",
        repo: "data_corrections",
      });
    }

    getUsers().then((response) => {
      if (response.status === 200 && response.data.length > 0) {
        setGithubUsers(
          response.data.filter((user) => user.login !== "TechDashboard-BOT")
        );
      } else {
        setGithubUsers([]);
        console.error(response);
      }
    });

    return () => {
      setGithubUsers([]);
    };
  }, []);

  const [showUsersDialog, setShowUsersDialog] = useState(false);
  const [searchUser, setSearchUser] = useState("");

  const filteredUsers = React.useMemo(() => {
    return githubUsers.filter((user) =>
      user.login.toLowerCase().includes(searchUser.toLowerCase())
    );
  }, [searchUser, githubUsers]);

  const githubUserMentionCommand = {
    name: "MentionUser",
    keyCommand: "MentionUser",
    buttonProps: { "aria-label": "Mention user" },
    icon: <PersonAdd style={{ width: "12px", height: "12px" }} />,
    execute: (state, api) => {
      console.log(state, api);
      if (!state.selectedText) {
        // no text selected, show all users
        setSearchUser("");
        setShowUsersDialog(true);
      } else {
        // find users that begin with selected users
        setSearchUser(state.selectedText);
        setShowUsersDialog(true);
      }
    },
  };

  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={snackbarData.open}
        autoHideDuration={2000}
        onClose={() =>
          setSnackbarData({ ...snackbarData, open: !snackbarData.open })
        }
      >
        <Alert severity={snackbarData.severity}>{snackbarData.text}</Alert>
      </Snackbar>
      <Slide in={showIssue} direction="up" timeout={300}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item>
                <Button
                  component={Link}
                  to={`/issues`}
                  variant="contained"
                  startIcon={<ArrowBack />}
                >
                  All Issues
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {hasIssueContent && (
                  <SingleIssueBodyBubble
                    {...props}
                    issue={props.location.state}
                  />
                )}
              </Grid>
              {issueBody.length > 0 ? (
                issueBody.map((issueData, index) => {
                  // console.log("this is the body" + JSON.stringify(issueData))
                  return (
                    <Grid item xs={12} key={index}>
                      {/* <RenderIssue issueData={issueData} /> */}
                      <IssueBubbleBody
                        {...props}
                        issueData={issueData}
                        user={user}
                      />
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1">
                    No comments have been made yet. Add a new comment in the
                    textbox below
                  </Typography>
                </Grid>
              )}

              {newComment && showPreview ? (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <MDEditor.Markdown source={newComment} />
                    </CardContent>
                  </Card>
                </Grid>
              ) : (
                ""
              )}
            </Grid>
          </Grid>
          <Comments handleNewComment={handleNewComment} buttonDisabled={buttonDisabled}/>
        </Grid>
      </Slide>
    </React.Fragment>
  );
};

export default Issue;
