import React, { Fragment, useState } from 'react';
import { Button, Tooltip } from "@material-ui/core";
import { QuestionAnswer } from "@material-ui/icons";
import ActualFarmDates from "./ActualFarmDates";
import IssueDialogue from "../../Comments/IssueDialogue";

const FarmDatesDropdown = ({ rowData, fetchFromApi, nickname, setSnackbarData }) => {
    const [showIssue, setShowIssue] = useState(false); 

    return (
        <Fragment>
          <ActualFarmDates rowData={rowData} fetchFromApi={fetchFromApi}/>
          <br/>
          {!showIssue && 
            <Tooltip title="Submit a new issue">
              <Button
                startIcon={<QuestionAnswer />}
                size="small"
                variant="contained"
                color="primary"
                // color={props.props.isDarkTheme ? "primary" : "default"}
                onClick={() => {
                  console.log("clicked");
                  setShowIssue(!showIssue);
                }}
              >
                Comment
              </Button>
            </Tooltip>
          }
          <br/>
          {showIssue && 
            <IssueDialogue
              nickname={nickname}
              rowData={rowData}
              dataType="table"
              setSnackbarData={setSnackbarData}
              labels={["farm-dates"]}
              setShowNewIssueDialog={setShowIssue}
            />
          }
          <br/>
        </Fragment>
      );
}

export default FarmDatesDropdown
