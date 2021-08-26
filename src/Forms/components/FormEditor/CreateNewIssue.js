import React, { useState } from "react";
import {
  Button,
  Tooltip,
} from "@material-ui/core";
import { QuestionAnswer } from "@material-ui/icons";
import IssueDialogue from "../../../Comments/IssueDialogue";
import PropTypes from "prop-types";

const CreateNewIssue = ( props ) => {
    let { issueData, index, user, affiliationLookup, setSnackbarData, formName } = props
    const [showNewIssueDialog, setShowNewIssueDialog] = useState(false);
    const [newIssueData, setNewIssueData] = useState({});
    const [activeIssueIndex, setActiveIssueIndex] = useState(null);
    // console.log("cne");
    return (
    <div>
    {showNewIssueDialog ? (
        ""
    ) : (
        <Tooltip title="Submit a new issue">
        <Button
            startIcon={<QuestionAnswer />}
            size="small"
            variant="contained"
            color="primary"
            // color={isDarkTheme ? "primary" : "default"}
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
            rowData={JSON.stringify(newIssueData, null, "\t")}
            dataType="json"
            setSnackbarData={setSnackbarData}
            formName={formName}
            affiliationLookup={affiliationLookup}
            closeDialogue={setShowNewIssueDialog}
            labels={[
                newIssueData._id.toString(),
                affiliationLookup[newIssueData._submitted_by],
                formName,
                "kobo-forms",
            ]}
            setShowNewIssueDialog={setShowNewIssueDialog}
        />
    ) : (
        ""
    )}
    </div>
);
};

CreateNewIssue.propTypes = {
    issueData: PropTypes.any,
    index: PropTypes.number,
    user: PropTypes.any, 
    affiliationLookup: PropTypes.object, 
    setSnackbarData: PropTypes.function, 
    formName: PropTypes.any,
};

// export default React.memo(CreateNewIssue);
export default CreateNewIssue;