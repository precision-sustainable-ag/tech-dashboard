// Dependency Imports
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  Grid,
  Typography,
} from "@material-ui/core";
import Axios from "axios";
import PropTypes from "prop-types";
// Local Imports
import { apiURL, apiUsername, apiPassword } from "../utils/api_secret";

//Global Vars
const qs = require("qs");

// Default function
const UnenrollSiteModal = (props) => {
  const open = props.open;
  const [confirmText, setConfirmText] = useState("");
  const [confirmBtnStatus, setConfirmBtnStatus] = useState("Confirm");

  const handleUnenroll = () => {
    // disenroll and close
    setConfirmBtnStatus("Please Wait..");
    const site = new SiteEnrollment(props.data);
    site.sanitizeData();
    const dataString = qs.stringify(site);

    Axios({
      url: `${apiURL}/api/sites/disenroll`,
      method: "post",
      data: dataString,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
    })
      .then((response) => {
        if (response.data.data) {
          props.handleUnenrollClose();
          props.setValuesEdited(!props.valuesEdited);
        } else {
          console.error(response.data);
        }
      })
      .then(() => {
        window.location.reload();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const closeModal = () => {
    setConfirmText("");
    props.handleUnenrollClose();
  };
  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={open}
      onClose={closeModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{`Disenroll site`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You are about to{" "}
          {`Disenroll site '${props.data.code}' for producer '${props.data.last_name}'`}
          . Please note that this action can not be undone.
        </DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1">
              To disenroll this site please type the site code{" "}
              <strong>{props.data.code}</strong> below.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={confirmText}
              label="Site Code"
              fullWidth
              onChange={(e) => {
                setConfirmText(e.target.value.toUpperCase());
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={closeModal}
          color="primary"
          autoFocus
          variant={
            window.localStorage.getItem("theme") === "dark"
              ? "contained"
              : "text"
          }
        >
          Cancel
        </Button>
        <Button
          onClick={handleUnenroll}
          color="primary"
          disabled={props.data.code === confirmText ? false : true}
          variant={
            window.localStorage.getItem("theme") === "dark"
              ? "contained"
              : "text"
          }
        >
          {confirmBtnStatus}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnenrollSiteModal;

UnenrollSiteModal.propTypes = {
  open: PropTypes.bool,
  data: PropTypes.any,
  handleUnenrollClose: PropTypes.func,
  setValuesEdited: PropTypes.func,
  valuesEdited: PropTypes.bool,
};

class SiteEnrollment {
  constructor(obj) {
    //   unmutable
    this.cid = obj.cid;
    this.code = obj.code;
    this.year = obj.year;
    this.affiliation = obj.affiliation;
    this.producer_id = obj.producer_id;

    // mutable
    this.county = obj.county;
    this.longitude = parseFloat(obj.longitude);
    this.latitude = parseFloat(obj.latitude);
    this.notes = obj.notes;
    this.additional_contact = obj.additional_contact;
    this.address = obj.address;
    this.state = obj.state;
  }

  sanitizeData() {
    if (!this.additional_contact) this.additional_contact = "-999";
    if (!this.address) this.address = "-999";
    if (!this.county) this.county = "-999";
    if (isNaN(this.latitude)) this.latitude = -999;
    if (isNaN(this.longitude)) this.longitude = -999;
    if (!this.state) this.state = "-999";
    if (!this.notes) this.notes = "-999";
  }
}
