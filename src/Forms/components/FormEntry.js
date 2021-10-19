import React from "react";
import { Grid, Typography } from "@material-ui/core";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light";
import dark from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import PropTypes from "prop-types";

import FormEditor from "./FormEditor/FormEditor";
import CreateNewIssue from "./CreateNewIssue";

SyntaxHighlighter.registerLanguage("json", json);

const FormEntry = ( props ) => {
  let {
    record,
    index,
    isDarkTheme,
    timezoneOffset,
    user,
    affiliationLookup,
    setSnackbarData,
    formName,
    formType,
  } = props;
  let slimRecord = record.data;
  let localTime = new Date(
    Date.parse(record.data._submission_time) - timezoneOffset
  );
  const submittedDate = localTime;
  const uid = record.uid;
  
  return (
    <Grid item container xs={12} spacing={1}>
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
      <Grid item container spacing={2} direction="column">
        {record.errs ? 
          <Grid item>
            <Typography>{`Error: ${JSON.stringify(record.errs)}`}</Typography>
          </Grid> : null
        }
        <Grid item container direction="row" spacing={2}>
          <Grid item>
            <CreateNewIssue 
              issueData={record.data} 
              index={index} 
              user={user} 
              affiliationLookup={affiliationLookup} 
              setSnackbarData={setSnackbarData} 
              formName={formName}
              formType={formType}
            />
          </Grid>
          {record.errs ? 
            <Grid item>
              <FormEditor 
                isDarkTheme={isDarkTheme} 
                slimRecord={slimRecord} 
                error={record.errs} 
                formName={formName} 
                uid={uid}
              />
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
  user: PropTypes.any,
  affiliationLookup: PropTypes.object,
  setSnackbarData: PropTypes.func,
  formName: PropTypes.string,
  formType: PropTypes.string,
};
export default FormEntry;
