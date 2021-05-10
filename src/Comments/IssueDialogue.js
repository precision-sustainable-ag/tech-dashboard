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
    const [personName, setPersonName] = React.useState(alwaysTaggedPeople);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [removeCommentText, setRemoveCommentText] = useState(false);

    // function toggleRemoveCommentText(val) {
    //   setRemoveCommentText(val);
    // }

    async function fileNewIssue(newComment) {
        if (issueTitle && newComment) {
          setCheckValidation({ title: false, comment: false });

          setButtonDisabled(true);
  
          const assignedPeople = personName.length > 0 ? personName : [`${props.nickname}`];
            
          let token = await getTokenSilently({
            audience: `https://precision-sustaibale-ag/tech-dashboard`
          });
  
          const body = newComment;
          
          const issueSet = createGithubIssue(
            issueTitle,
            body,
            props.labels,
            assignedPeople,
            props.nickname,
            token
          );
    
          issueSet.then((res) => {
            if (res.status === 201) {
              setButtonDisabled(false);
              setIssueTitle("");
              setRemoveCommentText(true);
              props.setSnackbarData({
                open: true,
                text: `New Issue has been created`,
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
                />
            </Grid>
        </Grid>
    )
}

export default IssueDialogue;