/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
// Dependency Imports
import React, { useContext, useState, useEffect } from 'react';
// import Axios from "axios";
import Loading from 'react-loading';
import { Grid, Typography, Button, Tooltip, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import MaterialTable from 'material-table';
import { Edit, DeleteForever, Search, QuestionAnswer } from '@material-ui/icons';

// Local Imports
import { Context } from '../Store/Store';
import { bannedRoles } from '../utils/constants';
import EditDataModal from './EditDataModal';
import UnenrollSiteModal from './UnenrollSiteModal';
import NewIssueModal from './NewIssueModal';
import ReassignDataModal from './ReassignDataModal';
import { BannedRoleMessage } from '../utils/CustomComponents';
import { onfarmAPI } from '../utils/api_secret';
import { UserIsEditor } from '../utils/SharedFunctions';
import MapModal from './MapModal';
import { useAuth0 } from '../Auth/react-auth0-spa';
import styled from 'styled-components';

const siteInfoAPI_URL = `${onfarmAPI}/raw?output=json&table=site_information${
  process.env.NODE_ENV === 'development' ? `&options=showtest` : ``
}`;

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

const tableHeaderOptions = [
  {
    title: 'Code',
    field: 'code',
    type: 'string',
    align: 'justify',
  },
  {
    title: 'Cash Crop',
    field: 'cash_crop',
    type: 'string',
    align: 'justify',
  },
  {
    title: 'Grower',
    field: 'last_name',
    type: 'string',
    align: 'justify',
  },
  {
    title: 'Affiliation',
    field: 'affiliation',
    type: 'string',
    align: 'justify',
    defaultGroupOrder: 0,
  },
  {
    title: 'County',
    field: 'county',
    type: 'string',
    align: 'justify',
  },
  {
    title: 'Year',
    field: 'year',
    type: 'numeric',
    align: 'justify',
    defaultGroupOrder: 1,
    defaultGroupSort: 'desc',
  },
  {
    title: 'Field Address',
    field: 'address',
    type: 'string',
    align: 'justify',
  },
  {
    title: 'Notes',
    field: 'notes',
    type: 'string',
    align: 'justify',
  },
];
// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/**
 * Site information table component
 */

// Default function
const AllDataTable = () => {
  const [state] = useContext(Context);
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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState({});

  const [reassignSiteModalOpen, setReassignSiteModalOpen] = useState(false);
  const [reassignSiteModalData, setReassignSiteModalData] = useState({});

  const [unenrollRowData, setUnenrollRowData] = useState({});
  const [unenrollOpen, setUnenrollOpen] = useState(false);

  const [valuesEdited, setValuesEdited] = useState(false);
  // const [siteRemoved, setSiteRemoved] = useState(false);
  const [showNewIssueDialog, setShowNewIssueDialog] = useState(false);
  const [newIssueData, setNewIssueData] = useState({});

  const handleEditModalClose = () => {
    setEditModalOpen(!editModalOpen);
  };
  const handleUnenrollClose = () => {
    setUnenrollOpen(!unenrollOpen);
  };
  const handleReassignSiteModalClose = () => {
    setReassignSiteModalOpen(!reassignSiteModalOpen);
  };

  // fetch height from useWindowDimensions hook
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
            res
              .then((records) => {
                return parseXHRResponse({ status: 'success', data: records });
              })
              .then((resp) => {
                if (resp) {
                  setLoading(false);
                } else {
                  setLoading(true);
                  console.log('Check API');
                }
              });
            setValuesEdited(false);
          });
        }
      }
    };

    init();
  }, [state.userInfo, valuesEdited]);

  // useEffect(() => {
  //   function init() {
  //     if (valuesEdited) {
  //       setBannedRolesCheckMessage("Updating database..");
  //     }
  //     if (state.userInfo.state) {
  //       setLoading(true);
  //       let returnData = getAllTableData(
  //         `${apiURL}/api/tablerecords/${state.userInfo.state}`
  //       );

  //       returnData
  //         .then((responseData) => {
  //           return parseXHRResponse(responseData.data);
  //         })
  //         .then((resp) => {
  //           if (resp) {
  //             setLoading(false);
  //           } else {
  //             setLoading(true);
  //             console.log("Check API");
  //           }
  //         })
  //         .catch((error) => {
  //           if (error.response) {
  //             // The request was made and the server responded with a status code
  //             // that falls out of the range of 2xx
  //             console.log(error.response.data);
  //             console.log(error.response.status);
  //             console.log(error.response.headers);
  //           } else if (error.request) {
  //             // The request was made but no response was received
  //             // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
  //             // http.ClientRequest in node.js
  //             console.log(error.request);
  //           } else {
  //             // Something happened in setting up the request that triggered an Error
  //             console.log("Error", error.message);
  //           }
  //           console.log(error.config);
  //         });
  //     }

  //     if (state.userInfo.role) {
  //       if (bannedRoles.includes(state.userRole)) {
  //         setShowTable(false);
  //         setBannedRolesCheckMessage(
  //           <BannedRoleMessage title="All Contact and Location" />
  //         );
  //       } else {
  //         setShowTable(true);
  //       }
  //     }
  //   }

  //   setTimeout(init, 1000);
  // }, [state.userInfo, valuesEdited, state.userRole]);

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
        <Grid container>
          <Grid item lg={12}>
            <MaterialTable
              detailPanel={[
                {
                  tooltip: 'Expand Actions Panel',

                  render: (rowData) => {
                    return <RenderActionsPanel rowData={rowData} />;
                  },
                },
              ]}
              columns={tableHeaderOptions}
              data={tableData}
              title="Contact and Location"
              options={{
                defaultExpanded: true,
                padding: 'default',
                exportButton: false,
                exportFileName: 'Contact and Location',
                addRowPosition: 'last',
                exportAllData: false,
                // pageSizeOptions: [5, 10, 20, 50, tableData.length],
                pageSize: tableData.length,
                groupRowSeparator: '  ',
                grouping: true,
                headerStyle: {
                  fontWeight: 'bold',
                  fontFamily: 'Bilo, sans-serif',
                  fontSize: '0.8em',
                  textAlign: 'left',
                  position: 'sticky',
                  top: 0,
                },
                rowStyle: {
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: '0.8em',
                  textAlign: 'left',
                },
                selection: false,
                searchAutoFocus: true,
                toolbarButtonAlignment: 'left',
                actionsColumnIndex: 1,
                maxBodyHeight: height * 0.7,
              }}
            />
          </Grid>
        </Grid>
        <EditDataModal
          open={editModalOpen}
          handleEditModalClose={handleEditModalClose}
          data={editModalData}
          edit={setEditModalData}
          valuesEdited={valuesEdited}
          setValuesEdited={setValuesEdited}
        />
        <ReassignDataModal
          open={reassignSiteModalOpen}
          handleEditModalClose={handleReassignSiteModalClose}
          data={reassignSiteModalData}
          setValuesEdited={setValuesEdited}
        />
        <UnenrollSiteModal
          open={unenrollOpen}
          data={unenrollRowData}
          handleUnenrollClose={handleUnenrollClose}
          setValuesEdited={setValuesEdited}
        />
        <NewIssueModal
          open={showNewIssueDialog}
          handleNewIssueDialogClose={() => {
            setShowNewIssueDialog(!showNewIssueDialog);
          }}
          data={newIssueData}
          setSnackbarData={setSnackbarData}
          snackbarData={snackbarData}
          nickname={user.nickname}
        />
        <MapModal
          open={mapModalOpen}
          setOpen={setMapModalOpen}
          lat={mapModalData[0]}
          lng={mapModalData[1]}
        />
      </div>
    )
  ) : (
    bannedRolesCheckMessage
  );
};

export default AllDataTable;
