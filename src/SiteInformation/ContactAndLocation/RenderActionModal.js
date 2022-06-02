import React from 'react';
import { Grid, Typography, Button, Tooltip } from '@material-ui/core';
// import MuiAlert from '@material-ui/lab/Alert';
// import MaterialTable from 'material-table';
import { Edit, DeleteForever, Search, QuestionAnswer, CheckBox } from '@material-ui/icons';
// Local Imports
import { UserIsEditor } from '../../utils/SharedFunctions';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  setEditModalOpen,
  setEditModalData,
  setReassignSiteModalOpen,
  setReassignSiteModalData,
  setUnenrollOpen,
  setUnenrollRowData,
  setEditProtocolsModalOpen,
  setEditProtocolsModalData,
  setShowNewIssueDialog,
  setNewIssueData,
  setMapModalData,
  setMapModalOpen,
  setEditSite,
} from '../../Store/actions';

const InnerTable = styled.table`
  border: 0;
  border-radius: 5px;
  border-style: hidden;
  box-shadow: 0 0 0 1px #666;
  border-collapse: collapse;
  font-size: 0.9em;
  font-family: sans-serif;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
`;

const InnerTableBody = styled.tbody`
  border-top: 2px solid #eceeef;
`;

const InnerTableRow = styled.tr`
  border-bottom: thin solid #dddddd;
  &:last-of-type {
    border-bottom: 2px solid #009879;
  }
  &:first-of-type {
    border-top: 2px solid #009878;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.075);
  }
`;

const InnerTableCell = styled.td`
  padding: 12px 15px;
`;

const RenderActionModal = (props) => {
  const { rowData, activeSites } = props;
  const dispatch = useDispatch();
  const isDarkTheme = useSelector((state) => state.userInfo.isDarkTheme);

  const RenderActionItems = ({ rowData }) => {
    return UserIsEditor() ? (
      <ActionItems rowData={rowData} disabled={false} />
    ) : (
      <ActionItems rowData={rowData} disabled={true} />
    );
  };

  const ActionItems = ({ disabled = false, rowData }) => {
    return (
      <Grid container spacing={3}>
        <Grid item>
          <Tooltip title="Edit field data">
            <Button
              size="small"
              variant="contained"
              startIcon={<Edit />}
              color={isDarkTheme ? 'primary' : 'default'}
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  dispatch(setEditModalOpen(true));
                  dispatch(setEditModalData(rowData));
                }
              }}
            >
              Edit Data
            </Button>
          </Tooltip>
        </Grid>
        {activeSites ? (
          <>
            <Grid item>
              <Tooltip title="Edit Protocol Enrollments">
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<CheckBox />}
                  color={isDarkTheme ? 'primary' : 'default'}
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled) {
                      dispatch(setEditProtocolsModalOpen(true));
                      dispatch(setEditProtocolsModalData(rowData));
                    }
                  }}
                >
                  Edit Protocols
                </Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Reassign a new site">
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Edit />}
                  color={isDarkTheme ? 'primary' : 'default'}
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled) {
                      dispatch(setReassignSiteModalOpen(rowData));
                      dispatch(setReassignSiteModalData(rowData));
                      dispatch(setEditSite(true));
                    }
                  }}
                >
                  Reassign Site
                </Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Unenroll this site">
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<DeleteForever />}
                  color={isDarkTheme ? 'primary' : 'default'}
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled) {
                      dispatch(setUnenrollOpen(true));
                      dispatch(setUnenrollRowData(rowData));
                    }
                  }}
                >
                  Unenroll
                </Button>
              </Tooltip>
            </Grid>
          </>
        ) : (
          <></>
        )}
      </Grid>
    );
  };

  const CreateNewIssue = ({ rowData }) => {
    return (
      <Tooltip title="Submit a new issue">
        <Button
          startIcon={<QuestionAnswer />}
          size="small"
          variant="contained"
          color={isDarkTheme ? 'primary' : 'default'}
          onClick={() => {
            dispatch(setShowNewIssueDialog(true));
            dispatch(setNewIssueData(rowData));
          }}
        >
          Comment
        </Button>
      </Tooltip>
    );
  };

  const RenderLatLongMap = ({ rowData }) => {
    const latLongNotPresent = rowData.latlng !== '' && rowData.latlng !== '-999' ? false : true;

    return (
      <Tooltip
        title={latLongNotPresent ? 'Lat, long data not available' : 'View this field on a map'}
      >
        <span>
          <Button
            size="small"
            disabled={latLongNotPresent}
            startIcon={<Search />}
            variant="contained"
            color={isDarkTheme ? 'primary' : 'default'}
            onClick={() => {
              if (!latLongNotPresent) {
                dispatch(
                  setMapModalData([parseFloat(rowData.latitude), parseFloat(rowData.longitude)]),
                );
                dispatch(setMapModalOpen(true));
              }
            }}
          >
            {'Map'}
          </Button>
        </span>
      </Tooltip>
    );
  };

  return (
    <Grid
      container
      spacing={3}
      style={{
        minHeight: '10vh',
        paddingTop: '1em',
        paddingBottom: '1em',
        paddingLeft: '0.5em',
        paddingRight: '0.5em',
      }}
    >
      <Grid item xs={12}>
        <InnerTable border="0">
          <thead>
            <tr>
              <th colSpan="2" align="center">
                <Typography variant="body1">Contact Information</Typography>
              </th>
            </tr>
          </thead>
          <InnerTableBody>
            <InnerTableRow>
              <InnerTableCell>
                <Typography variant="body1">Phone Number</Typography>
              </InnerTableCell>
              <InnerTableCell>
                <Typography variant="body1">{rowData.phone}</Typography>
              </InnerTableCell>
            </InnerTableRow>
            <InnerTableRow>
              <InnerTableCell>
                <Typography variant="body1">Email</Typography>
              </InnerTableCell>
              <InnerTableCell>
                <Typography variant="body1">{rowData.email}</Typography>
              </InnerTableCell>
            </InnerTableRow>
          </InnerTableBody>
        </InnerTable>
      </Grid>
      <Grid item container spacing={3}>
        <Grid item>
          <RenderActionItems rowData={rowData} />
        </Grid>
        <Grid item>
          <CreateNewIssue rowData={rowData} />
        </Grid>
        <Grid item>
          <RenderLatLongMap rowData={rowData} />
        </Grid>
      </Grid>
    </Grid>
  );
};

RenderActionModal.propTypes = {
  rowData: PropTypes.array.isRequired,
  activeSites: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

export default RenderActionModal;
