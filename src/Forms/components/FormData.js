import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  Typography,
  Snackbar,
} from "@material-ui/core";
// import axios from "axios";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { useAuth0 } from "../../Auth/react-auth0-spa";
import { ArrowBackIosOutlined } from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";

import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { Context } from "../../Store/Store";
import { fetchKoboPasswords } from "../../utils/constants";
// import IssueDialogue from "../../Comments/IssueDialogue";
// import FormEntry from "./FormEntry";
import PropTypes from "prop-types";

import RenderFormsData from "./FormEditor/RenderFormsData"
import { CustomSwitch } from "../../utils/CustomComponents"

SyntaxHighlighter.registerLanguage("json", json);

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// const areEqual = (prevProps, nextProps) => {
//   if(prevProps.isDarkTheme !== nextProps.isDarkTheme || prevProps.title !== nextProps.title)
//     {
//       console.log("dark");
//       return false
//     }
//   // else if (prevProps.assetId.location.state.name !== nextProps.assetId.location.state.name)
//   //   {
//   //     console.log("props");
//   //     return false
//   //   }
//   else  
//     {
//       console.log("else");
//       return true
//     }
//   // return true
// }

const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

const FormData = (props) => {
  console.log("fd");
  let { isDarkTheme } = props
  const [data, setData] = useState([]);
  const [validData, setValidData] = useState([]);
  const [invalidData, setInvalidData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [state] = useContext(Context);
  const [allowedAccounts, setAllowedAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState("all");
  const { getTokenSilently } = useAuth0();

  const { formId } = useParams();
  const { user } = useAuth0();

  const history = useHistory();

  // const [showNewIssueDialog, setShowNewIssueDialog] = useState(false);

  const [affiliationLookup, setAffiliationLookup] = useState({});

  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: "",
    severity: "success",
  });
  // const [newIssueData, setNewIssueData] = useState({});
  // const [activeIssueIndex, setActiveIssueIndex] = useState(null);

  const [currentlyValid, setCurrentlyValid] = useState(true);

  const [modalOpen, setModalOpen] = useState(false)

  const [formName, setFormName] = useState("")

  useEffect(() => {
    console.log("history change");
    if (history.location.state) {
      if (history.location.state.name) {
        setFormName(history.location.state.name);
      }
    } else {
      setFormName("");
    }
    console.log(formName);
  }, [history.location]);

  const fetchData = async () => {
    console.log("fetch data");
    let assetName = formName.split("_").join(" ")
    console.log(assetName)
    const token = await getTokenSilently({
      audience: `https://precision-sustaibale-ag/tech-dashboard`,
    });

    let body = {
      token: token,
      asset_name: assetName
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      mode: "cors", // no-cors, *cors, same-origin
    };
  
    // let koboResponse;
  
    try {
      return await fetch(
        `http://localhost:7071/api/Kobo`,
        options
      ).then(res => res.json());
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  useEffect(() => {
    console.log("fetching");
    setFetching(true);
    const records = fetchData()
      .then((response) => {
        // console.log(response);
        if (response === null) throw new Error(response.statusText);
        let validRecords = response.valid_data || [];
        let invalidRecords = response.invalid_data || [];

        if (validRecords.length > 0) {
          validRecords = validRecords.sort(
            (a, b) =>
              new Date(b.data._submission_time) - new Date(a.data._submission_time)
          );
        } 
        if (invalidRecords.length > 0) {
          invalidRecords = invalidRecords.sort(
            (a, b) =>
              new Date(b.data._submission_time) - new Date(a.data._submission_time)
          );
        }

        return {
          validRecords: validRecords,
          invalidRecords: invalidRecords
        }
      })
      // .then((validRecords) => {
      //   return validRecords;
      // });

    records.then((recs) => {
      // console.log(recs);
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

            console.log(affiliationLookup);

            setAllowedAccounts(allowedKoboAccounts);
            // console.log(recs, allowedKoboAccounts);

            let validJsonRecs = recs.validRecords.map(rec => {
              // return JSON.parse(rec)
              let json_rec = JSON.parse(rec.data)
              const sorted_json_rec = Object.keys(json_rec).sort().reduce(
                (obj, key) => { 
                  obj[key] = json_rec[key]; 
                  return obj;
                }, 
                {}
              )
              return {
                data: sorted_json_rec,
                err: rec.err
              }
            })

            let invalidJsonRecs = recs.invalidRecords.map(rec => {
              // return JSON.parse(rec)
              let json_rec = JSON.parse(rec.data)
              const sorted_json_rec = Object.keys(json_rec).sort().reduce(
                (obj, key) => { 
                  obj[key] = json_rec[key]; 
                  return obj;
                }, 
                {}
              )
              return {
                data: sorted_json_rec,
                err: rec.err
              }
            })
            
            // console.log(validJsonRecs, invalidJsonRecs);

            const validFilteredRecords = validJsonRecs.filter((rec) =>
              allowedKoboAccounts.includes(rec.data._submitted_by)
            );

            const invalidFilteredRecords = invalidJsonRecs.filter((rec) =>
              allowedKoboAccounts.includes(rec.data._submitted_by)
            );

            // console.log(validFilteredRecords, invalidFilteredRecords);
            setData(validFilteredRecords);
            // setCurrentlyValid(true);
            setInvalidData(invalidFilteredRecords);
            setValidData(validFilteredRecords);
            setOriginalData({validRecords: validFilteredRecords, invalidRecords: invalidFilteredRecords});

            // console.log(validData, invalidData);
          })
          .then(() => setFetching(false));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, state.userInfo.state]);

  useEffect(() => {
    console.log("recalc")
    const recalculate = async () => {
      return new Promise((resolve) => {
        if (originalData) {
          if (currentlyValid){
            // console.log("if")
            if (activeAccount === "all") resolve(originalData.validRecords);
            const filteredActive = originalData.validRecords.filter(
              (data) => data.data._submitted_by === activeAccount
            );
            resolve(filteredActive);
          } else {
            // console.log("else");
            if (activeAccount === "all") resolve(originalData.invalidRecords);
            const filteredActive = originalData.invalidRecords.filter(
              (data) => data.data._submitted_by === activeAccount
            );
            resolve(filteredActive);
          }
        }
      });
    };

    recalculate().then((data) => {
      // console.log("done");
      // console.log(data);
      setData(data);
    });
  }, [activeAccount, originalData, currentlyValid]);

  const toggleData = () => {
    console.log("toggle");
    console.log(currentlyValid);

    if(currentlyValid)
      setData(invalidData)
    else
      setData(validData)

    setCurrentlyValid(!currentlyValid)
  }

  const toggleModalOpen = () => {
    console.log("toggling modal");
    setModalOpen(true)
  }

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
        <Grid item>Valid Forms</Grid>
          <CustomSwitch
            // checked={units === "lbs/ac"}
            onChange={toggleData}
          />
        <Grid item>Invalid Forms</Grid>
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
            // CreateNewIssue={CreateNewIssue}
            timezoneOffset={timezoneOffset}
            modalOpen={modalOpen}
            toggleModalOpen={toggleModalOpen}
            affiliationLookup={affiliationLookup} 
            setSnackbarData={setSnackbarData} 
            formName={formName}
          />
        )}
      </Grid>
    </div>
  );
};

// export default React.memo(FormData);
export default FormData;

FormData.propTypes = {
  isDarkTheme: PropTypes.bool,
  // assetId: PropTypes.object,
};
