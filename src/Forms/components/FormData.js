import React, { useState, useEffect, useMemo, useContext } from "react";
import { Button, Chip, Grid, Typography, Tooltip, Snackbar } from "@material-ui/core";
import axios from "axios";
import { apiPassword, apiURL, apiUsername } from "../../utils/api_secret";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { useAuth0 } from "../../Auth/react-auth0-spa";
import {
  Edit,
  DeleteForever,
  Search,
  QuestionAnswer,
} from "@material-ui/icons";


import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light";
import dark from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark";
import { useParams } from "react-router";
import { ArrowBackIosOutlined } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { Context } from "../../Store/Store";
import { fetchKoboPasswords } from "../../utils/constants";
import NewFormComment from "./NewFormComment"
import NewFormIssue from "./NewFormIssue"

SyntaxHighlighter.registerLanguage("json", json);

const FormData = ({ isDarkTheme = false }) => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [fetching, setFetching] = useState(false);
  // const [JSONData, setJSONData] = useState({});
  const [state] = useContext(Context);
  const [allowedAccounts, setAllowedAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState("all");

  const [newComment, setNewComment] = useState("");
  const [showUsersDialog, setShowUsersDialog] = useState(false);
  const [searchUser, setSearchUser] = useState("");

  const { formId } = useParams();
  const { user } = useAuth0();

  const [showNewIssueDialog, setShowNewIssueDialog] = useState(false);
  

  useEffect(() => {
    const fetchData = async (assetId, userType = "psa") => {
      return await axios.get(`${apiURL}/api/kobo/${userType}/data/${assetId}`, {
        auth: {
          username: apiUsername,
          password: apiPassword,
        },
      });
    };

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

  // useEffect(() => {
  //   const parseJSON = (data) => {
  //     setJSONData(JSON.stringify(data, undefined, 2));
  //   };
  //   if (Object.keys(data).length > 0) {
  //     parseJSON(data);
  //   }
  // }, [data]);

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
        <Tooltip title="Submit a new issue">
          <Button
            startIcon={<QuestionAnswer />}
            size="small"
            variant="contained"
            // color={props.isDarkTheme ? "primary" : "default"}
            onClick={() => {
              setShowNewIssueDialog(true);
              setNewIssueData(issueData);
              ShowNewFormIssue();
            }}
          >
            Comment
          </Button>
        </Tooltip>
      );
    };

  const ShowNewFormIssue = () => {
    if (showNewIssueDialog) {
      // setShowNewIssueDialog(false)
      return(
        <NewFormIssue
          open={showNewIssueDialog}
          handleNewIssueDialogClose={() => {
            setShowNewIssueDialog(!showNewIssueDialog);
          }}
          data={newIssueData}
          setSnackbarData={setSnackbarData}
          snackbarData={snackbarData}
          nickname={user.nickname}
        />
      )
    }
    else return("")
    // return showNewIssueDialog ? 
    //   <NewFormIssue
    //     open={showNewIssueDialog}
    //     handleNewIssueDialogClose={() => {
    //       setShowNewIssueDialog(!showNewIssueDialog);
    //     }}
    //     data={newIssueData}
    //     setSnackbarData={setSnackbarData}
    //     snackbarData={snackbarData}
    //     nickname={user.nickname}
    //   /> 
    //   : "";
  }

  const RenderFormsData = ({
    fetching,
    originalData,
    data,
    isDarkTheme,
    allowedAccounts,
    user,
  }) => {
    
  
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
          // const metaKeys = [
          //   "_id",
          //   "_bamboo_dataset_id",
          //   "_xform_id_string",
          //   "form_version",
          //   "_tags",
          //   "_submitted_by",
          //   "_status",
          //   "_submission_time",
          //   "meta/instanceID",
          //   "__version__",
          //   "_validation_status",
          //   "_uuid",
          //   "formhub/uuid",
          //   "start",
          //   "end",
          // ];
          // let slimRecord = Object.keys(record)
          //   .filter((key) => !metaKeys.includes(key))
          //   .reduce((obj, key) => {
          //     obj[key] = record[key];
          //     return obj;
          //   }, {});
          let slimRecord = record;
          const submittedDate = new Date(record._submission_time);
          const {
            submittedHours,
            submittedMinutes,
            submittedSeconds,
            am_pm,
          } = parseDate(submittedDate);
  
          return (
            <>
              <Grid item xs={12} key={`record${index}`}>
                <Typography variant="h6">
                  {submittedDate.toDateString()} at{" "}
                  {`${submittedHours}:${submittedMinutes}:${submittedSeconds} ${am_pm}`}
                </Typography>
                <SyntaxHighlighter
                  language="json"
                  style={isDarkTheme ? dark : docco}
                >
                  {JSON.stringify(slimRecord, undefined, 2)}
                </SyntaxHighlighter>
              </Grid>
  
  
              <CreateNewIssue issueData={record} />
              
              
              {/* <NewFormComment record={record}/> */}
            </>
          );
        })}
      </>
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Button
          variant="contained"
          color={isDarkTheme ? "primary" : "default"}
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
            {allowedAccounts.map((account) => (
              <Grid item>
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
          isDarkTheme={isDarkTheme}
          allowedAccounts={allowedAccounts}
          user={user}
        />
      )}
      <ShowNewFormIssue/>
    </Grid>
    
    
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
