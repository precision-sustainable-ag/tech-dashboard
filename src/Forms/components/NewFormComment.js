import React, { useEffect, useContext, useState } from "react";
import { useAuth0 } from "../../Auth/react-auth0-spa";
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
import MDEditor, { commands } from "@uiw/react-md-editor";
import { ArrowBack, PersonAdd } from "@material-ui/icons";

export default function NewFormComment(props) {
  // console.log(JSON.stringify(props))
  // console.log(props.username)
  // console.log(JSON.stringify(props))

    const { 
        user,
        getTokenSilently 
    } = useAuth0();

    const [showIssue, setShowIssue] = useState(false);
    const [issueBody, setIssueBody] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [newCommentAdded, setNewCommentAdded] = useState(false);
    const [showUsersDialog, setShowUsersDialog] = useState(false);
    const [searchUser, setSearchUser] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    const setNewCommentBody = (text) => {
        setNewComment(text);
      };
      
    async function handleNewComment() {
        let token = await getTokenSilently({
            audience: `https://precision-sustaibale-ag/tech-dashboard`
        });
    
        setGitHubCommenter(user.nickname, newComment, 4, token)
            .then((resp) => {})
            .then(() => {
            setNewCommentAdded(!newCommentAdded);
            setNewComment("");
        });
    }

    async function fileNewIssue() {
        console.log("yes");
        // setCheckValidation({ title: false, comment: false });
  
        // const labels = [`${props.data.code}`, `${props.data.affiliation}`];
  
        //   const labels = [`${props.data.code}`, `${props.data.state}`];
        const assignedPeople = ['mikahpinegar']
          // personName.length > 0 ? personName : [`${props.nickname}`];
        //   console.log(assignedPeople);
  
        // console.log(config)
        
        let token = await getTokenSilently({
          audience: `https://precision-sustaibale-ag/tech-dashboard`
        });

        let labels = [props.record._id, props.record._submitted_by];
        let tableData = props.record;
        let issueTitle = props.record._id
  
        // let token = await getTokenSilently();

        console.log("title " + issueTitle + " comment " 
                    + newComment + " labels " + labels
                    + " assignees " + assignedPeople + " tableData " + tableData
                    + " nickname " + props.nickname + " token " + token)
        
  
        // console.log("token out useEffect = " + token);
        // const issueSet = setGitHubIssuer(
        //   issueTitle,
        //   newComment,
        //   labels,
        //   assignedPeople,
        //   tableData,
        //   props.nickname,
        //   token
        // );
  
        // issueSet.then((res) => {
        //   if (res.status === 201) {
        //     props.handleNewIssueDialogClose();
        //     props.setSnackbarData({
        //       open: true,
        //       text: `New Issue has been created for ${props.data.code}`,
        //     });
        //   }
        // });
      } 

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

    return(
        <>
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
                onClick={() => fileNewIssue()}
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
        </>
    )
}

const setGitHubIssuer = async (
  issueTitle,
  newComment,
  labels,
  assignees,
  json,
  nickname,
  token
  ) => {
    const data = {
      action: 'create',
      user: nickname,
      title: issueTitle,
      assignees: assignees,
      labels: labels,
      body: 
        json +
        " <br/> " +
        newComment,
      token: token,
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      mode: 'cors', // no-cors, *cors, same-origin
    }

    let res = await fetch(`https://githubissues.azurewebsites.us/api/githubissues`, options)
    // .then(response => response.json())
    .then(response => {
      console.log(response)
      return response;
    })
    .catch(err => {
      console.log("error reading data " + err)
    })

    
    // let json = await res.json();
    console.log(res.status)


    return res;
}

const setGitHubCommenter = async (
    nickname,
    newComment,
    number,
    token
    ) => {
      const data = {
        action: 'comment',
        user: nickname,
        comment: newComment,
        number: number,
        token: token,
      };
  
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        mode: 'cors', // no-cors, *cors, same-origin
      }
  
      // console.log("token =" + data.token);
  
      let res = await fetch(`https://githubissues.azurewebsites.us/api/githubissues`, options)
      // .then(response => response.json())
      .then(response => {
        console.log(response)
        return response;
      })
      .catch(err => {
        console.log("error reading data " + err)
      })
  
      
      // let json = await res.json();
      // console.log(res.status)
  
  
      return res;
  }