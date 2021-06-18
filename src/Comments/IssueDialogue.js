import React, { useState } from "react";
import {
    Grid,
    TextField,
    Typography,
  } from "@material-ui/core";
import Comments from "./Comments"
import { useAuth0 } from "../Auth/react-auth0-spa";
import { createGithubIssue } from "../utils/SharedFunctions"

const IssueDialogue = (props) => {
    const [checkValidation, setCheckValidation] = useState({
        title: false,
        comment: false,
    });
    const [issueTitle, setIssueTitle] = useState("");
    const {
        getTokenSilently,
    } = useAuth0();
        
    const alwaysTaggedPeople = ["brianwdavis", "saseehav", props.nickname];
    const [personName, setPersonName] = useState(alwaysTaggedPeople);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [removeCommentText, setRemoveCommentText] = useState(false);

    async function fileNewIssue(newComment) {
        if (issueTitle && newComment) {
          setCheckValidation({ title: false, comment: false });

          setButtonDisabled(true);
  
          const assignedPeople = personName.length > 0 ? personName : [`${props.nickname}`];
  
          const body = newComment;
          
          const issueSet = createGithubIssue(
            issueTitle,
            body,
            props.labels,
            assignedPeople,
            props.nickname,
            getTokenSilently
          );
    
          issueSet.then((res) => {
            setButtonDisabled(false);
            setIssueTitle("");
            setRemoveCommentText(true);
            if(res){
              if (res.status === 201) {
                props.setSnackbarData({
                  open: true,
                  text: `New Issue has been created`,
                  severity: "success"
                });
              }
              else{
                console.log("Function could not create issue");
                props.setSnackbarData({
                  open: true,
                  text: `Could not create issue (error code 0)`,
                  severity: "error"
                });
              }
            } else {
              console.log("No response from function, likely cors");
              props.setSnackbarData({
                open: true,
                text: `Could not create issue (error code 1)`,
                severity: "error"
              });
            }

            if(props.setShowNewIssueDialog) props.setShowNewIssueDialog(false);
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

    return(
        <Grid container spacing={1}>
            <Grid item xs={12} >
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
            <Grid item xs={12} lg={6}>
                <Comments 
                  handleNewComment={fileNewIssue} 
                  nickname={props.nickname} 
                  rowData={props.rowData} 
                  dataType={props.dataType} 
                  buttonDisabled={buttonDisabled}
                  removeCommentText={removeCommentText}
                  setRemoveCommentText={setRemoveCommentText}
                  setShowNewIssueDialog={props.setShowNewIssueDialog}
                />
            </Grid>
        </Grid>
    )
}

export default IssueDialogue;