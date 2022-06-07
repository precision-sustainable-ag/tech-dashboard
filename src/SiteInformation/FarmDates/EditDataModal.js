import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  Grid,
  Select,
  MenuItem,
  Checkbox,
  Button,
  Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useSelector, useDispatch } from 'react-redux';
import { setEditProtocolsModalOpen } from '../../Store/actions';
import { callAzureFunction } from '../../utils/SharedFunctions';
import { useAuth0 } from '../../Auth/react-auth0-spa';
import PropTypes from 'prop-types';

const EditDataModal = () => {
    return <h1>Hello Modal</h1>;
};

export default EditDataModal;