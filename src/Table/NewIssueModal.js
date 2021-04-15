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

// Local Imports
import { githubToken } from "../utils/api_secret";
import { useAuth0 } from "../Auth/react-auth0-spa";
import PropTypes from "prop-types";
import { createGithubIssue } from "../utils/SharedFunctions"

/**
 *  A component to allow users to create "New Issue" in a modal
 */

// Default function
const NewIssueModal = (props) => {
  const {
    getTokenSilently,
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
      props.setSnackbarData({
        open: true,
        text: `Creating new issue for ${props.data.code}`,
      });


      setCheckValidation({ title: false, comment: false });

      const labels = [`${props.data.code}`, `${props.data.affiliation}`, "site-information"];

      const assignedPeople =
        personName.length > 0 ? personName : [`${props.nickname}`];

      const tableData = `<table>
        <tbody>
          <tr>
            <td>Code</td>
            <td>${props.data.code}</td>
          </tr>
          <tr>
            <td>Grower</td>
            <td>${props.data.last_name}</td>
          </tr>
          <tr>
            <td>State</td>
            <td>${props.data.affiliation}</td>
          </tr>
          <tr>
            <td>County</td>
            <td>${props.data.county}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>${props.data.email}</td>
          </tr>
          <tr>
            <td>Year</td>
            <td>${props.data.year}</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>${props.data.address}</td>
          </tr>
          <tr>
            <td>Location</td>
            <td>${props.data.latlng}</td>
          </tr>
          <tr>
            <td>Notes</td>
            <td>${props.data.notes}</td>
          </tr>
        </tbody>
      </table>`;

      const body = tableData + " <br/> " + newComment;

      let token = await getTokenSilently({
        audience: `https://precision-sustaibale-ag/tech-dashboard`
      });
      
      const issueSet = createGithubIssue(
        issueTitle,
        body,
        labels,
        assignedPeople,
        props.nickname,
        token
      );

      issueSet.then((res) => {
        setNewComment("");
        setIssueTitle("");
        if (res.status === 201) {
          props.handleNewIssueDialogClose();
          props.setSnackbarData({
            open: true,
            text: `New Issue has been created for ${props.data.code}`,
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
  };

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
            <div id="mdTable">
              <table border="1" className="newIssueModalTable">
                <thead>
                  <tr>
                    <th>
                      <Typography variant="body1">Code</Typography>
                    </th>
                    <th>
                      <Typography variant="body1">Year</Typography>
                    </th>
                    <th>
                      <Typography variant="body1">Last Name</Typography>
                    </th>
                    <th>
                      <Typography variant="body1">Email</Typography>
                    </th>
                    <th>
                      <Typography variant="body1">Phone</Typography>
                    </th>
                    <th>
                      <Typography variant="body1">State</Typography>
                    </th>
                    <th>
                      <Typography variant="body1">County</Typography>
                    </th>
                    <th>
                      <Typography variant="body1">Address</Typography>
                    </th>
                    <th>
                      <Typography variant="body1">Location</Typography>
                    </th>
                    <th>
                      <Typography variant="body1">Notes</Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Typography variant="body1">{props.data.code}</Typography>
                    </td>
                    <td>
                      <Typography variant="body1">{props.data.year}</Typography>
                    </td>
                    <td>
                      <Typography variant="body1">
                        {props.data.last_name}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="body1">
                        {props.data.email}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="body1">
                        {props.data.phone}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="body1">
                        {props.data.affiliation}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="body1">
                        {props.data.county}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="body1">
                        {props.data.address}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="body1">
                        {props.data.latlng}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="body1">
                        {props.data.notes}
                      </Typography>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Grid>
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

// Helper functions
const setIssue = async (
  octokit,
  issueTitle,
  newComment,
  labels,
  assignees,
  table,
  nickname
) => {
  return await octokit.issues.create({
    owner: "precision-sustainable-ag",
    repo: "data_corrections",
    title: issueTitle,
    body:
      table +
      " <br/> " +
      newComment +
      ` <br/> ** Issue Created By: @${nickname} ** `,
    labels: labels,
    assignees: assignees,
  });
};

NewIssueModal.defaultProps = {
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

NewIssueModal.propTypes = {
  /** Site information data */
  data: PropTypes.shape({
    /** Site code */
    code: PropTypes.string.isRequired,
    /** Enrollment year */
    year: PropTypes.number.isRequired,
    /** Grower's last name */
    last_name: PropTypes.string.isRequired,
    /** Grower's email */
    email: PropTypes.string,
    /** Grower's phone */
    phone: PropTypes.string,
    /** Site affiliation */
    affiliation: PropTypes.string.isRequired,
    /** Site county */
    county: PropTypes.string,
    /** Site address */
    address: PropTypes.string,
    /** Site Lat,Lng */
    latlng: PropTypes.string,
    /** Notes or other information recorded about the site */
    notes: PropTypes.string,
  }).isRequired,
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

export default NewIssueModal;
