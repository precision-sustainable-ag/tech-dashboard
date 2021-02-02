import React, { useState, useEffect } from "react";
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

const MapModal = ({
  open = false,
  setOpen = () => {},
  lat = 35.763197,
  lng = -78.700187,
}) => {
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("md");

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="form-dialog-title"
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle>
        <Grid container justify="space-between">
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

export default MapModal;
