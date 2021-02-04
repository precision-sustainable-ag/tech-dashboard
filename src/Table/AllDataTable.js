// Dependency Imports
import React, { useContext, useState, useEffect } from "react";
import Axios from "axios";
import Loading from "react-loading";
import {
  Grid,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import MaterialTable from "material-table";
import { GpsFixed, Edit, DeleteForever, Search } from "@material-ui/icons";

// Local Imports
import { Context } from "../Store/Store";
import { bannedRoles } from "../utils/constants";
import EditDataModal from "./EditDataModal";
import UnenrollSiteModal from "./UnenrollSiteModal";
import NewIssueDialog from "./NewIssueModal";
import { BannedRoleMessage } from "../utils/CustomComponents";
import { apiUsername, apiPassword, apiURL } from "../utils/api_secret";
import { UserIsEditor, useWindowResize } from "../utils/SharedFunctions";
import MapModal from "./MapModal";

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// Default function
const AllDataTable = (props) => {
  const [state, dispatch] = useContext(Context);
  const [showTable, setShowTable] = useState(false);
  const [bannedRolesCheckMessage, setBannedRolesCheckMessage] = useState(
    "Checking your permissions.."
  );
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarData, setSnackbarData] = useState({ open: false, text: "" });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState({});

  const [unenrollRowData, setUnenrollRowData] = useState({});
  const [unenrollOpen, setUnenrollOpen] = useState(false);

  const [valuesEdited, setValuesEdited] = useState(false);
  const [siteRemoved, setSiteRemoved] = useState(false);
  const [showNewIssueDialog, setShowNewIssueDialog] = useState(false);
  const [newIssueData, setNewIssueData] = useState({});

  const handleEditModalClose = () => {
    setEditModalOpen(!editModalOpen);
  };
  const handleUnenrollClose = () => {
    setUnenrollOpen(!unenrollOpen);
  };
  const { height } = useWindowResize();
  useEffect(() => {
    function init() {
      if (valuesEdited) {
        setBannedRolesCheckMessage("Updating database..");
      }
      if (state.userInfo.state) {
        setLoading(true);
        let returnData = getAllTableData(
          `${apiURL}/api/tablerecords/${state.userInfo.state}`
        );
        returnData
          .then((responseData) => {
            return parseXHRResponse(responseData.data);
          })
          .then((resp) => {
            if (resp) {
              setLoading(false);
            } else {
              setLoading(true);
              console.log("Check API");
            }
          })
          .catch((error) => {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error", error.message);
            }
            console.log(error.config);
          });
      }

      if (state.userInfo.role) {
        if (bannedRoles.includes(state.userRole)) {
          setShowTable(false);
          setBannedRolesCheckMessage(
            <BannedRoleMessage title="All Site Information" />
          );
        } else {
          setShowTable(true);
        }
      }
    }

    setTimeout(init, 1000);
  }, [state.userInfo, valuesEdited, state.userRole]);

  const parseXHRResponse = (data) => {
    if (data.status === "success") {
      let responseData = data.data;
      let modifiedData = responseData.map((data) => {
        return {
          ...data,
          // county: data.county ? data.county : "Not Provided",
          // email: data.email ? data.email : "Not Provided",
          // address: data.address ? data.address : "Not Provided",
          latlng:
            data.latitude !== null && data.longitude !== null
              ? data.latitude !== "-999" && data.longitude !== "-999"
                ? `${data.latitude},${data.longitude}`
                : "-999"
              : "",
        };
      });

      let finalData = modifiedData.filter((data) => {
        if (
          data.additional_contact === "-999" ||
          data.county === "-999" ||
          data.email === "-999" ||
          data.address === "-999" ||
          data.latlng === "-999" ||
          data.notes === "-999" ||
          data.state === "-999"
        ) {
          return false;
        } else return true;
      });
      setTableData(finalData);
      return true;
    } else {
      return false;
    }
  };

  const getAllTableData = async (url) => {
    return await Axios({
      url: url,
      method: "get",
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mapModalData, setMapModalData] = useState([]);

  return showTable ? (
    loading ? (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Loading type="bars" width="200px" height="200px" color="#3f51b5" />
      </div>
    ) : (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          open={snackbarData.open}
          autoHideDuration={2000}
          onClose={() =>
            setSnackbarData({ ...snackbarData, open: !snackbarData.open })
          }
        >
          <Alert severity="success">{snackbarData.text}</Alert>
        </Snackbar>
        <Grid container>
          <Grid item lg={12}>
            <MaterialTable
              // detailPanel={[
              //   {
              //     tooltip: "Show Details",
              //     render: (rowData) => {
              //       return <>{rowData.address}</>;
              //     },
              //   },
              // ]}
              columns={[
                UserIsEditor()
                  ? {
                      title: "Actions",
                      render: (rowData) => (
                        <div>
                          <IconButton
                            onClick={() => {
                              // console.log(rowData);
                              setEditModalOpen(true);
                              setEditModalData(rowData);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              // console.log(rowData);
                              setUnenrollOpen(true);
                              setUnenrollRowData(rowData);
                            }}
                          >
                            <DeleteForever />
                          </IconButton>
                        </div>
                      ),
                      sorting: false,
                      grouping: false,
                    }
                  : {
                      title: "Actions",
                      render: (rowData) => (
                        <div>
                          <IconButton disabled>
                            <Edit />
                          </IconButton>
                          <IconButton disabled>
                            <DeleteForever />
                          </IconButton>
                        </div>
                      ),
                      sorting: false,
                      grouping: false,
                    },
                { title: "Code", field: "code", type: "string" },
                { title: "Grower", field: "last_name", type: "string" },
                { title: "State", field: "affiliation", type: "string" },
                { title: "County", field: "county", type: "string" },
                { title: "Email", field: "email", type: "string" },
                { title: "Year", field: "year" },
                { title: "Field Address", field: "address" },
                {
                  title: "Lat, Long",
                  field: "latlng",
                  render: (rowData) =>
                    rowData.latlng !== "" ? (
                      rowData.latlng !== "-999" ? (
                        <Button
                          size="small"
                          startIcon={<Search />}
                          variant="contained"
                          // href={`https://earth.google.com/web/search/${rowData.latlng}/@${rowData.latlng},75.78141996a,870.41248089d,35y,0h,45t,0r/data=ClQaKhIkGa36XG3FbkBAIVRSJ6CJkFTAKhAzMi44NjU0LC04Mi4yNTg0GAIgASImCiQJzF-JvuFuOEARyF-JvuFuOMAZThRMqkU0RMAh9HZjS910YsAoAg`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            setMapModalData([
                              parseFloat(rowData.latitude),
                              parseFloat(rowData.longitude),
                            ]);
                            setMapModalOpen(true);
                          }}
                        >
                          {"Map"}
                        </Button>
                      ) : (
                        "-999"
                      )
                    ) : (
                      ""
                    ),
                  sorting: false,
                  grouping: false,
                },
                { title: "Notes", field: "notes" },
                {
                  title: "Issue",
                  render: (rowData) => {
                    return (
                      <Tooltip
                        title={
                          <Typography variant="body2">
                            Submit a new issue
                          </Typography>
                        }
                        placement="bottom"
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            setShowNewIssueDialog(true);
                            setNewIssueData(rowData);
                          }}
                        >
                          Comment
                        </Button>
                      </Tooltip>
                    );
                  },
                },
              ]}
              data={tableData}
              title="Site Information"
              options={{
                exportButton: true,
                exportFileName: "Site Information",
                addRowPosition: "last",
                exportAllData: true,
                pageSize: tableData.length,
                // pageSizeOptions: [5, 10, 20, 50, tableData.length],
                groupRowSeparator: "  ",
                grouping: true,
                headerStyle: {
                  fontWeight: "bold",
                  fontFamily: "Bilo, sans-serif",
                  fontSize: "0.8em",
                  textAlign: "left",
                  position: "sticky",
                  top: 0,
                },
                rowStyle: {
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "0.8em",
                  textAlign: "left",
                },
                selection: false,
                searchAutoFocus: true,
                toolbarButtonAlignment: "left",
                actionsColumnIndex: 1,
                maxBodyHeight: height - 48,
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
        <UnenrollSiteModal
          open={unenrollOpen}
          data={unenrollRowData}
          handleUnenrollClose={handleUnenrollClose}
          setValuesEdited={setValuesEdited}
        />
        <NewIssueDialog
          open={showNewIssueDialog}
          handleNewIssueDialogClose={() => {
            setShowNewIssueDialog(!showNewIssueDialog);
          }}
          data={newIssueData}
          setSnackbarData={setSnackbarData}
          snackbarData={snackbarData}
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
