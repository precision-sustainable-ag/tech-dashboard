import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Grid, Tooltip } from '@material-ui/core';
import { Edit, QuestionAnswer } from '@material-ui/icons';
import ActualFarmDates from '../ActualFarmDates/ActualFarmDates';
import IssueDialogue from '../../../../Comments/components/IssueDialogue/IssueDialogue';
import EditDatesModal from '../EditDatesModal/EditDatesModal';
import { setEditDatesModalData, setEditDatesModalOpen } from '../../../../Store/actions';
import PropTypes from 'prop-types';

const FarmDatesDropdown = ({ rowData, nickname, setSnackbarData }) => {
  const [showIssue, setShowIssue] = useState(false);
  const dispatch = useDispatch();
  const expandActualFarmDates =
    rowData.protocols.decomp_biomass != null ||
    rowData.protocols.decomp_biomass != 0 ||
    rowData.protocols.decomp_biomass != -999
      ? true
      : false;

  return (
    <Grid container spacing={2}>
      {expandActualFarmDates ? (
        <Grid item xs={12} sm={12} md={12} lg={12}>
          {' '}
          <ActualFarmDates rowData={rowData} />{' '}
        </Grid>
      ) : (
        ''
      )}
      {!showIssue && (
        <Grid item>
          <Tooltip title="Submit a new issue">
            <Button
              startIcon={<QuestionAnswer />}
              size="small"
              variant="contained"
              color="primary"
              onClick={() => {
                setShowIssue(!showIssue);
              }}
            >
              Comment
            </Button>
          </Tooltip>
        </Grid>
      )}
      {showIssue && (
        <Grid item>
          <IssueDialogue
            nickname={nickname}
            rowData={rowData}
            dataType="table"
            setSnackbarData={setSnackbarData}
            labels={['farm-dates']}
            setShowNewIssueDialog={setShowIssue}
          />
        </Grid>
      )}
      <Grid item>
        <Tooltip title="Edit Dates">
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<Edit />}
            onClick={() => {
              dispatch(setEditDatesModalOpen(true));
              dispatch(setEditDatesModalData(rowData));
            }}
          >
            Edit Dates
          </Button>
        </Tooltip>
      </Grid>
      <Grid item>
        <EditDatesModal setSnackbarDataGlobal={setSnackbarData} />
      </Grid>
    </Grid>
  );
};

export default FarmDatesDropdown;

FarmDatesDropdown.propTypes = {
  rowData: PropTypes.any,
  nickname: PropTypes.string,
  setSnackbarData: PropTypes.func,
};
