import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import GoogleMap from "../Location/GoogleMap";
import { Close } from "@material-ui/icons";
import PropTypes from "prop-types";

const MapModal = ({
  open = false,
  setOpen = () => {},
  lat = 35.763197,
  lng = -78.700187,
}) => {
  const fullWidth = true;
  const maxWidth = "md";

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="form-dialog-title"
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle>
        <Grid container justifyContent="space-between">
          <Typography variant="h4">Field Location</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div style={{ height: "450px", width: "100%" }}>
              <GoogleMap from="mapModal" lat={lat} lng={lng} />
            </div>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

MapModal.propTypes = {
  /** Latitude */
  lat: PropTypes.number,
  /** Longitude */
  lng: PropTypes.number,
  /** Checks if modal needs to be open */
  open: PropTypes.bool,
  /** Dispatcher to mutate `open` */
  setOpen: PropTypes.func,
};

export default MapModal;
