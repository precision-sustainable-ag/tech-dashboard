import React from 'react';
import { PropTypes } from 'prop-types';
import { Grid, Typography, TextField } from '@material-ui/core';

const EditableField = (props) => {
  let { entry, editedForm, setEditedForm, iterator_item, entry_to_iterate, iterator_index } = props;

  const handleEntryEdit = (e) => {
    let newObj = editedForm;

    if (iterator_item === false) {
      editedForm[entry] = e.target.value;
      setEditedForm({ ...newObj });
    } else {
      editedForm[entry_to_iterate][iterator_index][entry] = e.target.value;
      setEditedForm({ ...newObj });
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item>
        <Typography>{entry}:</Typography>
      </Grid>
      <Grid item>
        <TextField
          value={iterator_item && iterator_item[entry] ? iterator_item[entry] : editedForm[entry]}
          variant="filled"
          size="small"
          onChange={handleEntryEdit}
        ></TextField>
      </Grid>
    </Grid>
  );
};

EditableField.propTypes = {
  entry: PropTypes.string,
  editedForm: PropTypes.object,
  setEditedForm: PropTypes.func,
  iterator_item: PropTypes.object,
  entry_to_iterate: PropTypes.oneOfType([PropTypes.string, PropTypes.boolean]),
  iterator_index: PropTypes.number,
};

export default EditableField;
