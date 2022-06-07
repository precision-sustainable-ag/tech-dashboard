import React, { Fragment, useState } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { Edit, QuestionAnswer } from '@material-ui/icons';
import ActualFarmDates from './ActualFarmDates';
import IssueDialogue from '../../Comments/IssueDialogue';
import EditDataModal from './EditDataModal';
import PropTypes from 'prop-types';

const FarmDatesDropdown = ({ rowData, nickname, setSnackbarData }) => {
  const [showIssue, setShowIssue] = useState(false);
  //do I need to add something in 
  const [showEditDataModal, setShowEditDataModal] = useState(flase);
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
      {!showEditDataModal && (
            <Tooltip title="Edit Data">
              <Button
                size="small"
                variant="contained"
                color={isDarkTheme ? 'primary' : 'default'}
                startIcon={<Edit />}
                onClick={() => {
                  setShowEditDataModal(true)
                }}
              >
                Edit Protocols
              </Button>
            </Tooltip>
      )}
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
