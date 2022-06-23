import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import GoogleMap from '../../../../Location/components/GoogleMap/GoogleMap';
import { Close } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { setMapModalOpen } from '../../../../Store/actions';

const MapModal = () => {
  const dispatch = useDispatch();

  const fullWidth = true;
  const maxWidth = 'md';
  const open = useSelector((state) => state.tableData.mapModalOpen);
  const lat = useSelector((state) => state.tableData.mapModalData[0]);
  const lng = useSelector((state) => state.tableData.mapModalData[1]);

  const setOpen = () => {
    dispatch(setMapModalOpen(false));
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen()}
      aria-labelledby="form-dialog-title"
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle>
        <Grid container justifyContent="space-between">
          <Typography variant="h4">Field Location</Typography>
          <IconButton onClick={() => setOpen()}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div style={{ height: '450px', width: '100%' }}>
              <GoogleMap from="mapModal" lat={lat} lng={lng} />
            </div>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
