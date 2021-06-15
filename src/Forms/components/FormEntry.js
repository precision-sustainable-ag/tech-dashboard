import React from "react";
import {
    Grid,
    Typography,
} from "@material-ui/core";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light";
import dark from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";

SyntaxHighlighter.registerLanguage("json", json);

const FormEntry = ({ record, index, isDarkTheme, CreateNewIssue, timezoneOffset }) => {
    let slimRecord = record;
    let localTime = new Date(Date.parse(record._submission_time) - timezoneOffset);
    const submittedDate = localTime;

    // console.log(index)

    return (
        <Grid item container xs={12} spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h6">
                    {submittedDate.toLocaleString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    // timeZone: "UTC",
                    timeZone: "America/New_York",
                    })}
                </Typography>
                <SyntaxHighlighter
                    language="json"
                    style={isDarkTheme ? dark : docco}
                >
                    {JSON.stringify(slimRecord, undefined, 2)}
                </SyntaxHighlighter>
            </Grid>
            <CreateNewIssue issueData={record} index={index}/>
        </Grid>
    )
}

export default FormEntry
