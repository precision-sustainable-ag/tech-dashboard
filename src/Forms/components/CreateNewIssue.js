import React, { useState, useContext } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { QuestionAnswer } from '@material-ui/icons';

import PropTypes from 'prop-types';

import { useAuth0 } from '../../Auth/react-auth0-spa';
import { Context } from '../../Store/Store';
import IssueDialogue from '../../Comments/IssueDialogue';

const CreateNewIssue = (props) => {
  let { issueData, index, setSnackbarData } = props;

  const { user } = useAuth0();
  const [state] = useContext(Context);

  const [showNewIssueDialog, setShowNewIssueDialog] = useState(false);
  const [newIssueData, setNewIssueData] = useState({});
  const [activeIssueIndex, setActiveIssueIndex] = useState(null);

  return (
    <div>
      {showNewIssueDialog ? (
        ''
      ) : (
        <Tooltip title="Submit a new issue">
          <Button
            startIcon={<QuestionAnswer />}
            size="small"
            variant="contained"
            color="primary"
            onClick={() => {
              setShowNewIssueDialog(true);
              setNewIssueData(issueData);
              setActiveIssueIndex(index);
            }}
          >
            Add Comment
          </Button>
        </Tooltip>
      )}

      {showNewIssueDialog && index === activeIssueIndex ? (
        <IssueDialogue
          nickname={user.nickname}
          rowData={JSON.stringify(newIssueData, null, '\t')}
          dataType="json"
          setSnackbarData={setSnackbarData}
          formName={state.formsData.name}
          closeDialogue={setShowNewIssueDialog}
          labels={[
            newIssueData._id.toString(),
            state.affiliationLookup[newIssueData._submitted_by],
            state.formsData.name,
            'kobo-forms',
            state.formsData.type,
          ]}
          setShowNewIssueDialog={setShowNewIssueDialog}
        />
      ) : (
        ''
      )}
    </div>
  );
};

CreateNewIssue.propTypes = {
  issueData: PropTypes.any,
  index: PropTypes.number,
  setSnackbarData: PropTypes.func,
};
export default CreateNewIssue;
