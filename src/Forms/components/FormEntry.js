import React, { Fragment, useState } from 'react';
import { Grid, Typography, Button, Dialog, DialogContent } from '@material-ui/core';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light';
import dark from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import PropTypes from 'prop-types';
import { Error } from '@material-ui/icons/';
import { useAuth0 } from '../../Auth/react-auth0-spa';
import { Delete } from '@material-ui/icons';

import FormEditor from './FormEditor/FormEditor';
import CreateNewIssue from './CreateNewIssue';
import { callAzureFunction } from '../../utils/SharedFunctions';

SyntaxHighlighter.registerLanguage('json', json);

const FormEntry = (props) => {
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
  let localTime = new Date(Date.parse(record.data._submission_time) - timezoneOffset);
  const submittedDate = localTime;
  const uid = record.uid;
  const [modalOpen, setModalOpen] = useState(false);
  const [removeText, setRemoveText] = useState('This form cannot be fixed');
  const { getTokenSilently } = useAuth0();

  const toggleModalOpen = () => {
    console.log('toggling modal');
    setModalOpen(!modalOpen);
  };

  const handleResolve = () => {
    setRemoveText('Removing form...');
    let data = {
      uid: uid,
    };
    callAzureFunction(data, 'RemoveForm', getTokenSilently).then((res) => {
      toggleModalOpen();
      setRemoveText('This form cannot be fixed');

      if (res.response) {
        if (res.response.status === 201) {
          setSnackbarData({
            open: true,
            text: `Successfully removed form, check back in 5 minutes`,
            severity: 'success',
          });
        } else {
          console.log('Function could not remove form');
          setSnackbarData({
            open: true,
            text: `Could not remove form (error code 0)`,
            severity: 'error',
          });
        }
      } else {
        console.log('No response from function, likely cors');
        setSnackbarData({
          open: true,
          text: `Could not remove form (error code 1)`,
          severity: 'error',
        });
      }
    });
  };

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
            // timeZone: "UTC",
            timeZone: 'America/New_York',
          })}
        </Typography>
        <SyntaxHighlighter language="json" style={isDarkTheme ? dark : docco}>
          {JSON.stringify(slimRecord, undefined, 2)}
        </SyntaxHighlighter>
      </Grid>
      <Grid item container spacing={1} direction="column">
        {record.errs ? (
          <Fragment>
            <Grid item container spacing={1}>
              <Grid item>
                <Error color="error" />
              </Grid>
              <Grid item>
                <Typography>See errors below</Typography>
              </Grid>
            </Grid>
            <Grid item>
              {JSON.parse(record.errs[0]).map((err, index) => {
                return <Typography key={index}>{`Error ${index}: ${err}`}</Typography>;
              })}
            </Grid>
          </Fragment>
        ) : null}
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
          {record.errs ? (
            <Fragment>
              <Grid item>
                <FormEditor
                  isDarkTheme={isDarkTheme}
                  slimRecord={slimRecord}
                  error={record.errs}
                  formName={formName}
                  uid={uid}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color={isDarkTheme ? 'primary' : 'default'}
                  aria-label={`All Forms`}
                  tooltip="All Forms"
                  size="small"
                  startIcon={<Delete />}
                  onClick={toggleModalOpen}
                >
                  {removeText}
                </Button>
              </Grid>
            </Fragment>
          ) : null}
        </Grid>
        {modalOpen && (
          <Dialog
            open={modalOpen}
            aria-labelledby="form-dialog-title"
            // fullWidth={true}
            maxWidth="xl"
          >
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item>
                  <Typography variant="h6">
                    Are you sure you want to delete this form entry?
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color={isDarkTheme ? 'primary' : 'default'}
                    aria-label={`All Forms`}
                    tooltip="All Forms"
                    size="small"
                    onClick={handleResolve}
                  >
                    Yes
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color={isDarkTheme ? 'primary' : 'default'}
                    aria-label={`All Forms`}
                    tooltip="All Forms"
                    size="small"
                    onClick={toggleModalOpen}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        )}
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
