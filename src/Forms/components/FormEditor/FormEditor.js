import React, { useState, Fragment } from 'react';
import { Button } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import FormEditorModal from '../FormEditorModal/FormEditorModal';
import { PropTypes } from 'prop-types';
import { useAuth0 } from '../../../Auth/react-auth0-spa';

import { callAzureFunction } from '../../../utils/SharedFunctions';
// import { Context } from '../../../Store/Store';
import { updateSelectedFormData } from '../../../Store/actions';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const FormEditor = (props) => {
  let { slimRecord, error, uid } = props;

  const { getTokenSilently } = useAuth0();
  // const [state, dispatch] = useContext(Context);
  const userInfo = useSelector((state) => state.userInfo);
  const isDarkTheme = useSelector((state) => state.userInfo.isDarkTheme);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLists, setEditingLists] = useState([]);
  const [buttonText, setButtonText] = useState('View errors and fix form');

  const toggleModalOpen = () => {
    // dispatch({
    //   type: 'UPDATE_SELECTED_FORM_DATA',
    //   data: {
    //     formType: 'valid',
    //     formSlimRecord: slimRecord || [],
    //     formError: error || [],
    //     formUid: uid || [],
    //   },
    // });
    dispatch(
      updateSelectedFormData({
        slimRecord: slimRecord || [],
        error: error || [],
        uid: uid || [],
      }),
    );

    setModalOpen(!modalOpen);
  };

  const fetchEditableList = async () => {
    const res = await callAzureFunction(
      null,
      `shadowdb/editable_list/${slimRecord.__version__}`,
      'GET',
      getTokenSilently,
    );
    setEditingLists(res.jsonResponse);
  };

  const handleEdit = async () => {
    console.log('handling edit');
    setButtonText('Loading');
    await fetchEditableList();
    toggleModalOpen();
  };

  return (
    <Fragment>
      {modalOpen ? (
        <FormEditorModal
          modalOpen={modalOpen}
          toggleModalOpen={toggleModalOpen}
          editingLists={editingLists}
          setButtonText={setButtonText}
        />
      ) : userInfo.view_type === 'home' ? (
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
      ) : (
        <Fragment></Fragment>
      )}
    </Fragment>
  );
};

FormEditor.propTypes = {
  slimRecord: PropTypes.any,
  error: PropTypes.any,
  uid: PropTypes.any,
};

export default FormEditor;
