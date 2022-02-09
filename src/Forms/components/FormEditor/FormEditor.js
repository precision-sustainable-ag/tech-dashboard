import React, { useState } from 'react';
import { Button, Snackbar } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import FormEditorModal from './FormEditorModal';
import { PropTypes } from 'prop-types';
import { useAuth0 } from '../../../Auth/react-auth0-spa';
import MuiAlert from '@material-ui/lab/Alert';

import { callAzureFunction } from '../../../utils/SharedFunctions';

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const FormEditor = (props) => {
  let { isDarkTheme, slimRecord, error, formName, uid } = props;

  const { getTokenSilently } = useAuth0();

  const [modalOpen, setModalOpen] = useState(false);
  const [editableList, setEditableList] = useState([]);
  const [buttonText, setButtonText] = useState('Edit Form');
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: '',
    severity: 'success',
  });

  const toggleModalOpen = () => {
    console.log('toggling modal');
    setModalOpen(!modalOpen);
  };

  const fetchEditableList = async () => {
    const data = { version: slimRecord.__version__ };
    const res = await callAzureFunction(data, 'EditableList', getTokenSilently);
    setEditableList(JSON.parse(res.jsonResponse));
  };

  const handleEdit = async () => {
    console.log('handling edit');
    setButtonText('Loading');
    await fetchEditableList();
    toggleModalOpen();
  };

  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackbarData.open}
        autoHideDuration={10000}
        onClose={() => setSnackbarData({ ...snackbarData, open: !snackbarData.open })}
      >
        <Alert severity={snackbarData.severity}>{snackbarData.text}</Alert>
      </Snackbar>
      {modalOpen ? (
        <FormEditorModal
          isDarkTheme={isDarkTheme}
          modalOpen={modalOpen}
          toggleModalOpen={toggleModalOpen}
          slimRecord={slimRecord}
          editableList={editableList}
          setButtonText={setButtonText}
          error={error}
          formName={formName}
          setSnackbarData={setSnackbarData}
          uid={uid}
        />
      ) : (
        <Button
          variant="contained"
          color={isDarkTheme ? 'primary' : 'default'}
          aria-label={`All Forms`}
          tooltip="All Forms"
          size="small"
          startIcon={<Edit />}
          onClick={handleEdit}
        >
          {buttonText}
        </Button>
      )}
    </React.Fragment>
  );
};

FormEditor.propTypes = {
  isDarkTheme: PropTypes.bool,
  slimRecord: PropTypes.any,
  error: PropTypes.any,
  formName: PropTypes.string,
  uid: PropTypes.any,
};

export default FormEditor;
