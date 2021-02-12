// Dependency Imports
import {
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  Grow,
  Slide,
  Switch,
  Typography,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { Octokit } from "@octokit/rest";
import React, { useState, useEffect, useContext } from "react";
import MDEditor from "@uiw/react-md-editor";

// Local Imports
import { Context } from "../Store/Store";
import { githubToken } from "../utils/api_secret";
import { bannedRoles } from "../utils/constants";
import { Link } from "react-router-dom";
import { useAuth0 } from "../Auth/react-auth0-spa";
import IssueBubbleBody from "./components/IssueBodyBubble";

// Global vars
var replyParser = require("node-email-reply-parser");

// Default function
const Issue = (props) => {
  const issueNumber = props.match.params.issueNumber
    ? parseInt(props.match.params.issueNumber)
    : null;
  const [state, dispatch] = useContext(Context);
  const [showIssue, setShowIssue] = useState(false);
  const [issueBody, setIssueBody] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newCommentAdded, setNewCommentAdded] = useState(false);

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
      // console.log(markdownConvert.makeHtml(resp.data[0].body));
      var issueBodyRev = [...data];
      setIssueBody(issueBodyRev);
      setShowIssue(true);
    });
  };

  const handleNewComment = () => {
    addNewComment()
      .then((resp) => {})
      .then(() => {
        setNewCommentAdded(!newCommentAdded);
        setNewComment("");
      });
  };

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
      }
    );
  };

  // const getUserFullName = async (username) => {
  //   let user = (await fetch(`https://api.github.com/users/${username}`)).json();

  //   return `${user.name}`;
  // };

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
            {issueBody.length > 0
              ? issueBody.map((issueData, index) => {
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
              : ""}

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
                onChange={setNewComment}
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
      </Grid>
    </Slide>
  );
};

export default Issue;
