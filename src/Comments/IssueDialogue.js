import React, { useState, useEffect, useContext } from "react";
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
    
    // console.log(JSON.stringify(props))
    
    const alwaysTaggedPeople = ["brianwdavis", "saseehav", props.nickname];
    const [personName, setPersonName] = React.useState(alwaysTaggedPeople);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    async function fileNewIssue(newComment) {
        if (issueTitle && newComment) {
          setCheckValidation({ title: false, comment: false });

          setButtonDisabled(true)
  
          const assignedPeople = personName.length > 0 ? personName : [`${props.nickname}`];
  
          let jsonData = JSON.stringify(props.data, null, "\t");
          
          let token = await getTokenSilently({
            audience: `https://precision-sustaibale-ag/tech-dashboard`
          });
  
          // console.log(JSON.stringify(props))
          let labels = ["farm-dates"]
  
          const body = newComment;
          
          const issueSet = createGithubIssue(
            issueTitle,
            body,
            labels,
            assignedPeople,
            props.nickname,
            token
          );
    
          issueSet.then((res) => {
            if (res.status === 201) {
              setButtonDisabled(false);
              setIssueTitle("")
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
                <Comments handleNewComment={fileNewIssue} nickname={props.nickname} rowData={props.rowData} dataType={props.dataType} buttonDisabled={buttonDisabled}/>
            </Grid>
        </Grid>
    )
}

export default IssueDialogue;