import React, { useState } from 'react';
import {
  Grid,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Select,
  MenuItem,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import EnrollNewSite from '../SiteEnrollment/EnrollNewSite';

const fullWidth = true;

const ReassignDataModal = (props) => {
  const open = props.open;

  const [maxWidth, setMaxWidth] = useState('md');

  const handleMaxWidthChange = (event) => {
    setMaxWidth(event.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={props.handleEditModalClose}
      aria-labelledby="form-dialog-title"
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      disableEscapeKeyDown
    >
      <DialogTitle id="form-dialog-title">
        <Grid container justifyContent="space-between">
          <Grid item>
            Site <mark>{props.data.code}</mark> of producer: <strong>{props.data.last_name}</strong>{' '}
            [{props.data.producer_id}]
          </Grid>
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
        <EnrollNewSite
          editSite={true}
          code={props.data.code}
          producerId={props.data.producer_id}
          year={props.data.year}
          affiliation={props.data.affiliation}
          closeModal={props.handleEditModalClose}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.handleEditModalClose}
          color="primary"
          variant={window.localStorage.getItem('theme') === 'dark' ? 'contained' : 'text'}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReassignDataModal;

ReassignDataModal.propTypes = {
  open: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    cid: PropTypes.any,
    code: PropTypes.any,
    year: PropTypes.any,
    affiliation: PropTypes.any,
    county: PropTypes.any,
    longitude: PropTypes.any,
    latitude: PropTypes.any,
    notes: PropTypes.any,
    additional_contact: PropTypes.any,
    address: PropTypes.any,
    producer_id: PropTypes.any,
    state: PropTypes.any,
    last_name: PropTypes.any,
    email: PropTypes.any,
    phone: PropTypes.any,
    latlng: PropTypes.any,
    tableData: PropTypes.any,
  }),
  handleEditModalClose: PropTypes.func,
  setValuesEdited: PropTypes.func,
  valuesEdited: PropTypes.bool,
};