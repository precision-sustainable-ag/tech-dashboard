import React from 'react';
// import Axios from "axios";
// import Loading from 'react-loading';
import { Grid, Typography, Button, Tooltip } from '@material-ui/core';
// import MuiAlert from '@material-ui/lab/Alert';
// import MaterialTable from 'material-table';
import { Edit, DeleteForever, Search, QuestionAnswer } from '@material-ui/icons';
// Local Imports
// import { Context } from '../Store/Store';
import { UserIsEditor } from '../utils/SharedFunctions';
// import { useAuth0 } from '../Auth/react-auth0-spa';
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
  setShowNewIssueDialog,
  setNewIssueData,
  setMapModalData,
  setMapModalOpen,
} from '../Store/actions';

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

const RenderActionModal = ({ rowData, activeSites }) => {
  // const [state, dispatch] = useContext(Context);
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
                  // dispatch({
                  //   type: 'SET_EDIT_MODAL_OPEN',
                  //   data: {
                  //     editModalOpen: true,
                  //   },
                  // });
                  dispatch(setEditModalOpen(true));

                  // setEditModalOpen(true);
                  // dispatch({
                  //   type: 'SET_EDIT_MODAL_DATA',
                  //   data: {
                  //     editModalData: rowData,
                  //   },
                  // });
                  dispatch(setEditModalData(rowData));

                  // setEditModalData(rowData);
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
              <Tooltip title="Reassign a new site">
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Edit />}
                  color={isDarkTheme ? 'primary' : 'default'}
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled) {
                      // dispatch({
                      //     type: 'SET_REASSIGN_SITE_MODAL_OPEN',
                      //     data: {
                      //     reassignSiteModalOpen: rowData,
                      //     },
                      // });
                      dispatch(setReassignSiteModalOpen(rowData));

                      // setReassignSiteModalOpen(true);
                      // dispatch({
                      //     type: 'SET_REASSIGN_SITE_MODAL_DATA',
                      //     data: {
                      //     reassignSiteModalData: rowData,
                      //     },
                      // });
                      dispatch(setReassignSiteModalData(rowData));

                      // setReassignSiteModalData(rowData);
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
                      // dispatch({
                      //     type: 'SET_UNENROLL_OPEN',
                      //     data: {
                      //     unenrollOpen: true,
                      //     },
                      // });
                      dispatch(setUnenrollOpen(true));

                      // setUnenrollOpen(true);
                      // dispatch({
                      //     type: 'SET_UNENROLL_ROWDATA',
                      //     data: {
                      //     unenrollRowData: rowData,
                      //     },
                      // });
                      dispatch(setUnenrollRowData(rowData));

                      // setUnenrollRowData(rowData);
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
            // dispatch({
            //   type: 'SET_SHOW_NEW_ISSUE_DIALOG',
            //   data: {
            //     showNewIssueDialog: true,
            //   },
            // });
            dispatch(setShowNewIssueDialog(true));

            // setShowNewIssueDialog(true);
            // dispatch({
            //   type: 'SET_NEW_ISSUE_DATA',
            //   data: {
            //     newIssueData: rowData,
            //   },
            // });
            dispatch(setNewIssueData(rowData));

            // setNewIssueData(rowData);
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
                // dispatch({
                //   type: 'SET_MAP_MODAL_DATA',
                //   data: {
                //     mapModalData: [parseFloat(rowData.latitude), parseFloat(rowData.longitude)],
                //   },
                // });
                dispatch(
                  setMapModalData([parseFloat(rowData.latitude), parseFloat(rowData.longitude)]),
                );

                // setMapModalData([parseFloat(rowData.latitude), parseFloat(rowData.longitude)]);
                // dispatch({
                //   type: 'SET_MAP_MODAL_OPEN',
                //   data: {
                //     mapModalOpen: true,
                //   },
                // });
                dispatch(setMapModalOpen(true));

                // setMapModalOpen(true);
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
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  activeSites: PropTypes.bool.isRequired,
  //   isDarkTheme: PropTypes.isRequired,
  disabled: PropTypes.bool,
};

export default RenderActionModal;
