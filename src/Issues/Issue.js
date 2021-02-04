// Dependency Imports
import {
  Button,
  Card,
  CardContent,
  Grid,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { Octokit } from "@octokit/rest";
import React, { useState, useEffect, useContext } from "react";
import MDEditor from "@uiw/react-md-editor";

// Local Imports
import { Context } from "../Store/Store";
import { githubToken } from "../utils/api_secret";
import { bannedRoles } from "../utils/constants";

// Global vars
const showdown = require("showdown");

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

  const octokit = new Octokit({ auth: githubToken });
  const markdownConvert = new showdown.Converter();
  useEffect(() => {
    if (bannedRoles.includes(state.userRole)) {
      setShowIssue(false);
    } else {
      fetchIssueComments();
    }
  }, [state.userRole]);

  const addNewComment = async () => {
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: "precision-sustainable-ag",
        repo: "data_corrections",
        issue_number: issueNumber,
        body: newComment,
      }
    );
  };

  const fetchIssueComments = () => {
    getIssueDetails().then((resp) => {
      console.log(resp.data);
      // console.log(markdownConvert.makeHtml(resp.data[0].body));
      var issueBodyRev = [...resp.data].reverse();
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

  return showIssue ? (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item>
            <Button variant="contained" href="/issues" size="small">
              {" "}
              <ArrowBack /> All Issues
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MDEditor value={newComment} onChange={setNewComment} />
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
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={3}>
          {issueBody.length > 0
            ? issueBody.map((issueDetails, index) => (
                <Grid item xs={12}>
                  <Card style={{ width: "100%" }}>
                    <CardContent>
                      <Grid container>
                        <Grid item xs={12}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: markdownConvert
                                .makeHtml(issueDetails.body)
                                .toString(),
                            }}
                          ></div>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : ""}
        </Grid>
      </Grid>
    </Grid>
  ) : (
    ""
  );
};

export default Issue;
