import React from "react";
// import { Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";
// import { Edit } from "@material-ui/icons";
import { PropTypes } from 'prop-types';
import { Grid, Typography, TextField } from "@material-ui/core";
// import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
// import docco from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light";
// import dark from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark";

const EditableField = ( props ) => {
    let { field, data } = props
    console.log(field, data);
    return (
        <Grid container spacing={3}>
            <Grid item>
                <Typography>{field}:</Typography>
            </Grid>
            <Grid item>
                <TextField defaultValue={data} variant="filled" size="small"></TextField>
            </Grid>
        </Grid>
    )
}

EditableField.propTypes = {
    field: PropTypes.string,
    data: PropTypes.string
}

export default EditableField