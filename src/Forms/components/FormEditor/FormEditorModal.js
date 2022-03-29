import React, { useState, Fragment } from 'react';
import { Button, Dialog, DialogContent, Grid, Typography, TextField } from '@material-ui/core';
import { PropTypes } from 'prop-types';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light';
import dark from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark';
import { useAuth0 } from '../../../Auth/react-auth0-spa';
import { Error, CheckCircle } from '@material-ui/icons/';

import EditableField from './EditableField';
import { callAzureFunction } from './../../../utils/SharedFunctions';

const FormEditorModal = (props) => {
  let {
    isDarkTheme,
    modalOpen,
    toggleModalOpen,
    slimRecord,
    editingLists,
    setButtonText,
    error,
    formName,
    setSnackbarData,
    uid,
  } = props;

  const { getTokenSilently } = useAuth0();
  const [editedForm, setEditedForm] = useState({ ...slimRecord });
  const [submitText, setSubmitText] = useState('Submit');
  const [deleteItem, setDeleteItem] = useState(false);
  const [deleteItemText, setDeleteItemText] = useState('');
  const [deleteButtonText, setDeleteButtonText] = useState('Delete this item');
  const [deleteIndex, setDeleteIndex] = useState(0);

  const handleCancel = () => {
    setButtonText('Edit Form');
    setEditedForm({ ...slimRecord });
    toggleModalOpen();
  };

  const handleDelete = (iterator_index, entry_to_iterate) => {
    setDeleteItem(true);
    setDeleteButtonText(`Delete item ${iterator_index}`);
    setDeleteIndex(iterator_index);
    let newObj = editedForm;

    if (iterator_index === parseInt(deleteItemText)) {
      newObj[entry_to_iterate].splice(iterator_index, 1);
      setEditedForm({ ...newObj });
      setDeleteItemText('');
      setSnackbarData({
        open: true,
        text: `Successfully deleted item ${iterator_index}`,
        severity: 'success',
      });
    } else if (deleteButtonText === `Delete item ${iterator_index}`) {
      setSnackbarData({
        open: true,
        text: `Incorrect number given for item ${iterator_index}`,
        severity: 'error',
      });
    }
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

  const errors = JSON.parse(error[0]);
  const failedTables = errors.map((err) => err.split('table ')[1]);
  const noProducer = errors.find((element) => {
    if (element.includes('producer with that email or phone does not exist')) {
      return true;
    }
  });
  const noFarmCode = errors.find((element) => {
    if (element.includes('No farm code')) {
      return true;
    }
  });

  return typeof modalOpen === 'boolean' && modalOpen ? (
    <Dialog open={modalOpen} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth="xl">
      <DialogContent>
        <Grid container direction="row" spacing={2}>
          <Grid item>
            <Grid container direction="column">
              <Grid item>
                <Typography variant="h4">Original Form</Typography>
              </Grid>
              <Grid item>
                <SyntaxHighlighter language="json" style={isDarkTheme ? dark : docco}>
                  {JSON.stringify(slimRecord, undefined, 2)}
                </SyntaxHighlighter>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" spacing={4}>
              <Grid item>
                <Typography variant="h4">Editable Entries</Typography>
              </Grid>
              <Grid item>
                {JSON.parse(editingLists.editable_list).map((entry, index) => {
                  return (
                    <EditableField
                      entry={entry}
                      editedForm={editedForm}
                      setEditedForm={setEditedForm}
                      key={index}
                      entry_to_iterate={false}
                    />
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
          <Grid item container>
            {editingLists.entry_to_iterate && (
              <Grid item container spacing={4}>
                {editedForm[editingLists.entry_to_iterate].map((iterator_item, iterator_index) => {
                  console.log(iterator_item);
                  return (
                    <Grid item key={iterator_index}>
                      <Typography variant="h5">List Item {iterator_index}</Typography>
                      {JSON.parse(editingLists.iterator_editable_list).map(
                        (editable_item, editable_index) => {
                          return (
                            <EditableField
                              entry={editable_item}
                              editedForm={editedForm}
                              setEditedForm={setEditedForm}
                              key={editable_index}
                              iterator_item={iterator_item}
                              entry_to_iterate={editingLists.entry_to_iterate}
                              iterator_index={iterator_index}
                            />
                          );
                        },
                      )}
                      <Grid item container spacing={3}>
                        {deleteItem && iterator_index === deleteIndex ? (
                          <Fragment>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                              <Typography variant="h6" style={{ color: 'red' }}>
                                Enter the number of the item you want to delete
                              </Typography>
                            </Grid>
                            <Grid item>
                              <TextField
                                value={deleteItemText}
                                defaultValue="Enter the number of the item you want to delete"
                                variant="filled"
                                size="small"
                                onChange={(e) => setDeleteItemText(e.target.value)}
                              ></TextField>
                            </Grid>
                            <Grid item>
                              <Button
                                variant="contained"
                                color={isDarkTheme ? 'primary' : 'default'}
                                aria-label={`All Forms`}
                                tooltip="All Forms"
                                size="small"
                                onClick={() =>
                                  handleDelete(iterator_index, editingLists.entry_to_iterate)
                                }
                              >
                                {deleteButtonText}
                              </Button>
                            </Grid>
                          </Fragment>
                        ) : (
                          <Grid item>
                            <Button
                              variant="contained"
                              color={isDarkTheme ? 'primary' : 'default'}
                              aria-label={`All Forms`}
                              tooltip="All Forms"
                              size="small"
                              onClick={() =>
                                handleDelete(iterator_index, editingLists.entry_to_iterate)
                              }
                            >
                              Delete this item
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Grid>
          <Grid item container spacing={1}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h4">Table Parsing Status</Typography>
            </Grid>
            {JSON.parse(editingLists.table_names).map((table, index) => {
              return (
                <Grid item key={index} xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Typography>
                    {failedTables.includes(table) || noProducer || noFarmCode ? (
                      <Error color="error" />
                    ) : (
                      <CheckCircle color="primary" />
                    )}{' '}
                    {table}
                  </Typography>
                </Grid>
              );
            })}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h4">Table Parsing Errors</Typography>
            </Grid>
            {JSON.parse(error[0]).map((err, index) => {
              return (
                <Grid item container spacing={1} key={index}>
                  <Grid item>
                    <Error color="error" />
                  </Grid>
                  <Grid item>
                    <Typography>{`Error ${index}: ${err}`}</Typography>
                  </Grid>
                </Grid>
              );
            })}
            <Grid item container spacing={1}>
              <Grid container spacing={2}>
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
  editingLists: PropTypes.object,
  slimRecord: PropTypes.object,
  setButtonText: PropTypes.func,
  error: PropTypes.array,
  formName: PropTypes.string,
  setSnackbarData: PropTypes.func,
  uid: PropTypes.any,
};

export default FormEditorModal;
