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
import { Link, useHistory } from "react-router-dom";
import { Context } from "../../Store/Store";
import { fetchKoboPasswords } from "../../utils/constants";
import PropTypes from "prop-types";

import RenderFormsData from "./FormEditor/RenderFormsData";
import { CustomSwitch } from "../../utils/CustomComponents";
import { callAzureFunction } from './../../utils/SharedFunctions';

SyntaxHighlighter.registerLanguage("json", json);

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

const FormData = (props) => {
  let { 
    isDarkTheme 
  } = props;

  const [data, setData] = useState([]);
  const [validData, setValidData] = useState([]);
  const [invalidData, setInvalidData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [state] = useContext(Context);
  const [allowedAccounts, setAllowedAccounts] = useState([]);
  const [activeAccount, setActiveAccount] = useState("all");
  const { getTokenSilently } = useAuth0();

  const { user } = useAuth0();

  const history = useHistory();

  const [affiliationLookup, setAffiliationLookup] = useState({});

  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: "",
    severity: "success",
  });

  const [currentlyValid, setCurrentlyValid] = useState(true);

  const [formName, setFormName] = useState("");

  const getHistory = async () => {
    let name;
    if (history.location.state && history.location.state.name) {
      name = history.location.state.name;
    } else {
      name = "";
    }
    return name;
  };

  const fetchData = async () => {
    let name = await getHistory();
    setFormName(name);

    const token = await getTokenSilently({
      audience: `https://precision-sustaibale-ag/tech-dashboard`,
    });

    let data = {
      token: token,
      asset_name: name.split("_").join(" "),
    };

    return callAzureFunction(data, "Kobo", getTokenSilently).then(res => res.jsonResponse);
  };

  useEffect(() => {
    setFetching(true);
    const records = fetchData()
        .then((response) => {
          if (response === null) throw new Error(response.statusText);
          let validRecords = response.valid_data || [];
          let invalidRecords = response.invalid_data || [];

          if (validRecords.length > 0) {
            validRecords = validRecords.sort(
              (a, b) =>
                new Date(JSON.parse(b.data)._submission_time) - new Date(JSON.parse(a.data)._submission_time)
            );
          } 
          if (invalidRecords.length > 0) {
            invalidRecords = invalidRecords.sort(
              (a, b) =>
                new Date(JSON.parse(b.data)._submission_time) - new Date(JSON.parse(a.data)._submission_time)
            );
          }

          return {
            validRecords: validRecords,
            invalidRecords: invalidRecords
          };
        }
      );

    records.then((recs) => {
      fetchKoboPasswords({
        showAllStates: "true",
        state: state.userInfo && state.userInfo.state ? state.userInfo.state : "all",
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

          const sortAndParse = (objs) => {
            return objs.map(rec => {
              let json_rec = JSON.parse(rec.data);
              const sorted_json_rec = Object.keys(json_rec).sort().reduce(
                (obj, key) => { 
                  obj[key] = json_rec[key]; 
                  return obj;
                }, 
                {}
              );
              return {
                data: sorted_json_rec,
                err: rec.err
              };
            });
          };

          let validJsonRecs = sortAndParse(recs.validRecords);
          let invalidJsonRecs = sortAndParse(recs.invalidRecords);
          
          const validFilteredRecords = validJsonRecs.filter((rec) =>
            allowedKoboAccounts.includes(rec.data._submitted_by)
          );

          const invalidFilteredRecords = invalidJsonRecs.filter((rec) =>
            allowedKoboAccounts.includes(rec.data._submitted_by)
          );

          setData(validFilteredRecords);
          setInvalidData(invalidFilteredRecords);
          setValidData(validFilteredRecords);
          setOriginalData({validRecords: validFilteredRecords, invalidRecords: invalidFilteredRecords});
        })
        .then(() => setFetching(false));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setData(invalidData);
    else
      setData(validData);

    setCurrentlyValid(!currentlyValid);
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
        {state.loadingUser && fetching ? (
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
