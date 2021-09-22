import React from "react";
import { PropTypes } from 'prop-types';
import { Grid, Typography, TextField } from "@material-ui/core";

const EditableField = ( props ) => {
    let { 
        entry,
        editedForm, 
        setEditedForm,
    } = props;

    const handleEntryEdit = (e) => {
        let newObj = editedForm;
        editedForm[entry] = e.target.value;
        setEditedForm({...newObj});
    };

    return (
        <Grid container spacing={3} >
            <Grid item>
                <Typography>{entry}:</Typography>
            </Grid>
            <Grid item>
                <TextField value={editedForm[entry]} variant="filled" size="small" onChange={handleEntryEdit}></TextField>
            </Grid>
        </Grid>
    );
};

EditableField.propTypes = {
    entry: PropTypes.string,
    editedForm: PropTypes.object,
    setEditedForm: PropTypes.func,
};

export default EditableField;