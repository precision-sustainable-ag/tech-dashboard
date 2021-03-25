import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  Typography,
  DialogContent,
  FormControl,
  FormControlLabel,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useMemo } from "react";

const EditProducerModal = (props) => {
  const [maxWidth, setMaxWidth] = useState("md");

  // const { producer_id, email, phone, first_name, last_name } = props.data;

  const handleMaxWidthChange = (event) => {
    setMaxWidth(event.target.value);
  };

  return (
    <Dialog
      open={props.open}
      onClose={() => props.setOpen(!props.open)}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
      maxWidth={maxWidth}
      disableBackdropClick
    >
      <DialogTitle id="form-dialog-title">
        <Grid container justify="space-between">
          <Grid item>
            <Typography variant="h5">Edit Producer</Typography>
          </Grid>
          <Grid item>
            <Select
              autoFocus
              value={maxWidth}
              onChange={handleMaxWidthChange}
              inputProps={{
                name: "max-width",
                id: "max-width",
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
      <form
        id="editProducerForm"
        onSubmit={(e) => {
          e.preventDefault();

          console.log("submit via form", e.bubbles);
          const form = document.getElementById("editProducerForm");
          let data = new URLSearchParams(new FormData(form));
          data.append("producer_id", props.data.producer_id);
          console.log(data.toString());
          // post('/api/producers/{producerId}
          //  expects{ POST  x-www-form-data['email', 'phone', 'last_name'];
        }}
      >
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  label="Producer ID"
                  name="producer_id"
                  defaultValue={props.data.producer_id}
                  type="text"
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  label="Last Name/Organization Name"
                  name="last_name"
                  defaultValue={props.data.last_name}
                  type="text"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  label="Email ID"
                  name="email"
                  defaultValue={props.data.email}
                  type="email"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  label="Phone"
                  name="phone"
                  defaultValue={props.data.phone}
                  type="text"
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.setOpen(!props.open)}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

EditProducerModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func,
  data: PropTypes.shape({
    email: PropTypes.string | null,
    first_name: PropTypes.string | null,
    last_name: PropTypes.string | null,
    producer_id: PropTypes.string.isRequired,
    phone: PropTypes.string | null,
  }).isRequired,
};

export default EditProducerModal;
