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
import { setEditProtocolsModalOpen } from '../Store/actions';
import { callAzureFunction } from '../utils/SharedFunctions';
import { useAuth0 } from '../Auth/react-auth0-spa';

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// A protocol dictionary in case labels are to be changed in the future
const protocolDict = {
  sensor_data: 'sensor_data',
  bulk_density: 'bulk_density',
  corn_disease: 'corn_disease',
  farm_history: 'farm_history',
  soil_texture: 'soil_texture',
  gps_locations: 'gps_locations',
  soil_nitrogen: 'soil_nitrogen',
  yield_monitor: 'yield_monitor',
  decomp_biomass: 'decomp_biomass',
  cash_crop_yield: 'cash_crop_yield',
  in_field_biomass: 'in_field_biomass',
  weed_visual_rating: 'weed_visual_rating',
  weed_quadrat_photos_beta: 'weed_quadrat_photos_beta',
};

const EditProtocolModal = () => {
  const open = useSelector((state) => state.tableData.editProtocolsModalOpen);
  const editProtocolsModalData = useSelector((state) => state.tableData.editProtocolsModalData);
  const dispatch = useDispatch();
  const { getTokenSilently } = useAuth0();
  const [farmCode, setFarmCode] = useState();
  const [backedProtocols, setBackedProtocols] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [maxWidth, setMaxWidth] = useState('xs');
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: '',
    severity: 'success',
  });

  useEffect(() => {
      if (editProtocolsModalData) {
        setFarmCode(editProtocolsModalData.code);
        const protocols = editProtocolsModalData.protocols;
        setProtocols(protocols);
        setBackedProtocols(protocols);
      }
  }, [editProtocolsModalData]);

  const handleMaxWidthChange = (event) => {
    setMaxWidth(event.target.value);
  };

  const handleCheckBoxClick = (protocol) => {
    if (protocols[protocol] === 1) {
      setProtocols({ ...protocols, [protocol]: 0 });
    } else if (protocols[protocol] === 0 || protocols[protocol] === null) {
      setProtocols({ ...protocols, [protocol]: 1 });
    }
  };

  const handleEditProtocolsModalClose = () => {
    dispatch(setEditProtocolsModalOpen(!open));
  };

  const handleCancelButton = () => {
      setProtocols(backedProtocols);
      handleEditProtocolsModalClose();
  };

  const updateProtocolEnrollment = () => {
    const data = {
      protocols,
    };
    callAzureFunction(
      data,
      `crowndb/protocol_enrollment/${farmCode}`,
      'POST',
      getTokenSilently,
    ).then((res) => {
      if (res.response && res.response.status === 201) {
          setBackedProtocols(protocols);
          handleEditProtocolsModalClose();
      } else {
        setSnackbarData({
          open: true,
          text: 'Could Not Update Protocol Enrollment',
          severity: 'error',
        });
      }
    });
  };

  return (
    <Dialog
      open={open}
      fullWidth={true}
      maxWidth={maxWidth}
      onClose={() => handleEditProtocolsModalClose()}
    >
      <DialogTitle>
        <Grid container justifyContent="space-between">
          <Grid item>Edit Protocols for Site {farmCode}</Grid>
          <Grid item>
            <Select
              autoFocus
              value={maxWidth}
              onChange={handleMaxWidthChange}
              inputProps={{
                name: 'max-width',
                id: 'max-width',
              }}
            >
              <MenuItem value={false}>regular</MenuItem>
              <MenuItem value="xs">x-small</MenuItem>
              <MenuItem value="sm">small</MenuItem>
              <MenuItem value="md">medium</MenuItem>
              <MenuItem value="lg">large</MenuItem>
              <MenuItem value="xl">x-large</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Grid container justifyContent="space-between">
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
          <FormControl>
            <Grid item>
              {Object.keys(protocols).map((protocol) => (
                <FormControlLabel
                  key={protocol}
                  control={<Checkbox checked={protocols[protocol] === 1} color="primary" />}
                  label={protocolDict[protocol]}
                  disabled={protocols[protocol] === -999}
                  onChange={() => handleCheckBoxClick(protocol)}
                />
              ))}
            </Grid>
          </FormControl>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleCancelButton()} color="primary" variant="contained">
          Cancel
        </Button>
        <Button onClick={() => updateProtocolEnrollment()} color="primary" variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProtocolModal;
