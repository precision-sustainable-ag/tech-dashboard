import {
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { apiPassword, apiUsername } from "../utils/api_secret";
import { azureDebugURL } from "../utils/constants";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light";
import dark from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";

SyntaxHighlighter.registerLanguage("json", json);

const Debug = () => {
  const { palette } = useTheme();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDebugLog = async () => {
      setLoading(true);
      try {
        const response = await fetch(azureDebugURL, {
          headers: {
            Authorization: "Basic " + btoa(`${apiUsername}:${apiPassword}`),
          },
        });

        const records = await response.json();

        const parsedData = records.data.map((rec) => {
          return { ...rec, data: JSON.parse(rec.data) };
        });

        setData(parsedData);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    fetchDebugLog();
  }, []);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" id="debug">
          Debug Log
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Log</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <CircularProgress color="primary" />
                  </TableCell>
                </TableRow>
              ) : data.length > 0 ? (
                data.map((records) => {
                  const dateObject = moment(records.server_timestamp);
                  return (
                    <TableRow>
                      <TableCell align="justify">
                        <Tooltip title={dateObject.format("m/D/YY h:mm a")}>
                          <Typography variant="body1">
                            {dateObject.fromNow()}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <SyntaxHighlighter
                          language="json"
                          style={palette.type === "dark" ? dark : docco}
                        >
                          {JSON.stringify(records.data, undefined, 2)}
                        </SyntaxHighlighter>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No Data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default Debug;
