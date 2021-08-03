import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  Typography,
  Tooltip,
  Snackbar,
} from "@material-ui/core";
import axios from "axios";
import { apiPassword, apiURL, apiUsername } from "../../utils/api_secret";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { useAuth0 } from "../../Auth/react-auth0-spa";
import { QuestionAnswer, ArrowBackIosOutlined } from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";

import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Context } from "../../Store/Store";
import { fetchKoboPasswords } from "../../utils/constants";
import IssueDialogue from "../../Comments/IssueDialogue";
import FormEntry from "./FormEntry";
import PropTypes from "prop-types";

SyntaxHighlighter.registerLanguage("json", json);

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

const FormData = (props) => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [state] = useContext(Context);
  const [allowedAccounts, setAllowedAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState("all");

  const { formId } = useParams();
  const { user } = useAuth0();

  const [showNewIssueDialog, setShowNewIssueDialog] = useState(false);

  const [affiliationLookup, setAffiliationLookup] = useState({});

  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: "",
    severity: "success",
  });
  const [newIssueData, setNewIssueData] = useState({});
  const [activeIssueIndex, setActiveIssueIndex] = useState(null);

  const fetchData = async (assetId, userType = "psa") => {
    return await axios.get(`${apiURL}/api/kobo/${userType}/data/${assetId}`, {
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
    });
  };

  useEffect(() => {
    setFetching(true);
    const records = fetchData(formId, "psa")
      .then((response) => {
        if (response.status !== 200) throw new Error(response.statusText);
        let records = response.data.data.results || [];
        if (records.length > 0) {
          records = records.sort(
            (a, b) =>
              new Date(b._submission_time) - new Date(a._submission_time)
          );
          return records;
        } else {
          return [];
        }
      })
      .then((records) => {
        return records;
      });

    records.then((recs) => {
      if (state.userInfo.state) {
        fetchKoboPasswords({
          showAllStates: "true",
          state: state.userInfo.state,
        })
          .then(({ data }) => {
            const allowedKoboAccounts = data
              .reduce(
                (acc, curr) =>
                  !acc.includes(curr.kobo_account)
                    ? [...acc, curr.kobo_account]
                    : acc,
                []
              )
              .sort();
            setAffiliationLookup({});
            data.forEach(function (item) {
              const kobo_account = item.kobo_account;
              const affiliation = item.state;

              let newLookup = affiliationLookup;
              newLookup[kobo_account] = affiliation;
              setAffiliationLookup(newLookup);
            });

            setAllowedAccounts(allowedKoboAccounts);
            const filteredRecords = recs.filter((rec) =>
              allowedKoboAccounts.includes(rec._submitted_by)
            );
            setData(filteredRecords);
            setOriginalData(filteredRecords);
          })
          .then(() => setFetching(false));
      }
    });
  }, [formId, state.userInfo.state, affiliationLookup]);

  useEffect(() => {
    const recalculate = async () => {
      return await new Promise((resolve) => {
        if (originalData.length > 0) {
          if (activeAccount === "all") resolve(originalData);
          else {
            const filteredActive = originalData.filter(
              (data) => data._submitted_by === activeAccount
            );
            resolve(filteredActive);
          }
        }
      });
    };

    recalculate().then((data) => {
      setData(data);
    });
  }, [activeAccount, originalData]);

  const CreateNewIssue = ({ issueData, index }) => {
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
              // color={props.props.isDarkTheme ? "primary" : "default"}
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
            formName={props.assetId.history.location.state.name}
            affiliationLookup={affiliationLookup}
            closeDialogue={setShowNewIssueDialog}
            labels={[
              newIssueData._id.toString(),
              affiliationLookup[newIssueData._submitted_by],
              props.assetId.history.location.state.name,
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
  };

  const RenderFormsData = () => {
    return fetching ? (
      <Grid item xs={12}>
        <Typography variant="h5">Fetching Data...</Typography>
      </Grid>
    ) : data.length === 0 && originalData.length === 0 ? (
      <Grid item xs={12}>
        <Typography variant="h5">
          {" "}
          {allowedAccounts.length !== 0
            ? `No submissions on this form via account${
                allowedAccounts.length > 1 ? `s` : ""
              } ${allowedAccounts.join(", ")}`
            : "No Data"}
        </Typography>
      </Grid>
    ) : (
      <>
        <Grid item xs={12}>
          <Typography variant="body1">{data.length} submissions</Typography>
        </Grid>
        {data.map((record = {}, index) => {
          return (
            <FormEntry
              record={record}
              index={index}
              key={`record${index}`}
              isDarkTheme={props.isDarkTheme}
              CreateNewIssue={CreateNewIssue}
              timezoneOffset={timezoneOffset}
            />
          );
        })}
      </>
    );
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={snackbarData.open}
        autoHideDuration={10000}
        onClose={() =>
          setSnackbarData({ ...snackbarData, open: !snackbarData.open })
        }
      >
        <Alert severity={snackbarData.severity}>{snackbarData.text}</Alert>
      </Snackbar>
      <Grid container spacing={2}>
        <Grid item>
          <Button
            variant="contained"
            color={props.isDarkTheme ? "primary" : "default"}
            aria-label={`All Forms`}
            component={Link}
            tooltip="All Forms"
            to={"/kobo-forms"}
            startIcon={<ArrowBackIosOutlined />}
          >
            All Forms
          </Button>
        </Grid>
        <Grid container item spacing={1}>
          {allowedAccounts.length > 0 && allowedAccounts.length === 1 ? (
            <Grid item>
              <Chip label={allowedAccounts[0]} color={"primary"} />
            </Grid>
          ) : (
            <>
              <Grid item>
                <Chip
                  label={"All"}
                  color={activeAccount === "all" ? "primary" : "default"}
                  onClick={() => setActiveAccount("all")}
                />
              </Grid>
              {allowedAccounts.map((account, index) => (
                <Grid item key={`koboAccount${index}`}>
                  <Chip
                    label={account}
                    color={activeAccount === account ? "primary" : "default"}
                    onClick={() => setActiveAccount(account)}
                  />
                </Grid>
              ))}
            </>
          )}
        </Grid>
        {state.loadingUser ? (
          <Grid item xs={12}>
            <Typography variant="h5">Fetching Data...</Typography>
          </Grid>
        ) : (
          <RenderFormsData
            fetching={fetching}
            data={data}
            originalData={originalData}
            isDarkTheme={props.isDarkTheme}
            allowedAccounts={allowedAccounts}
            user={user}
          />
        )}
      </Grid>
    </div>
  );
};

export default FormData;

FormData.propTypes = {
  isDarkTheme: PropTypes.bool,
  assetId: PropTypes.object,
};
