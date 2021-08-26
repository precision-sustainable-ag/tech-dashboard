import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  Typography,
  Snackbar,
} from "@material-ui/core";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { useAuth0 } from "../../Auth/react-auth0-spa";
import { ArrowBackIosOutlined } from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";

import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { Context } from "../../Store/Store";
import { fetchKoboPasswords } from "../../utils/constants";
import PropTypes from "prop-types";

import RenderFormsData from "./FormEditor/RenderFormsData"
import { CustomSwitch } from "../../utils/CustomComponents"

SyntaxHighlighter.registerLanguage("json", json);

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

const FormData = (props) => {
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

  const [affiliationLookup, setAffiliationLookup] = useState({});

  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: "",
    severity: "success",
  });

  const [currentlyValid, setCurrentlyValid] = useState(true);

  const [formName, setFormName] = useState("")

  // useEffect(() => {
  //   console.log(history);
  //   if (history.location.state && history.location.state.name) {
  //     console.log("set")
  //     setFormName(history.location.state.name);
  //   } else {
  //     console.log("cant set")
  //     setFormName("");
  //   }
  //   console.log(formName)
  // }, [history.location]);

  const getHistory = async () => {
    console.log(history);
    if (history.location.state && history.location.state.name) {
      console.log("set")
      console.log(history.location.state.name)
      setFormName(history.location.state.name);
    } else {
      console.log("cant set")
      setFormName("");
    }
    console.log(formName);
  }

  const fetchData = async () => {
    console.log(formName);
    let assetName = formName.split("_").join(" ")
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
    const records = getHistory().then(() => {
      return fetchData()
        .then((response) => {
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
        }
      )
    })

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
            
            const validFilteredRecords = validJsonRecs.filter((rec) =>
              allowedKoboAccounts.includes(rec.data._submitted_by)
            );

            const invalidFilteredRecords = invalidJsonRecs.filter((rec) =>
              allowedKoboAccounts.includes(rec.data._submitted_by)
            );

            setData(validFilteredRecords);
            // setCurrentlyValid(true);
            setInvalidData(invalidFilteredRecords);
            setValidData(validFilteredRecords);
            setOriginalData({validRecords: validFilteredRecords, invalidRecords: invalidFilteredRecords});
          })
          .then(() => setFetching(false));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, state.userInfo.state]);

  useEffect(() => {
    const recalculate = async () => {
      return new Promise((resolve) => {
        if (originalData) {
          if (currentlyValid){
            if (activeAccount === "all") resolve(originalData.validRecords);
            const filteredActive = originalData.validRecords.filter(
              (data) => data.data._submitted_by === activeAccount
            );
            resolve(filteredActive);
          } else {
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
      setData(data);
    });
  }, [activeAccount, originalData, currentlyValid]);

  const toggleData = () => {
    if(currentlyValid)
      setData(invalidData)
    else
      setData(validData)

    setCurrentlyValid(!currentlyValid)
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
            affiliationLookup={affiliationLookup} 
            setSnackbarData={setSnackbarData} 
            formName={formName}
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
