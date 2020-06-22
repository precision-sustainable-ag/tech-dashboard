import React from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Link,
  Button,
  IconButton,
  Dialog,
  TextField,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";

const EditDataModal = (props) => {
  const open = props.open;
  return (
    <Dialog
      open={open}
      onClose={props.handleEditModalClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit Data</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText> */}
        <Grid container spacing={2}>
          <Grid item sm={12} lg={6}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />
          </Grid>
          <Grid item sm={12} lg={6}>
            <TextField
              margin="dense"
              value={"VUN"}
              disabled
              id="name"
              label="Code"
              type="text"
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleEditModalClose} color="primary">
          Cancel
        </Button>
        <Button onClick={props.handleEditModalClose} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDataModal;
