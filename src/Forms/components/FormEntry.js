import React from "react";
import { Grid, Typography } from "@material-ui/core";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light";
import dark from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import PropTypes from "prop-types";

import FormEditor from "./FormEditor/FormEditor"
import CreateNewIssue from "./FormEditor/CreateNewIssue"

SyntaxHighlighter.registerLanguage("json", json);

// const areEqual = (oldProps, newProps) => {
//   console.log("testing");
//   return (
//     oldProps.record === newProps.record &&
//     oldProps.index === newProps.index &&
//     oldProps.isDarkTheme === newProps.isDarkTheme &&
//     oldProps.CreateNewIssue === newProps.CreateNewIssue &&
//     oldProps.timezoneOffset === newProps.timezoneOffset &&
//     oldProps.modalOpen === newProps.modalOpen &&
//     oldProps.toggleModalOpen === newProps.toggleModalOpen
//   )
// }

const FormEntry = ( props ) => {
  let {
    record,
    index,
    isDarkTheme,
    timezoneOffset,
    modalOpen,
    toggleModalOpen,
    user,
    affiliationLookup,
    setSnackbarData,
    formName,
  } = props
  let slimRecord = record.data;
  // console.log("entry render")
  // console.log(slimRecord)
  let localTime = new Date(
    Date.parse(record.data._submission_time) - timezoneOffset
  );
  const submittedDate = localTime;
  

  // console.log("fe")

  return (
    <Grid item container xs={12} spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">
          {submittedDate.toLocaleString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            // timeZone: "UTC",
            timeZone: "America/New_York",
          })}
        </Typography>
        <SyntaxHighlighter language="json" style={isDarkTheme ? dark : docco}>
          {JSON.stringify(slimRecord, undefined, 2)}
        </SyntaxHighlighter>
      </Grid>
      <Grid container spacing={2} direction="column">
        {record.err ? 
          <Grid item>
            <Typography>{`Error: ${record.err}`}</Typography>
          </Grid> : null
        }
        <Grid container direction="row" spacing={2}>
          <Grid item>
            <CreateNewIssue 
              issueData={record.data} 
              index={index} 
              user={user} 
              affiliationLookup={affiliationLookup} 
              setSnackbarData={setSnackbarData} 
              formName={formName}
            />
          </Grid>
          {record.err ? 
            <Grid item>
              <FormEditor isDarkTheme slimRecord={slimRecord} modalOpen={modalOpen} toggleModalOpen={toggleModalOpen} />
            </Grid> : null
          }
        </Grid>
        
      </Grid>
    </Grid>
  );
};

FormEntry.propTypes = {
  record: PropTypes.object,
  index: PropTypes.number,
  isDarkTheme: PropTypes.bool,
  CreateNewIssue: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  timezoneOffset: PropTypes.number,
  modalOpen: PropTypes.bool,
  toggleModalOpen: PropTypes.function,
  user: PropTypes.any,
  affiliationLookup: PropTypes.object,
  setSnackbarData: PropTypes.function,
  formName: PropTypes.string,
};
export default FormEntry;
