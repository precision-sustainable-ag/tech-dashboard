import React, { Fragment } from 'react';
import { Grid, Typography } from '@material-ui/core';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light';
import dark from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import PropTypes from 'prop-types';

import FormEditor from './FormEditor/FormEditor';
import CreateNewIssue from './CreateNewIssue';

SyntaxHighlighter.registerLanguage('json', json);

const FormEntry = (props) => {
  let { record, index, isDarkTheme, setSnackbarData } = props;
  let slimRecord = record.data;
  const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
  let localTime = new Date(Date.parse(record.data._submission_time) - timezoneOffset);
  const submittedDate = localTime;
  const uid = record.uid;

  return (
    <Grid item container xs={12} spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h6">
          {submittedDate.toLocaleString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZone: 'America/New_York',
          })}
        </Typography>
        <SyntaxHighlighter language="json" style={isDarkTheme ? dark : docco}>
          {JSON.stringify(slimRecord, undefined, 2)}
        </SyntaxHighlighter>
      </Grid>
      <Grid item container spacing={1} direction="column">
        <Grid item container direction="row" spacing={2}>
          <Grid item>
            <CreateNewIssue
              issueData={record.data}
              index={index}
              setSnackbarData={setSnackbarData}
            />
          </Grid>
          {record.errs ? (
            <Fragment>
              <Grid item>
                <FormEditor
                  isDarkTheme={isDarkTheme}
                  slimRecord={slimRecord}
                  error={record.errs}
                  uid={uid}
                />
              </Grid>
            </Fragment>
          ) : null}
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
  setSnackbarData: PropTypes.func,
};
export default FormEntry;
