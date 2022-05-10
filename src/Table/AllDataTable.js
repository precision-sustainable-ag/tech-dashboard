/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
// Dependency Imports
import React, { useContext, useState, useEffect } from 'react';
// import Axios from "axios";
import Loading from 'react-loading';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
// import MaterialTable from 'material-table';
// import { Edit, DeleteForever, Search, QuestionAnswer, Store } from '@material-ui/icons';

// Local Imports
import { Context } from '../Store/Store';
import { bannedRoles } from '../utils/constants';
import EditDataModal from './EditDataModal';
import UnenrollSiteModal from './UnenrollSiteModal';
import NewIssueModal from './NewIssueModal';
import ReassignDataModal from './ReassignDataModal';
import MapModal from './MapModal';
// import FeatureModal from './FeatureModal'; 
import { BannedRoleMessage } from '../utils/CustomComponents';
import { onfarmAPI } from '../utils/api_secret';
// import { UserIsEditor } from '../utils/SharedFunctions';
import { useAuth0 } from '../Auth/react-auth0-spa';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import TableModal from './TableModal';
const siteInfoAPI_URL = `${onfarmAPI}/raw?output=json&table=site_information${
  process.env.NODE_ENV === 'development' ? `&options=showtest` : ``
}`;

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/**
 * Site information table component
 */

