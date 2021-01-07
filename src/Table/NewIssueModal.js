//Dependency Imports
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

//Local Imports
import { githubToken } from "../utils/api_secret";
import { Context } from "../Store/Store";
import { useAuth0 } from "../Auth/react-auth0-spa";

const showdown = require("showdown");
let table = require("markdown-table");

const NewIssueDialog = (props) => {
  const markdownConvert = new showdown.Converter({ tables: true });
  const [state, dispatch] = useContext(Context);
  const { user } = useAuth0();
  const octokit = new Octokit({ auth: githubToken });
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("md");
  const alwaysTaggedPeople = ["brianwdavis", "saseehav", user.nickname];
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
  //   const fileNewIssue = () => {
  //     // const tableHtml = document.getElementById("mdTable").innerHTML;
  //     // console.log(tableHtml);
  //     const tableHtml = (
  //       <table border="1">
  //         <tbody>
  //           <tr>
  //             <td>Code</td>
  //             <td>{props.data.code}</td>
  //           </tr>
  //           <tr>
  //             <td>Grower</td>
  //             <td>{props.data.last_name}</td>
  //           </tr>
  //           <tr>
  //             <td>State</td>
  //             <td>{props.data.state}</td>
  //           </tr>
  //           <tr>
  //             <td>County</td>
  //             <td>{props.data.county}</td>
  //           </tr>
  //           <tr>
  //             <td>Email</td>
  //             <td>{props.data.email}</td>
  //           </tr>
  //           <tr>
  //             <td>Year</td>
  //             <td>{props.data.year}</td>
  //           </tr>
  //           <tr>
  //             <td>Address</td>
  //             <td>{props.data.address}</td>
  //           </tr>
  //           <tr>
  //             <td>Location</td>
  //             <td>{props.data.latlng}</td>
  //           </tr>
  //           <tr>
  //             <td>Notes</td>
  //             <td>{props.data.notes}</td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     );
  //     const tableStr = markdownConvert.makeMarkdown("" + tableHtml + "");
  //     console.log(JSON.stringify(tableStr));

  //     // setNewComment(tableStr.toString());
  //   };

  const fileNewIssue = () => {
    if (issueTitle && newComment) {
      console.log("yes");
      setCheckValidation({ title: false, comment: false });

      const labels = [`${props.data.code}`, `${props.data.affiliation}`];

      //   const labels = [`${props.data.code}`, `${props.data.state}`];
      const assignedPeople =
        personName.length > 0 ? personName : [`${user.nickname}`];
      //   console.log(assignedPeople);
      const tableData = `<table border="1">
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
      const issueSet = setIssue(
        octokit,
        issueTitle,
        newComment,
        labels,
        assignedPeople,
        tableData,
        user.nickname
      );

      issueSet.then((res) => {
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
    getGithubResourceLimit().then((response) => {
      console.log(
        "Limit: " +
          response.data.rate.limit +
          "Used: " +
          response.data.rate.remaining
      );
    });
    //   check if a user is a collaborator to repo, else add the user to repo

    //   const collaboratorNames = res.data.map((data) => data.login);

    fetchCollabs()
      .then((res) => {
        //   console.log(res.status);
        const status = res.status;
        let collaborators = res.data.map((data) => {
          return { username: data.login, picture: data.avatar_url };
          // return data.login;
        });

        checkIfUserIsCollaborator(user.nickname)
          .then((res) => {
            setCollaborators(collaborators);
          })
          .catch((e) => {
            collaborators.push({
              username: user.nickname,
              picture: `https://via.placeholder.com/50x50?text=${user.nickname[0]}`,
            });
            setCollaborators(collaborators);
          });

        //   if (status !== 204) {
        //     // user is not a repo collaborator

        //   }
        //   if (res.status === 204) {
        //     console.log(`${user.nickname} already in corrections repo`);
        //   } else {
        //     console.error(res.status, res.data);
        //   }
      })
      .then(() => {
        try {
          addNewCollaboratorToRepo(user.nickname);
        } catch (e) {
          console.log(e);
        }
      })
      .catch((e) => {
        console.error(e);
        // most probably a 404 (user not exists in the repo)
        // //   setIsNewCollab(!isNewCollab);
        // addNewCollaboratorToRepo(user.nickname).then((res) => {
        //   if (res.status === 201) {
        //     console.log(`${user.nickname} added to corrections repo`);
        //   } else {
        //     if (res.status === 204) {
        //       console.log(`${user.nickname} already in corrections repo`);
        //     } else {
        //       console.error(res.status, res.data);
        //     }
        //   }
        // });
      });
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
          <Grid item xs={4}>
            <div id="mdTable">
              <table border="1">
                <tbody>
                  <tr>
                    <td>Code</td>
                    <td>{props.data.code}</td>
                  </tr>
                  <tr>
                    <td>Grower</td>
                    <td>{props.data.last_name}</td>
                  </tr>
                  <tr>
                    <td>State</td>
                    <td>{props.data.affiliation}</td>
                  </tr>
                  <tr>
                    <td>County</td>
                    <td>{props.data.county}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{props.data.email}</td>
                  </tr>
                  <tr>
                    <td>Year</td>
                    <td>{props.data.year}</td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td>{props.data.address}</td>
                  </tr>
                  <tr>
                    <td>Location</td>
                    <td>{props.data.latlng}</td>
                  </tr>
                  <tr>
                    <td>Notes</td>
                    <td>{props.data.notes}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="body1">Select Assignees</Typography>
              </Grid>
              {collaborators.map((name) => (
                <Grid item>
                  <Chip
                    disabled={
                      alwaysTaggedPeople.includes(name.username) ? true : false
                    }
                    color={
                      personName.includes(name.username) ? "primary" : "default"
                    }
                    avatar={
                      <Avatar
                        alt={name.username}
                        src={`${name.picture}&s=50`}
                      />
                    }
                    label={name.username}
                    onClick={(e) => {
                      if (personName.includes(name.username)) {
                        let newPerson = personName.filter(
                          (e) => e !== name.username
                        );
                        setPersonName(newPerson);
                      } else {
                        setPersonName([...personName, name.username]);
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {checkValidation.title && (
              <Typography variant="caption" color="error">
                Issue title is required
              </Typography>
            )}
            <TextField
              fullWidth
              error={checkValidation.title}
              variant="filled"
              label="Title"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            {checkValidation.comment && (
              <Typography variant="caption" color="error">
                Please describe the issue below
              </Typography>
            )}
            <MDEditor val value={newComment} onChange={setNewComment} />
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
export default NewIssueDialog;
