import React, { useState } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { QuestionAnswer } from '@material-ui/icons';

import PropTypes from 'prop-types';

import { useAuth0 } from '../../../Auth/react-auth0-spa';
// import { Context } from '../../Store/Store';
import IssueDialogue from '../../../Comments/components/IssueDialogue/IssueDialogue';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setIssueDialogueData } from '../../../Store/actions';

const CreateNewIssue = (props) => {
  let { issueData, index } = props;

  const { user } = useAuth0();
  // const [state] = useContext(Context);
  const formName = useSelector((state) => state.formsData.name);
  const formType = useSelector((state) => state.formsData.type);
  const affiliationLookup = useSelector((state) => state.formsData.affiliationLookup);
  const dispatch = useDispatch();
  const issueDialogueData = useSelector((state) => state.issueDialogueData.issueDialogueData);
  const [newIssueData, setNewIssueData] = useState({});
  const [activeIssueIndex, setActiveIssueIndex] = useState(null);

  return (
    <div>
      {issueDialogueData.showNewIssueDialog ? (
        ''
      ) : (
        <Tooltip title="Submit a new issue">
          <Button
            startIcon={<QuestionAnswer />}
            size="small"
            variant="contained"
            color="primary"
            onClick={() => {
              setNewIssueData(issueData);
              setActiveIssueIndex(index);
              dispatch(
                setIssueDialogueData({
                  nickname: user.nickname,
                  dataType: 'json',
                  setShowNewIssueDialogue: true,
                }),
              );
            }}
          >
            Add Comment
          </Button>
        </Tooltip>
      )}

      {issueDialogueData.setShowNewIssueDialog && index === activeIssueIndex ? (
        <IssueDialogue
          rowData={JSON.stringify(newIssueData, null, '\t')}
          labels={[
            newIssueData._id.toString(),
            affiliationLookup[newIssueData._submitted_by],
            formName,
            'kobo-forms',
            formType,
          ]}
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
};
export default CreateNewIssue;
