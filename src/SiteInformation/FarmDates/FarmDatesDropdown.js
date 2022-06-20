import React, { Fragment, useState } from 'react';
import {useDispatch} from 'react-redux';
import { Button, Tooltip } from '@material-ui/core';
import { Edit, QuestionAnswer } from '@material-ui/icons';
import ActualFarmDates from './ActualFarmDates';
import IssueDialogue from '../../Comments/IssueDialogue';
import EditDatesModal from './EditDatesModal';
import { setEditDatesModalData, setEditDatesModalOpen } from '../../Store/actions';
import PropTypes from 'prop-types';

const FarmDatesDropdown = ({ rowData, nickname, setSnackbarData }) => {
  const [showIssue, setShowIssue] = useState(false);
  const dispatch = useDispatch();
  const expandActualFarmDates = rowData.protocols.decomp_biomass == 1 ? true : false;

  return (
    <Fragment>
      {expandActualFarmDates ? <ActualFarmDates rowData={rowData} /> : ''}
      <br />
      {!showIssue && (
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
      )}
      <br />
      {showIssue && (
        <IssueDialogue
          nickname={nickname}
          rowData={rowData}
          dataType="table"
          setSnackbarData={setSnackbarData}
          labels={['farm-dates']}
          setShowNewIssueDialog={setShowIssue}
        />
      )}
      <br />
      <Tooltip title="Edit Dates">
          <Button
            size="small"
            variant="contained"
            color= "primary"
            startIcon={<Edit />}
            onClick={() => {
              dispatch(setEditDatesModalOpen(true));
              dispatch(setEditDatesModalData(rowData));
            }}
          >
            Edit Dates
          </Button>
      </Tooltip>
      <EditDatesModal setSnackbarDataGlobal={setSnackbarData}/>
      <br />
    </Fragment>
  );
};

export default FarmDatesDropdown;

FarmDatesDropdown.propTypes = {
  rowData: PropTypes.any,
  nickname: PropTypes.string,
  setSnackbarData: PropTypes.func,
};
