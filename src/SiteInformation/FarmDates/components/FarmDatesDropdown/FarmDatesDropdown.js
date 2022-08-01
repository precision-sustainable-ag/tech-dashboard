import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Tooltip } from '@material-ui/core';
import { Edit, QuestionAnswer } from '@material-ui/icons';
import ActualFarmDates from '../ActualFarmDates/ActualFarmDates';
import IssueDialogue from '../../../../Comments/components/IssueDialogue/IssueDialogue';
import EditDatesModal from '../EditDatesModal/EditDatesModal';
import { setEditDatesModalData, setEditDatesModalOpen } from '../../../../Store/actions';
import { setIssueDialogData } from '../../../../Store/actions';
import PropTypes from 'prop-types';

const FarmDatesDropdown = ({ rowData, nickname }) => {
  const dispatch = useDispatch();
  const issueDialogData = useSelector((state) => state.issueDialogData.issueDialogData);
  const expandActualFarmDates =
    rowData.protocols.decomp_biomass === null ||
    rowData.protocols.decomp_biomass === 0 ||
    rowData.protocols.decomp_biomass === -999
      ? false
      : true;

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
      {!issueDialogData.setShowNewIssueDialog && (
        <Grid item>
          <Tooltip title="Submit a new issue">
            <Button
              startIcon={<QuestionAnswer />}
              size="small"
              variant="contained"
              color="primary"
              onClick={() => {
                dispatch(
                  setIssueDialogData({
                    nickname: nickname,
                    dataType: 'table',
                    setShowNewIssueDialog: true,
                  }),
                );
              }}
            >
              Comment
            </Button>
          </Tooltip>
        </Grid>
      )}
      {issueDialogData.setShowNewIssueDialog && (
        <Grid item>
          <IssueDialogue rowData={rowData} labels={['farm-dates']} />
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
        <EditDatesModal />
      </Grid>
    </Grid>
  );
};

export default FarmDatesDropdown;

FarmDatesDropdown.propTypes = {
  rowData: PropTypes.any,
  nickname: PropTypes.string,
};
