import React, { useState, useEffect } from "react";
import { MenuItem, Typography, Button } from "@material-ui/core";
import { CheckCircleRounded } from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import ErrorIcon from "@material-ui/icons/Error";
import axios from "axios";
import { apiCorsUrl, APIURL } from "../Devices/hologramConstants";
import QueryString from "qs";
import { apiPassword, apiUsername, onfarmAPI } from "../utils/api_secret";
const hologramAPI = "/api/1/users/me";

const ApiStatus = () => {
  const [devAPI, setDevAPI] = useState(null);
  const [gitHubAPI, setGitHubAPI] = useState(null);
  useEffect(() => {
    fetchfromInternal();
    fetchFromAPIHologram();
    fetchFromPHPAPI();
    fetchFromAPIWeather(onfarmAPI);
    fetchFromAPIGitHub(
      `https://api.github.com/repos/precision-sustainable-ag/data_corrections/`
    );
  }, []);

  const [internalAPI, setInternalAPI] = useState(null);
  const [HologramAPI, setHologramAPI] = useState(null);
  const [phpAPI, setPHPAPI] = useState(null);

  const fetchfromInternal = () => {
    fetch(onfarmAPI + `/raw?table=biomass_in_field&affiliation=MD`).then(
      (r) => {
        if (r.headers.get("content-type").split(";")[0] === "text/html") {
          setInternalAPI(true);
        } else {
          setInternalAPI(false);
        }
      }
    );
  };

  const fetchFromAPIHologram = () => {
    axios({
      method: "post",
      url: apiCorsUrl + `/watersensors`,
      data: QueryString.stringify({
        url: `${APIURL()}${hologramAPI}`,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
      responseType: "json",
    }).then((response) => {
      if (Object.keys(response.data.data).length > 0) {
        setHologramAPI(true);
      } else {
        setHologramAPI(false);
      }
    });
  };

  const fetchFromPHPAPI = () => {
    axios({
      method: "post",
      url: apiCorsUrl + `/watersensors`,
      data: QueryString.stringify({
        url: `${APIURL()}${hologramAPI}`,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
      responseType: "json",
    }).then((response) => {
      if (response.status === 200) {
        setPHPAPI(true);
      } else {
        setPHPAPI(false);
      }
    });
  };

  const fetchFromAPIWeather = async (url) => {
    await fetch(url, {
      mode: `no-cors`,
    })
      .then((result) => setDevAPI(result))
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchFromAPIGitHub = async (url) => {
    await fetch(url, {
      mode: `no-cors`,
    })
      .then((result) => setGitHubAPI(result))
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <MenuItem>
        <Button
          href="#text-buttons"
          onClick={fetchFromPHPAPI}
          label="Button"
          labelStyle={{ fontSize: "63px" }}
        >
          {phpAPI === null ? (
            <CircularProgress color="primary" />
          ) : phpAPI ? (
            <CheckCircleRounded color="primary" />
          ) : (
            <ErrorIcon color="primary" />
          )}
          <Typography>On farm API</Typography>
        </Button>
      </MenuItem>

      <MenuItem>
        <Button onClick={fetchFromAPIHologram}>
          {HologramAPI === null ? (
            <CircularProgress color="primary" />
          ) : HologramAPI ? (
            <CheckCircleRounded color="primary" />
          ) : (
            <ErrorIcon color="primary" />
          )}
          <Typography>Hologram</Typography>
        </Button>
      </MenuItem>

      <MenuItem>
        <Button
          onClick={() => {
            fetchFromAPIWeather(onfarmAPI);
          }}
        >
          {devAPI ? (
            <CheckCircleRounded color="primary" />
          ) : (
            <ErrorIcon color="primary" />
          )}
          <Typography>Dev API</Typography>
        </Button>
      </MenuItem>

      <MenuItem>
        <Button
          onClick={() => {
            fetchfromInternal();
          }}
        >
          {internalAPI === null ? (
            <CircularProgress color="primary" />
          ) : internalAPI ? (
            <CheckCircleRounded color="primary" />
          ) : (
            <ErrorIcon color="primary" />
          )}
          <Typography>Internal API</Typography>
        </Button>
      </MenuItem>

      <MenuItem>
        <Button
          onClick={() => {
            fetchFromAPIGitHub(
              `https://api.github.com/repos/precision-sustainable-ag/data_corrections/`
            );
          }}
        >
          {gitHubAPI ? (
            <CheckCircleRounded color="primary" />
          ) : (
            <ErrorIcon color="primary" />
          )}
          <Typography>Git Hub</Typography>
        </Button>
      </MenuItem>
    </>
  );
};
export default ApiStatus;
