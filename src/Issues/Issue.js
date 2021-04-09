// Dependency Imports
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Grow,
  Slide,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import { ArrowBack, PersonAdd } from "@material-ui/icons";
import { Octokit } from "@octokit/rest";
import React, { useState, useEffect, useContext } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";

// Local Imports
import { Context } from "../Store/Store";
import { githubToken } from "../utils/api_secret";
import { bannedRoles } from "../utils/constants";
import { Link } from "react-router-dom";
import { useAuth0 } from "../Auth/react-auth0-spa";
import IssueBubbleBody from "./components/IssueBodyBubble";
import { Fragment } from "react";
import { SingleIssueBodyBubble } from "./components/SingleIssueBodyBubble";
import { createGithubComment } from "../utils/SharedFunctions"


  

// Global vars
var replyParser = require("node-email-reply-parser");

// Default function
const Issue = (props) => {
  const {
    getTokenSilently,
    loading,
    config
  } = useAuth0();

  const issueNumber = props.match.params.issueNumber
    ? parseInt(props.match.params.issueNumber)
    : null;
  const [state, dispatch] = useContext(Context);
  const [showIssue, setShowIssue] = useState(false);
  const [issueBody, setIssueBody] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newCommentAdded, setNewCommentAdded] = useState(false);

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

  const addNewComment = async () => {
    let comment = newComment.concat(
      `<br/> ** From @${user.nickname} [${user.name}]`
    );
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: "precision-sustainable-ag",
        repo: "data_corrections",
        issue_number: issueNumber,
        body: comment,
      }
    );
  };

  const fetchIssueComments = () => {
    getIssueDetails().then((resp) => {
      console.log("resp = " + resp)
      const data = resp.data.map((data) => {
        const viaEmail = data.body.includes("<notifications@github.com>");
        const hasMention = data.body.includes("<br/> ** From");

        console.log("body = " + data.body)

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
      // console.log(markdownConvert.makeHtml(resp.data[0].body));
      var issueBodyRev = [...data];
      setIssueBody(issueBodyRev);
      setShowIssue(true);
    });
  };

  async function handleNewComment() {
    let token = await getTokenSilently({
      audience: `https://precision-sustaibale-ag/tech-dashboard`
    });

    createGithubComment(user.nickname, newComment, issueNumber, token)
      .then((resp) => {})
      .then(() => {
        setNewCommentAdded(!newCommentAdded);
        setNewComment("");
      });
  }

  useEffect(() => {
    console.log("entered use effect");
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

  const setNewCommentBody = (text) => {
    setNewComment(text);
  };

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
                console.log("this is the body" + JSON.stringify(issueData))
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
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <Typography variant="caption">
                Please enter your comments below
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <MDEditor
                preview="edit"
                value={newComment}
                onChange={setNewCommentBody}
                commands={[
                  commands.bold,
                  commands.italic,
                  commands.hr,
                  commands.code,
                  commands.checkedListCommand,
                  commands.unorderedListCommand,
                  commands.quote,
                  commands.title,
                  commands.fullscreen,
                  commands.codeLive,
                  commands.codeEdit,
                  githubUserMentionCommand,
                ]}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleNewComment()}
              >
                Add Comment
              </Button>
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    color={showPreview ? "primary" : "default"}
                    checked={showPreview}
                    onChange={(e) => setShowPreview(e.target.checked)}
                  />
                }
                label="Show Markdown Preview"
              />
            </Grid>
          </Grid>
        </Grid>
        <Dialog
          open={showUsersDialog}
          onClose={() => setShowUsersDialog(false)}
          aria-labelledby="form-dialog-title"
          disableBackdropClick
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle id="form-dialog-title">Github Users</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              {githubUsers.length > 0 ? (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      placeholder="Search users here"
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                    />
                  </Grid>

                  {filteredUsers.map((user) => (
                    <Grid item key={user.id} xs={12} md={4}>
                      <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        spacing={3}
                      >
                        <Grid item xs="auto" md="auto">
                          <Avatar
                            variant="rounded"
                            alt={user.login}
                            src={user.avatar_url}
                          />
                        </Grid>
                        <Grid item xs="auto" md="auto">
                          <Button
                            onClick={() => {
                              setNewComment(newComment + ` @${user.login}`);
                              setShowUsersDialog(false);
                              setSearchUser("");
                            }}
                          >
                            {user.login}
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </>
              ) : (
                <Typography variant="body1">No Users Available</Typography>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowUsersDialog(false)}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Slide>
  );
};

// const createGithubComment = async (
//   nickname,
//   newComment,
//   number,
//   token
//   ) => {
//     const data = {
//       action: 'comment',
//       user: nickname,
//       comment: newComment,
//       number: number,
//       token: token,
//     };

//     const options = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data),
//       mode: 'cors', // no-cors, *cors, same-origin
//     }

//     // console.log("token =" + data.token);

//     let res = await fetch(`https://githubissues.azurewebsites.us/api/githubissues`, options)
//     // .then(response => response.json())
//     .then(response => {
//       console.log(response)
//       return response;
//     })
//     .catch(err => {
//       console.log("error reading data " + err)
//     })

    
//     // let json = await res.json();
//     // console.log(res.status)


//     return res;
// }

export default Issue;
