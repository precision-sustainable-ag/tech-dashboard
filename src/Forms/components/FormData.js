import React, { useState, useEffect, useContext } from "react";
import { Button, Chip, Grid, Typography, Tooltip, Snackbar } from "@material-ui/core";
import axios from "axios";
import { apiPassword, apiURL, apiUsername } from "../../utils/api_secret";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { useAuth0 } from "../../Auth/react-auth0-spa";
import {
  QuestionAnswer,
} from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";



import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light";
import dark from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark";
import { useParams } from "react-router";
import { ArrowBackIosOutlined } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { Context } from "../../Store/Store";
import { fetchKoboPasswords } from "../../utils/constants";
import IssueDialogue from "../../Comments/IssueDialogue";

SyntaxHighlighter.registerLanguage("json", json);

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
            const allowedKoboAccounts = data.reduce(
              (acc, curr) => [...acc, curr.kobo_account],
              []
            );
            setAffiliationLookup({});
            data.forEach(function (item, index) {
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
  }, [formId, state.userInfo.state]);

  useEffect(() => {
    const recalculate = async () => {
      return await new Promise((resolve, reject) => {
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

    const [snackbarData, setSnackbarData] = useState({ open: false, text: "" });
    const [newIssueData, setNewIssueData] = useState({});
  
    const CreateNewIssue = ({ issueData }) => {
      return (
        <div>
          {showNewIssueDialog ? 
           "" : <Tooltip title="Submit a new issue">
           <Button
             startIcon={<QuestionAnswer />}
             size="small"
             variant="contained"
             // color={props.props.isDarkTheme ? "primary" : "default"}
             onClick={() => {
               setShowNewIssueDialog(true);
               setNewIssueData(issueData);
               ShowNewFormIssue();
             }}
           >
             Comment
           </Button>
         </Tooltip>}
          
          <ShowNewFormIssue/>
        </div>
        
      );
    };

  const ShowNewFormIssue = () => {
    if (showNewIssueDialog) {
      // setShowNewIssueDialog(false)

      // console.log(JSON.stringify(props))
      return(
        <IssueDialogue 
          nickname={user.nickname} 
          rowData={JSON.stringify(newIssueData, null, "\t")} 
          dataType="json" 
          setSnackbarData={setSnackbarData} 
          formName = {props.assetId.history.location.state.name}
          affiliationLookup={affiliationLookup}
          closeDialogue = {setShowNewIssueDialog}
          labels={[newIssueData._id.toString(), affiliationLookup[newIssueData._submitted_by], props.assetId.history.location.state.name, "kobo-forms"]}
        />
      )
    }
    else return"";
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
          let slimRecord = record;
          const submittedDate = new Date(record._submission_time);
          const {
            submittedHours,
            submittedMinutes,
            submittedSeconds,
            am_pm,
          } = parseDate(submittedDate);
  
          return (
            <Grid item container xs={12} spacing={2} key={`record${index}`}>
              <Grid item xs={12} key={`record${index}`}>
                <Typography variant="h6">
                  {submittedDate.toDateString()} at{" "}
                  {`${submittedHours}:${submittedMinutes}:${submittedSeconds} ${am_pm}`}
                </Typography>
                <SyntaxHighlighter
                  language="json"
                  style={props.isDarkTheme ? dark : docco}
                >
                  {JSON.stringify(slimRecord, undefined, 2)}
                </SyntaxHighlighter>
              </Grid>
              <CreateNewIssue issueData={record} /> 
            </Grid>
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
          autoHideDuration={2000}
          onClose={() =>
            setSnackbarData({ ...snackbarData, open: !snackbarData.open })
          }
        >
          <Alert severity="success">{snackbarData.text}</Alert>
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
        <ShowNewFormIssue/>
      </Grid>
    </div>
  );
};


/**
 *
 * @param {Date} submittedDate
 * @returns {{submittedHours: Number, submittedMinutes: String | Number, submittedSeconds: String | Number, am_pm: String}} Formatted Date items
 */

const parseDate = (submittedDate) => {
  const submittedHours =
    submittedDate.getHours() > 12
      ? submittedDate.getHours() - 12
      : submittedDate.getHours();
  const submittedMinutes =
    submittedDate.getMinutes() < 10
      ? "0" + submittedDate.getMinutes()
      : submittedDate.getMinutes();
  var submittedSeconds =
    submittedDate.getSeconds() < 10
      ? "0" + submittedDate.getSeconds()
      : submittedDate.getSeconds();
  const am_pm = submittedDate.getHours() >= 12 ? "PM" : "AM";

  return {
    submittedHours,
    submittedMinutes,
    submittedSeconds,
    am_pm,
  };
};

export default FormData;
