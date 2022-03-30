import React, { useState, useEffect, useContext } from 'react';
import { Button, Chip, Grid, Typography, Snackbar, Box, Tab } from '@material-ui/core';
import { TabList, TabContext } from '@material-ui/lab';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useAuth0 } from '../../Auth/react-auth0-spa';
import { ArrowBackIosOutlined } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';

import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import { Link, useHistory } from 'react-router-dom';
import { Context } from '../../Store/Store';
import { fetchKoboPasswords } from '../../utils/constants';
import PropTypes from 'prop-types';

import RenderFormsData from './RenderFormsData';
import { callAzureFunction } from './../../utils/SharedFunctions';

SyntaxHighlighter.registerLanguage('json', json);

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const FormData = (props) => {
  let { isDarkTheme } = props;

  const history = useHistory();

  const [fetching, setFetching] = useState(false);
  const [state, dispatch] = useContext(Context);
  const [allowedAccounts, setAllowedAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState('all');
  const { getTokenSilently } = useAuth0();
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: '',
    severity: 'success',
  });
  const [value, setValue] = React.useState('1');

  const getHistory = async () => {
    let name;
    if (history.location.state && history.location.state.name) {
      name = history.location.state.name;
    } else {
      name = '';
    }
    dispatch({
      type: 'UPDATE_FORM_NAME',
      data: {
        formName: name,
      },
    });
  };

  const fetchData = async () => {
    await getHistory();
    const token = await getTokenSilently({
      audience: `https://precision-sustaibale-ag/tech-dashboard`,
    });

    let data = {
      token: token,
      xform_id_string: window.location.pathname.split('/')[2],
    };

    return callAzureFunction(data, 'Kobo', getTokenSilently).then((res) => res.jsonResponse);
  };

  useEffect(() => {
    setFetching(true);
    if (Object.keys(state.userInfo).length !== 0) {
      const records = fetchData().then((response) => {
        if (response === null) throw new Error(response.statusText);
        let validRecords = response.valid_data || [];
        let invalidRecords = response.invalid_data || [];
        let historyRecords = response.uid_history || [];

        if (validRecords.length > 0) {
          validRecords = validRecords.sort(
            (a, b) =>
              new Date(JSON.parse(b.data)._submission_time) -
              new Date(JSON.parse(a.data)._submission_time),
          );
        }
        if (invalidRecords.length > 0) {
          invalidRecords = invalidRecords.sort(
            (a, b) =>
              new Date(JSON.parse(b.data)._submission_time) -
              new Date(JSON.parse(a.data)._submission_time),
          );
        }
        if (historyRecords.length > 0) {
          historyRecords = historyRecords.sort(
            (a, b) =>
              new Date(JSON.parse(b.data)._submission_time) -
              new Date(JSON.parse(a.data)._submission_time),
          );
        }

        return {
          validRecords: validRecords,
          invalidRecords: invalidRecords,
          historyRecords: historyRecords,
        };
      });
      records.then((recs) => {
        fetchKoboPasswords({
          showAllStates: 'true',
          state: state.userInfo?.state,
        })
          .then(({ data }) => {
            const allowedKoboAccounts = data
              .reduce(
                (acc, curr) =>
                  !acc.includes(curr.kobo_account) ? [...acc, curr.kobo_account] : acc,
                [],
              )
              .sort();
            let affiliationLookup = {};
            data.forEach(function (item) {
              const kobo_account = item.kobo_account;
              const affiliation = item.state;

              let newLookup = affiliationLookup;
              newLookup[kobo_account] = affiliation;
            });

            dispatch({
              type: 'SET_AFFILIATION_LOOKUP',
              data: {
                affiliationLookup: affiliationLookup,
              },
            });

            setAllowedAccounts(allowedKoboAccounts);

            const sortAndParse = (objs) => {
              return objs.map((rec) => {
                let json_rec = JSON.parse(rec.data);
                const sorted_json_rec = Object.keys(json_rec)
                  .sort()
                  .reduce((obj, key) => {
                    obj[key] = json_rec[key];
                    return obj;
                  }, {});
                return {
                  data: sorted_json_rec,
                  errs: rec.errs,
                  uid: rec.uid,
                };
              });
            };

            let validJsonRecs = sortAndParse(recs.validRecords);
            let invalidJsonRecs = sortAndParse(recs.invalidRecords);
            let recordHistoryJsonRecs = sortAndParse(recs.historyRecords);

            const validFilteredRecords = validJsonRecs.filter((rec) =>
              allowedKoboAccounts.includes(rec.data._submitted_by),
            );

            const invalidFilteredRecords = invalidJsonRecs.filter((rec) =>
              allowedKoboAccounts.includes(rec.data._submitted_by),
            );

            const historyFilteredRecords = recordHistoryJsonRecs.filter((rec) =>
              allowedKoboAccounts.includes(rec.data._submitted_by),
            );

            dispatch({
              type: 'SET_FORMS_DATA',
              data: {
                formType: 'valid',
                validFilteredRecords: validFilteredRecords || [],
                invalidFilteredRecords: invalidFilteredRecords || [],
                historyFilteredRecords: historyFilteredRecords || [],
              },
            });
          })
          .then(() => setFetching(false));
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [state.userInfo]);

  useEffect(() => {
    const recalculate = async () => {
      return new Promise((resolve) => {
        if (state.formsData.originalData) {
          if (state.formsData.type === 'valid') {
            if (activeAccount === 'all') resolve(state.formsData.originalData.validRecords);
            const filteredActive = state.formsData.originalData.validRecords.filter(
              (data) => data.data._submitted_by === activeAccount,
            );
            resolve(filteredActive || []);
          } else if (state.formsData.type === 'invalid') {
            if (activeAccount === 'all') resolve(state.formsData.originalData.invalidRecords);
            const filteredActive = state.formsData.originalData.invalidRecords.filter(
              (data) => data.data._submitted_by === activeAccount,
            );
            resolve(filteredActive || []);
          } else {
            if (activeAccount === 'all') resolve(state.formsData.originalData.historyRecords);
            const filteredActive = state.formsData.originalData.historyRecords.filter(
              (data) => data.data._submitted_by === activeAccount,
            );
            resolve(filteredActive || []);
          }
        }
      });
    };

    recalculate().then((data) => {
      dispatch({
        type: 'UPDATE_FORMS_DATA',
        data: {
          formType: state.formsData.type,
          formsData: data,
        },
      });
    });
  }, [activeAccount, state.formsData.originalData, state.formsData.type]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case '1':
        dispatch({
          type: 'UPDATE_FORMS_DATA',
          data: {
            formsData: state.formsData.validData,
            formType: 'valid',
          },
        });
        break;
      case '2':
        dispatch({
          type: 'UPDATE_FORMS_DATA',
          data: {
            formsData: state.formsData.invalidData,
            formType: 'invalid',
          },
        });
        break;
      case '3':
        dispatch({
          type: 'UPDATE_FORMS_DATA',
          data: {
            formsData: state.formsData.historyData,
            formType: 'history',
          },
        });
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackbarData.open}
        autoHideDuration={10000}
        onClose={() => setSnackbarData({ ...snackbarData, open: !snackbarData.open })}
      >
        <Alert severity={snackbarData.severity}>{snackbarData.text}</Alert>
      </Snackbar>
      <Grid container spacing={2}>
        <Grid item>
          <Button
            variant="contained"
            color={isDarkTheme ? 'primary' : 'default'}
            aria-label={`All Forms`}
            component={Link}
            tooltip="All Forms"
            to={'/kobo-forms'}
            startIcon={<ArrowBackIosOutlined />}
          >
            All Forms
          </Button>
        </Grid>
        <Grid container item spacing={1}>
          {allowedAccounts.length > 0 && allowedAccounts.length === 1 ? (
            <Grid item>
              <Chip label={allowedAccounts[0]} color={'primary'} />
            </Grid>
          ) : (
            <>
              <Grid item>
                <Chip
                  label={'All'}
                  color={activeAccount === 'all' ? 'primary' : 'default'}
                  onClick={() => setActiveAccount('all')}
                />
              </Grid>
              {allowedAccounts.map((account, index) => (
                <Grid item key={`koboAccount${index}`}>
                  <Chip
                    label={account}
                    color={activeAccount === account ? 'primary' : 'default'}
                    onClick={() => setActiveAccount(account)}
                  />
                </Grid>
              ))}
            </>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography variant="h5">Form name: {state.formsData.name}</Typography>
        </Grid>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Valid Forms" value="1" />
                <Tab label="Please Fix" value="2" />
                <Tab label="Submission History" value="3" />
              </TabList>
            </Box>
          </TabContext>
        </Box>
        {state.loadingUser && fetching ? (
          <Grid item xs={12}>
            <Typography variant="h5">Fetching Data...</Typography>
          </Grid>
        ) : (
          <RenderFormsData
            fetching={fetching}
            isDarkTheme={isDarkTheme}
            allowedAccounts={allowedAccounts}
            setSnackbarData={setSnackbarData}
          />
        )}
      </Grid>
    </div>
  );
};

export default FormData;

FormData.propTypes = {
  isDarkTheme: PropTypes.bool,
};
