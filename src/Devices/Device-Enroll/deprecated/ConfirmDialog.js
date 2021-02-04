// Dependency Imports
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@material-ui/core";

// Default function 
const ConfirmDialog = props => {
  // const [open, setOpen] = React.useState(false);

  const handleClose = decision => {
    props.setOpen(false);
    props.confirmDialogDecision(decision);
  };
  return (
    <Dialog
      fullScreen={props.fullScreen}
      open={props.open}
      onClose={handleClose}
      aria-labelledby="confirmation-dialog"
    >
      <DialogTitle>{"Are you sure you want to do this?"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This cannot be undone (in this current build) from the tech dashboard,
          future builds would have an option to backtrack.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose(false)} color="primary">
          Cancel
        </Button>
        <Button autoFocus onClick={handleClose(true)} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
