import React, { useContext, useState, useEffect } from "react";
import { Context } from "../Store/Store";
import { bannedRoles } from "../utils/constants";
import Axios from "axios";
import { apiUsername, apiPassword, apiURL } from "../utils/api_secret";
import Loading from "react-loading";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Link,
  Button,
  IconButton,
  Dialog,
  TextField,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import MaterialTable from "material-table";
import { BannedRoleMessage } from "../utils/CustomComponents";
import { GpsFixed, Edit } from "@material-ui/icons";
import EditDataModal from "./EditDataModal";

const AllDataTable = (props) => {
  const [state, dispatch] = useContext(Context);
  const [states, setStates] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [bannedRolesCheckMessage, setBannedRolesCheckMessage] = useState(
    "Checking your permissions.."
  );
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState({});
  const [valuesEdited, setValuesEdited] = useState(false);

  const handleEditModalClose = () => {
    setEditModalOpen(!editModalOpen);
  };

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

    setTimeout(init, 2000);
  }, [state.userInfo, valuesEdited]);

  const parseXHRResponse = (data) => {
    if (data.status === "success") {
      let responseData = data.data;

      let modifiedData = responseData.map((data) => {
        return {
          ...data,
          latlng:
            data.latitude !== null && data.longitude !== null
              ? `${data.latitude},${data.longitude}`
              : "",
        };
      });
      setTableData(modifiedData);
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

  return showTable ? (
    loading ? (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Loading type="bars" width="200px" height="200px" color="#3f51b5" />
      </div>
    ) : (
      <div>
        <Grid container>
          <Grid item lg={12}>
            <MaterialTable
              columns={[
                {
                  title: "Edit",
                  render: (rowData) => (
                    <IconButton
                      onClick={() => {
                        console.log(rowData);
                        setEditModalOpen(true);
                        setEditModalData(rowData);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  ),
                  sorting: false,
                  grouping: false,
                },
                { title: "Code", field: "code" },
                { title: "Grower", field: "last_name" },
                { title: "State", field: "affiliation" },
                { title: "County", field: "county" },
                { title: "Email", field: "email" },
                { title: "Year", field: "year" },
                { title: "Address", field: "address" },
                {
                  title: "Lat, Long",
                  field: "latlng",
                  render: (rowData) =>
                    rowData.latlng !== "" ? (
                      <Button
                        startIcon={<GpsFixed />}
                        variant="contained"
                        href={`https://earth.google.com/web/search/${rowData.latlng}/@${rowData.latlng},75.78141996a,870.41248089d,35y,0h,45t,0r/data=ClQaKhIkGa36XG3FbkBAIVRSJ6CJkFTAKhAzMi44NjU0LC04Mi4yNTg0GAIgASImCiQJzF-JvuFuOEARyF-JvuFuOMAZThRMqkU0RMAh9HZjS910YsAoAg`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {rowData.latlng}
                      </Button>
                    ) : (
                      ""
                    ),
                  sorting: false,
                  grouping: false,
                },
                { title: "Notes", field: "notes" },
                //   {
                //     title: "Doğum Yeri",
                //     field: "birthCity",
                //     lookup: { 34: "İstanbul", 63: "Şanlıurfa" }
                //   }
              ]}
              data={tableData}
              title="Site Information"
              options={{
                exportButton: true,
                exportFileName: "Site Information",
                addRowPosition: "last",
                exportAllData: true,
                pageSize: 10,
                pageSizeOptions:
                  tableData.length <= 50
                    ? [5, 10, 20, 50]
                    : tableData.length > 50 && tableData.length <= 100
                    ? [5, 10, 20, 50, tableData.length]
                    : [5, 10, 20, 50, 100, tableData.length],
                // pageSizeOptions: [5, 10, 20, 50, tableData.length],
                groupRowSeparator: "  ",
                grouping: true,
                headerStyle: {
                  fontWeight: "bold",
                  fontFamily: "Roboto, sans-serif",
                  fontSize: "1em",
                  textAlign: "left",
                },
                selection: false,
                searchAutoFocus: true,
                toolbarButtonAlignment: "left",
                maxBodyHeight: "750px",
                // fixedColumns: {
                //   left: 1,
                // },
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
      </div>
    )
  ) : (
    bannedRolesCheckMessage
  );
};

export default AllDataTable;
