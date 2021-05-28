// Dependency Imports
import {
    Avatar,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography,
  } from "@material-ui/core";
  import React, { useState, useEffect, useContext } from "react";
  import { Octokit } from "@octokit/rest";
  import MDEditor from "@uiw/react-md-editor";
  import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
  import dark from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark";
  
  // Local Imports
  import { githubToken } from "../../utils/api_secret";
  import { Context } from "../../Store/Store";
  import { useAuth0 } from "../../Auth/react-auth0-spa";
  import PropTypes from "prop-types";
  import { createGithubIssue } from "../../utils/SharedFunctions"
  
  /**
   *  A component to allow users to create "New Issue" in a modal
   */
  
  // Default function
  const NewFormIssue = (props) => {
    const {
      getTokenSilently,
      getTokenWithPopup,
    } = useAuth0();
  
    const octokit = new Octokit({ auth: githubToken });
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState("lg");
    const alwaysTaggedPeople = ["brianwdavis", "saseehav", props.nickname];
    const [newComment, setNewComment] = useState("");
    const [issueTitle, setIssueTitle] = useState("");
    const [checkValidation, setCheckValidation] = useState({
      title: false,
      comment: false,
    });
    const [collaborators, setCollaborators] = useState([]);
    const handleMaxWidthChange = (event) => {
        setMaxWidth(event.target.value);
    };

    async function fileNewIssue() {
      if (issueTitle && newComment) {
        setCheckValidation({ title: false, comment: false });

        const assignedPeople = personName.length > 0 ? personName : [`${props.nickname}`];

        let jsonData = JSON.stringify(props.data, null, "\t");

        // console.log(JSON.stringify(props))
        let labels = [props.data._id.toString(), props.affiliationLookup[props.data._submitted_by], props.formName, "kobo-forms"]

        const body = "```json\n" + jsonData + "\n```\n" + " <br/> " + newComment;
        
        const issueSet = createGithubIssue(
          issueTitle,
          body,
          labels,
          assignedPeople,
          props.nickname,
          getTokenSilently,
          getTokenWithPopup,
        );
  
        issueSet.then((res) => {
          if (res.status === 201) {
            props.handleNewIssueDialogClose();
            props.setSnackbarData({
              open: true,
              text: `New Issue has been created for ${props.data._id.toString()}`,
              // text: "created test issue"
            });
          }
        });
      } else {
        if (!issueTitle || !newComment) {
          setCheckValidation({ title: true, comment: true });
        } else {
          if (!issueTitle) {
            setCheckValidation({ ...checkValidation, title: true });
          } else {
            setCheckValidation({ ...checkValidation, comment: true });
          }
        }
      }
    }
  
    const fetchCollabs = async () => {
      return await octokit.request("GET /repos/{owner}/{repo}/collaborators", {
        owner: "precision-sustainable-ag",
        repo: "data_corrections",
      });
    };

    const checkIfUserIsCollaborator = async (username) => {
      return await octokit.request(
        "GET /repos/{owner}/{repo}/collaborators/{username}",
        {
          owner: "precision-sustainable-ag",
          repo: "data_corrections",
          username: username,
        }
      );
    };

    const getGithubResourceLimit = async () => {
      return await octokit.request("GET /rate_limit");
    };

    const addNewCollaboratorToRepo = async (username) => {
      return await octokit.request(
        "PUT /repos/{owner}/{repo}/collaborators/{username}",
        {
          owner: "precision-sustainable-ag",
          repo: "data_corrections",
          username: username,
          permission: "push",
        }
      );
    };
    
    const [isNewCollab, setIsNewCollab] = useState(false);
    
    useEffect(() => {
      //   check if a user is a collaborator to repo, else add the user to repo
      fetchCollabs()
        .then((res) => {
          const status = res.status;
          let collaborators = res.data.map((data) => {
            return { username: data.login, picture: data.avatar_url };
          });
  
          checkIfUserIsCollaborator(props.nickname)
            .then((res) => {
              setCollaborators(collaborators);
              if (res.status === 204) {
                // user already exists
                return false;
              } else {
                try {
                  addNewCollaboratorToRepo(props.nickname).catch((e) => {
                    console.error(e);
                  });
                } catch (e) {
                  console.log(e);
                  collaborators.push({
                    username: props.nickname,
                    picture: `https://via.placeholder.com/50x50?text=${props.nickname}`,
                  });
                }
              }
            })
            .catch((e) => {
              console.error(e);
              collaborators.push({
                username: props.nickname,
                picture: `https://via.placeholder.com/50x50?text=${props.nickname}`,
              });
              setCollaborators(collaborators);
            });
        })
        .catch((e) => {
          console.error(e);
          getGithubResourceLimit().then((response) => {
            console.log(
              "%cRequest Limit: " +
                response.data.rate.limit +
                "%c Used: " +
                response.data.rate.remaining,
              "color: green;font-family:system-ui;font-size:0.6rem;",
              "color: red;font-family:system-ui;font-size:0.6rem;"
            );
          });
        });
      return () => {};
    }, [isNewCollab]);
  
    const [personName, setPersonName] = React.useState(alwaysTaggedPeople);

    
    return (
      <Dialog
        open={props.open}
        onClose={props.handleNewIssueDialogClose}
        aria-labelledby="form-dialog-title"
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        disableBackdropClick
      >
        <DialogTitle id="form-dialog-title">
          <Grid container justify="space-between">
            <Grid item>Submit a new Issue</Grid>
            <Grid item>
              <Select
                autoFocus
                value={maxWidth}
                onChange={handleMaxWidthChange}
                inputProps={{
                  name: "max-width",
                  id: "max-width",
                }}
              >
                <MenuItem value={false}>regular</MenuItem>
                <MenuItem value="xs">x-small</MenuItem>
                <MenuItem value="sm">small</MenuItem>
                <MenuItem value="md">medium</MenuItem>
                <MenuItem value="lg">large</MenuItem>
                <MenuItem value="xl">x-large</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>

            <Grid item xs={12}>
              {checkValidation.title && (
                <Typography variant="caption" color="error">
                  Issue title is required
                </Typography>
              )}
              <TextField
                fullWidth
                placeholder="Give a title to this issue"
                error={checkValidation.title}
                variant="filled"
                label="Issue Title"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              {checkValidation.comment || newComment.length === 0 ? (
                <Typography
                  variant="caption"
                  color={checkValidation.comment ? "error" : "initial"}
                >
                  Please describe the issue below
                </Typography>
              ) : (
                ""
              )}
              <MDEditor
                preview="edit"
                value={newComment}
                onChange={setNewComment}
              />
            </Grid>
          </Grid>
          <DialogActions>
            <Button onClick={props.handleNewIssueDialogClose}>Cancel</Button>
            <Button color="primary" onClick={fileNewIssue} variant="contained">
              Submit
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  };
  
  NewFormIssue.defaultProps = {
    data: {
      code: "XYZ",
      year: 2020,
      last_name: "Default Name",
      affiliation: "NC",
    },
    open: false,
    nickname: "rbandooni",
    snackbarData: {
      open: false,
      text: "",
    },
    setSnackbarData: () => this.setSnackbarData(),
    handleNewIssueDialogClose: () => {},
  };
  
  NewFormIssue.propTypes = {
    /** Data displayed in snackbar */
    snackbarData: PropTypes.shape({
      open: PropTypes.bool.isRequired,
      text: PropTypes.string,
    }).isRequired,
    /** Snackbar dispatcher to be returned from this component */
    setSnackbarData: PropTypes.func.isRequired,
    /** Controls the hide/un-hide property of this component */
    open: PropTypes.bool.isRequired,
    /** Handles the graceful closing of the modal */
    handleNewIssueDialogClose: PropTypes.func.isRequired,
    /** Logged In user's GitHub nickname */
    nickname: PropTypes.string.isRequired,
  };
  
  export default NewFormIssue;
  