import React from "react";
import { PropTypes } from 'prop-types';
import { Grid, Typography, TextField } from "@material-ui/core";

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