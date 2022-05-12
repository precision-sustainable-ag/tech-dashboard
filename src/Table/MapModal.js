import React, { } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import GoogleMap from '../Location/GoogleMap';
import { Close } from '@material-ui/icons';
// import PropTypes from 'prop-types';
// import { Context } from '../Store/Store';
import { useSelector, useDispatch } from "react-redux";
import { setMapModalOpen } from '../Store/newStore';


const MapModal = (
  // { open = false, setOpen = () => {}, lat = 35.763197, lng = -78.700187 }
  ) => {
  // const [state, dispatch] = useContext(Context);

  const dispatch = useDispatch();

  const fullWidth = true;
  const maxWidth = 'md';
  const open = useSelector((state) => state.theStore.mapModalOpen);
  const lat = useSelector((state) => state.theStore.mapModalData[0]);
  const lng = useSelector((state) => state.theStore.mapModalData[1]);
  const setOpen = () => {
    // dispatch({
    //   type: 'SET_MAP_MODAL_OPEN',
    //   data: {
    //     mapModalOpen: false,
    //   },        
    // });
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

// MapModal.propTypes = {
//   /** Latitude */
//   lat: PropTypes.number,
//   /** Longitude */
//   lng: PropTypes.number,
//   /** Checks if modal needs to be open */
//   open: PropTypes.bool,
//   /** Dispatcher to mutate `open` */
//   setOpen: PropTypes.func,
// };

export default MapModal;
