import React from "react";
import { Grid, Typography } from "@material-ui/core";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light";
import dark from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import PropTypes from "prop-types";

import FormEditor from "./FormEditor/FormEditor"

SyntaxHighlighter.registerLanguage("json", json);

const FormEntry = ({
  record,
  index,
  isDarkTheme,
  CreateNewIssue,
  timezoneOffset,
}) => {
  let slimRecord = record.data;
  let localTime = new Date(
    Date.parse(record.data._submission_time) - timezoneOffset
  );
  const submittedDate = localTime;

  // console.log(index)

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
            <CreateNewIssue issueData={record.data} index={index} />
          </Grid>
          {record.err ? 
            <Grid item>
              <FormEditor isDarkTheme slimRecord={slimRecord} />
            </Grid> : null
          }
        </Grid>
        
      </Grid>
    </Grid>
  );
};

export default FormEntry;

FormEntry.propTypes = {
  record: PropTypes.object,
  index: PropTypes.number,
  isDarkTheme: PropTypes.bool,
  CreateNewIssue: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  timezoneOffset: PropTypes.number,
};
