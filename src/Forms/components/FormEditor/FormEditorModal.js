import React, { useState } from 'react';
import { Button, Dialog, DialogContent, Grid, Typography } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light';
import dark from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark';
import { useAuth0 } from '../../../Auth/react-auth0-spa';
import { Error } from '@material-ui/icons/';

import EditableField from './EditableField';
import { callAzureFunction } from './../../../utils/SharedFunctions';

const FormEditorModal = (props) => {
  let {
    isDarkTheme,
    modalOpen,
    toggleModalOpen,
    slimRecord,
    editableList,
    setButtonText,
    error,
    formName,
    setSnackbarData,
    uid,
  } = props;

  const { getTokenSilently } = useAuth0();
  const [editedForm, setEditedForm] = useState({ ...slimRecord });
  const [submitText, setSubmitText] = useState('Submit');

  const handleCancel = () => {
    setButtonText('Edit Form');
    toggleModalOpen();
  };

  const handleSubmit = () => {
    setButtonText('Edit Form');
    setSubmitText('Submitting form...');
    let data = {
      data: JSON.stringify(editedForm),
      asset_name: formName.split('_').join(' '),
      id: editedForm._id,
      xform_id_string: editedForm._xform_id_string,
      uid: uid,
    };
    callAzureFunction(data, 'SubmitNewEntry', getTokenSilently).then((res) => {
      toggleModalOpen();
      setSubmitText('Submit');
      setEditedForm(slimRecord);

      if (res.response) {
        if (res.response.status === 201) {
          setSnackbarData({
            open: true,
            text: `Successfully submitted form edit, check back in 5 minutes`,
            severity: 'success',
          });
        } else {
          console.log('Function could not submit form edit');
          setSnackbarData({
            open: true,
            text: `Could not edit form (error code 0)`,
            severity: 'error',
          });
        }
      } else {
        console.log('No response from function, likely cors');
        setSnackbarData({
          open: true,
          text: `Could not edit form (error code 1)`,
          severity: 'error',
        });
      }
    });
  };

  return typeof modalOpen === 'boolean' && modalOpen ? (
    <Dialog open={modalOpen} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth="xl">
      <DialogContent>
        <Grid container direction="row" spacing={2}>
          <Grid item>
            <Grid container direction="column" xs={12} sm={12} md={12} lg={12} xl={12}>
              <Grid item>
                <Typography variant="h5">Original Form</Typography>
              </Grid>
              <Grid item>
                <SyntaxHighlighter language="json" style={isDarkTheme ? dark : docco}>
                  {JSON.stringify(slimRecord, undefined, 2)}
                </SyntaxHighlighter>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" xs={12} sm={12} md={12} lg={12} xl={12} spacing={2}>
              <Grid item>
                <Typography variant="h5">Editable Entries</Typography>
              </Grid>
              <Grid item>
                {editableList.map((entry, index) => {
                  return (
                    <EditableField
                      entry={entry}
                      editedForm={editedForm}
                      setEditedForm={setEditedForm}
                      key={index}
                    />
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
          <Grid item container spacing={1}>
            <Grid item>
              <Error color="error" />
            </Grid>
            <Grid item>
              <Typography>See errors below</Typography>
            </Grid>
          </Grid>
          <Grid item>
            {JSON.parse(error[0]).map((err, index) => {
              return <Typography key={index}>{`Error ${index}: ${err}`}</Typography>;
            })}
          </Grid>
          <Grid item container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color={isDarkTheme ? 'primary' : 'default'}
                aria-label={`All Forms`}
                tooltip="All Forms"
                size="small"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color={isDarkTheme ? 'primary' : 'default'}
                aria-label={`All Forms`}
                tooltip="All Forms"
                size="small"
                onClick={handleSubmit}
              >
                {submitText}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  ) : (
    ''
  );
};

FormEditorModal.propTypes = {
  isDarkTheme: PropTypes.bool,
  modalOpen: PropTypes.bool,
  toggleModalOpen: PropTypes.func,
  editableList: PropTypes.array,
  slimRecord: PropTypes.object,
  setButtonText: PropTypes.func,
  error: PropTypes.string,
  formName: PropTypes.string,
  setSnackbarData: PropTypes.func,
  uid: PropTypes.any,
};

export default FormEditorModal;
