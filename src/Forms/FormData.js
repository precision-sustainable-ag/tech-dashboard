import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import axios from "axios";
import { apiPassword, apiURL, apiUsername } from "../utils/api_secret";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";

import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light";
import dark from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark";
import Loading from "react-loading";
SyntaxHighlighter.registerLanguage("json", json);

const FormData = ({
  isDarkTheme = false,
  assetId = "aiocvDxU5ETxrLB5rfm38A",
  assetMeta = {},
}) => {
  const [data, setData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [JSONData, setJSONData] = useState({});
  const [parsingData, setParsingData] = useState(false);

  useEffect(() => {
    const fetchData = async (assetId, assetMeta) => {
      return await axios.get(
        `${apiURL}/api/kobo/${assetMeta.userType}/data/${assetId}`,
        {
          auth: {
            username: apiUsername,
            password: apiPassword,
          },
        }
      );
    };
    if (assetMeta.userType) {
      setFetching(true);
      fetchData(assetId, assetMeta)
        .then((res) => {
          setData(res.data.data.results);
          if (res.status === 200) {
          } else {
            throw new Error(res.statusText);
          }
        })
        .then(() => {
          setFetching(false);
        })
        .catch((e) => {
          console.log(e);
          setFetching(false);
        });
    }
  }, [assetId, assetMeta]);

  useEffect(() => {
    const parseJSON = (data) => {
      setJSONData(JSON.stringify(data, undefined, 2));
    };
    if (Object.keys(data).length > 0) {
      parseJSON(data);
    }
  }, [data]);

  useEffect(() => {
    if (Object.keys(JSONData).length === 0 && Object.keys(data).length > 0)
      setParsingData(true);
    else {
      setParsingData(false);
    }
  }, [JSONData, data]);

  return (
    <Grid container>
      <Grid item xs={12}>
        {fetching ? (
          "Fetching Data..."
        ) : data && data.length > 0 ? (
          Object.keys(JSONData).length > 0 ? (
            <SyntaxHighlighter
              language="json"
              style={isDarkTheme ? dark : docco}
            >
              {JSONData}
            </SyntaxHighlighter>
          ) : (
            "Parsing Data"
          )
        ) : (
          "No Data"
        )}
      </Grid>
    </Grid>
  );
};

export default FormData;
