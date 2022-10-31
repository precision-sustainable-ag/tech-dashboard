import React, { useState } from 'react';
import { Grid, TextField, Typography } from '@material-ui/core';
import Comments from '../../Comments';
import { useAuth0 } from '../../../Auth/react-auth0-spa';
import { callAzureFunction } from '../../../utils/SharedFunctions';
import PropTypes from 'prop-types';
import { setSnackbarData } from '../../../Store/actions';
import { setIssueDialogueData } from '../../../Store/actions';
import { useSelector, useDispatch } from 'react-redux';

const IssueDialogue = (props) => {
  const [checkValidation, setCheckValidation] = useState({
    title: false,
    comment: false,
  });
  const [issueTitle, setIssueTitle] = useState('');
  const dispatch = useDispatch();
  const { getTokenSilently } = useAuth0();
  const { labels, rowData } = props;
  const issueDialogueData = useSelector((state) => state.issueDialogueData.issueDialogueData);
  const alwaysTaggedPeople = ['brianwdavis', 'saseehav', issueDialogueData.nickname];
  const [personName] = useState(alwaysTaggedPeople);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [removeCommentText, setRemoveCommentText] = useState(false);

  async function fileNewIssue(newComment) {
    if (issueTitle && newComment) {
      setCheckValidation({ title: false, comment: false });

      setButtonDisabled(true);

      const assignedPeople = personName.length > 0 ? personName : [`${issueDialogueData.nickname}`];
      const data = {
        user: issueDialogueData.nickname,
        title: issueTitle,
        assignees: assignedPeople,
        labels: labels,
        body: newComment,
      };

      const issueSet = callAzureFunction(
        data,
        `precision-sustainable-ag/repos/data_corrections/issues/${issueDialogueData.nickname}`,
        'POST',
        getTokenSilently,
      );

      issueSet.then((res) => {
        setButtonDisabled(false);
        setIssueTitle('');
        setRemoveCommentText(true);
        if (res.response) {
          if (res.response.status === 201) {
            dispatch(
              setSnackbarData({
                open: true,
                text: `New Issue has been created`,
                severity: 'success',
              }),
            );
          } else {
            console.log('Function could not create issue');
            dispatch(
              setSnackbarData({
                open: true,
                text: `Could not create issue (error code 0)`,
                severity: 'error',
              }),
            );
          }
        } else {
          console.log('No response from function, likely cors');
          dispatch(
            setSnackbarData({
              open: true,
              text: `Could not create issue (error code 1)`,
              severity: 'error',
            }),
          );
        }

        if (issueDialogueData.setShowNewIssueDialogue)
          dispatch(setIssueDialogueData({ ...issueDialogueData, setShowNewIssueDialogue: false }));
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

  return (
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
      <Grid item xs={12} lg={6}>
        <Comments
          handleNewComment={fileNewIssue}
          rowData={rowData}
          buttonDisabled={buttonDisabled}
          removeCommentText={removeCommentText}
          setRemoveCommentText={setRemoveCommentText}
        />
      </Grid>
    </Grid>
  );
};

export default IssueDialogue;

IssueDialogue.propTypes = {
  nickname: PropTypes.any,
  labels: PropTypes.any,
  setShowNewIssueDialog: PropTypes.func,
  rowData: PropTypes.any,
  dataType: PropTypes.any,
  defaultText: PropTypes.string,
};
