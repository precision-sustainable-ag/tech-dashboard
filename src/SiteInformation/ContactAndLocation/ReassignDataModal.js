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
import EnrollNewSite from '../Shared/EnrollNewSite';
import { useSelector, useDispatch } from 'react-redux';
import { setReassignSiteModalOpen } from '../../Store/actions';

const fullWidth = true;

const ReassignDataModal = () => {
  const dispatch = useDispatch();

  const open = useSelector((state) => state.tableData.reassignSiteModalOpen);
  const reassignSiteModalData = useSelector((state) => state.tableData.reassignSiteModalData);
  const [maxWidth, setMaxWidth] = useState('md');

  const handleReassignSiteModalClose = () => {
    dispatch(setReassignSiteModalOpen(!open));
  };

  const handleMaxWidthChange = (event) => {
    setMaxWidth(event.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleReassignSiteModalClose}
      aria-labelledby="form-dialog-title"
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      disableEscapeKeyDown
    >
      <DialogTitle id="form-dialog-title">
        <Grid container justifyContent="space-between">
          <Grid item>
            Site <mark>{reassignSiteModalData.code}</mark> of producer:{' '}
            <strong>{reassignSiteModalData.last_name}</strong> [{reassignSiteModalData.producer_id}]
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
        <EnrollNewSite editSite={true} />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleReassignSiteModalClose}
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