// Default function
const AllDataTable = (props) => {
  const [state, dispatch] = useContext(Context);
  const [showTable, setShowTable] = useState(false);
  const { user } = useAuth0();
  const [bannedRolesCheckMessage, setBannedRolesCheckMessage] = useState(
    'Checking your permissions..',
  );
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: '',
    severity: 'success',
  });

  let height = window.innerHeight;

  // scale height
  if (height < 900 && height > 600) {
    height -= 130;
  } else if (height < 600) {
    height -= 200;
  }

  useEffect(() => {
    const init = () => {
      if (Object.keys(state.userInfo).length > 0) {
        if (state.userInfo.role) {
          if (bannedRoles.includes(state.userInfo.role)) {
            setShowTable(false);
            setBannedRolesCheckMessage(<BannedRoleMessage title="All Contact and Location" />);
          } else {
            setShowTable(true);
          }
        }
        if (state.userInfo.apikey) {
          let records = fetch(siteInfoAPI_URL, {
            headers: {
              'x-api-key': state.userInfo.apikey,
            },
          });

          records.then((response) => {
            let res = response.json();
            console.log(res);
            res
              .then((records) => {
                return parseXHRResponse({ status: 'success', data: records });
              })
              .then((resp) => {
                if (resp) {
                  console.log(resp);
                  setLoading(false);
                } else {
                  setLoading(true);
                  console.log('Check API');
                }
              });
              dispatch({
                type: 'SET_VALUES_EDITED',
                data: {
                  valuesEdited: false,
                },        
              });
          });
        }
      }
    };

    init();
  }, [state.userInfo, state.valuesEdited]);

  const parseXHRResponse = (data) => {
    if (data.status === 'success') {
      let responseData = data.data;
      let modifiedData = responseData.map((data) => {
        return {
          ...data,
          // county: data.county ? data.county : "Not Provided",
          // email: data.email ? data.email : "Not Provided",
          // address: data.address ? data.address : "Not Provided",
          latlng:
            data.latitude !== null && data.longitude !== null
              ? data.latitude !== '-999' && data.longitude !== '-999'
                ? `${data.latitude},${data.longitude}`
                : '-999'
              : '',
          year: parseInt(data.year),
        };
      });

      let finalData = modifiedData.filter((data) => {
        if (data.protocols_enrolled === '-999') {
          return false;
        } else return true;
      });
      setTableData(finalData);
      return true;
    } else {
      return false;
    }
  };
  // const getAllTableData = async (url) => {
  //   return await Axios({
  //     url: url,
  //     method: "get",
  //     auth: {
  //       username: apiUsername,
  //       password: apiPassword,
  //     },
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  // };

  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mapModalData, setMapModalData] = useState([]);

  const ActionItems = ({ disabled = false, rowData }) => {
    return (
      <Grid container spacing={3}>
        <Grid item>
          {state.userInfo.view_type === 'home' && (
            <Tooltip title="Edit field data">
              <Button
                size="small"
                variant="contained"
                startIcon={<Edit />}
                color={state.isDarkTheme ? 'primary' : 'default'}
                disabled={disabled}
                onClick={() => {
                  if (!disabled) {
                    setEditModalOpen(true);
                    setEditModalData(rowData);
                  }
                }}
              >
                Edit Data
              </Button>
            </Tooltip>
          )}
        </Grid>
        <Grid item>
          <Tooltip title="Reassign a new site">
            <Button
              size="small"
              variant="contained"
              startIcon={<Edit />}
              color={state.isDarkTheme ? 'primary' : 'default'}
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  setReassignSiteModalOpen(true);
                  setReassignSiteModalData(rowData);
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
              color={state.isDarkTheme ? 'primary' : 'default'}
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  setUnenrollOpen(true);
                  setUnenrollRowData(rowData);
                }
              }}
            >
              Unenroll
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    );
  };
  const RenderActionItems = ({ rowData }) => {
    return UserIsEditor() ? (
      <ActionItems rowData={rowData} disabled={false} />
    ) : (
      <ActionItems rowData={rowData} disabled={true} />
    );
  };
  const CreateNewIssue = ({ rowData }) => {
    return (
      <Tooltip title="Submit a new issue">
        <Button
          startIcon={<QuestionAnswer />}
          size="small"
          variant="contained"
          color={state.isDarkTheme ? 'primary' : 'default'}
          onClick={() => {
            setShowNewIssueDialog(true);
            setNewIssueData(rowData);
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
            color={state.isDarkTheme ? 'primary' : 'default'}
            onClick={() => {
              if (!latLongNotPresent) {
                setMapModalData([parseFloat(rowData.latitude), parseFloat(rowData.longitude)]);
                setMapModalOpen(true);
              }
            }}
          >
            {'Map'}
          </Button>
        </span>
      </Tooltip>
    );
  };

  const RenderActionsPanel = ({ rowData }) => {
    // const filteredByValue = Object.fromEntries(
    //   Object.entries(rowData).filter(
    //     ([key, value]) => value === "" || value === "-999" || value === null
    //   )
    // );

    // let blankEntities = Object.keys(filteredByValue).join(",").split(",");
    // blankEntities =
    //   blankEntities.length > 1
    //     ? blankEntities.map((e, i) =>
    //         i === blankEntities.length - 1 ? ` and ${e}` : `${e}, `
    //       )
    //     : blankEntities.toString();
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
        {/* <Grid item container>
          {Object.keys(filteredByValue).length > 0 ? (
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2" align="center">
                  No record for <strong>{blankEntities}</strong>
                </Typography>
              </Alert>
            </Grid>
          ) : (
            ""
          )}
        </Grid> */}
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
        <Grid
          item
          container
          spacing={3}
          // justifyContent="space-evenly"
          // alignContent="center"
          // alignItems="center"
        >
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

  return showTable ? (
    loading ? (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Loading type="bars" width="200px" height="200px" color="#3f51b5" />
      </div>
    ) : (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={snackbarData.open}
          autoHideDuration={10000}
          onClose={() => setSnackbarData({ ...snackbarData, open: !snackbarData.open })}
        >
          <Alert severity={snackbarData.severity}>{snackbarData.text}</Alert>
        </Snackbar>
        <TableModal 
          tableData={tableData}
          isDarkTheme={props.isDarkTheme}
          height={height}
          activeSites={true}
          tableTitle={"Contact and Location"}
        />
        <EditDataModal />
        <ReassignDataModal />
        <UnenrollSiteModal />
        <NewIssueModal
          setSnackbarData={setSnackbarData}
          snackbarData={snackbarData}
          nickname={user.nickname}
        />
        <MapModal />
      </div>
    )
  ) : (
    bannedRolesCheckMessage
  );
};

AllDataTable.propTypes = {
  /** Is dark theme enabled? */
};

export default AllDataTable;