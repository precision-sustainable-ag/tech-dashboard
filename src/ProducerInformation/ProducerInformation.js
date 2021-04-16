import React, { useState, useEffect, useContext } from "react";
import { Grid } from "@material-ui/core";
import { Context } from "../Store/Store";
import MaterialTable from "material-table";
import { bannedRoles } from "../utils/constants";
import { BannedRoleMessage, CustomLoader } from "../utils/CustomComponents";
import {
  apiPassword,
  apiURL,
  apiUsername,
  onfarmAPI,
} from "../utils/api_secret";
import { UserIsEditor } from "../utils/SharedFunctions";

import axios from "axios";
import QueryString from "qs";

const producersURL = `${onfarmAPI}/producers${
  process.env.NODE_ENV === "development" ? `?options=showtest` : ``
}`;

const tableOptions = (tableData) => ({
  padding: "dense",
  exportButton: true,
  exportFileName: "Producer Information",
  addRowPosition: "first",
  exportAllData: false,
  pageSizeOptions: [5, 10, 20, tableData.length],
  pageSize: tableData.length,
  groupRowSeparator: "  ",
  grouping: true,
  headerStyle: {
    fontWeight: "bold",
    fontFamily: "Bilo, sans-serif",
    fontSize: "0.8em",
    textAlign: "right",
    position: "sticky",
    top: 0,
  },
  rowStyle: {
    fontFamily: "Roboto, sans-serif",
    fontSize: "0.8em",
    textAlign: "right",
  },
  selection: false,
  searchAutoFocus: true,
  toolbarButtonAlignment: "left",
  actionsColumnIndex: 0,
});

const tableHeaderOptions = [
  {
    title: "Producer ID",
    field: "producer_id",
    type: "string",
    align: "right",
    editable: "never",
  },
  {
    title: "First Name",
    field: "first_name",
    type: "string",
    align: "right",
    editable: "always",
  },
  {
    title: "Last Name or Organization Name",
    field: "last_name",
    type: "string",
    align: "right",
    editable: "always",
  },
  {
    title: "Site Codes",
    field: "codes",
    type: "string",
    align: "right",
    editable: "never",
  },
  {
    title: "Years",
    field: "years",
    type: "string",
    align: "right",
    editable: "never",
  },

  {
    title: "Email",
    field: "email",
    type: "string",
    align: "right",
    editable: "always",
  },
  {
    title: "Phone",
    field: "phone",
    type: "numeric",
    align: "right",
    editable: "always",
  },
];

const ProducerInformation = (props) => {
  const [tableData, setTableData] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editModalData, setEditModalData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [state] = useContext(Context);

  useEffect(() => {
    const fetchProducers = async () => {
      let response = await fetch(producersURL, {
        headers: {
          "x-api-key": state.userInfo.apikey,
        },
      });

      return await response.json();
    };

    if (bannedRoles.includes(state.userInfo.role)) {
      setIsAuthorized(false);
    } else {
      if (state.userInfo.apikey && state.userInfo.apikey !== null) {
        setIsAuthorized(true);
        setLoading(true);
        fetchProducers()
          .then((res) => {
            let modRes = res.map((rec) => {
              return {
                ...rec,
                years: rec.years.split(".").join(", "),
                codes: rec.codes.split(".").join(", "),
              };
            });

            setTableData(modRes);
          })
          .then(() => {
            setLoading(false);
          })
          .catch((e) => {
            setLoading(false);
            console.error(e);
            setTableData([]);
          });
      } else {
        setIsAuthorized(false);
      }
    }
  }, [state.userInfo]);

  const cellEditor = (newValue, oldValue, rowData, columnDef) => {
    return new Promise((resolve, reject) => {
      // console.log(oldValue + " : " + newValue, producerId);
      console.log(rowData);
      console.log(columnDef);
      setTimeout(resolve, 1000);
    });

    // const newData = tableData.map((data) => {

    // })
  };

  return isAuthorized ? (
    <Grid container>
      {loading ? (
        <Grid item xs={12}>
          <CustomLoader />
        </Grid>
      ) : (
        <Grid item xs={12}>
          <MaterialTable
            // actions={[
            //   {
            //     icon: "edit",
            //     tooltip: "Edit Data",
            //     onClick: (e, rowData) => {
            //       setEditModalData(rowData);
            //       setEditModalOpen(true);
            //       // console.log(e);
            //     },
            //   },
            // ]}
            // cellEditable={{
            //   onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
            //     return cellEditor(newValue, oldValue, rowData, columnDef);
            //   },
            // }}
            editable={{
              // isEditable: UserIsEditor(state.userInfo.permissions)
              //   ? true
              //   : false,
              onRowUpdate: (newData, oldData) => {
                return new Promise((resolve, reject) => {
                  const { producer_id } = oldData;
                  const { email, last_name, phone, first_name } = newData;
                  // const filteredData = tableData.filter((records) => records.producer_id !== producer_id);
                  if (!producer_id) {
                    reject("Producer id missing");
                  } else {
                    const preparedData = {
                      first_name: first_name || "",
                      last_name: last_name || "",
                      email: email || "",
                      phone: phone || "",
                    };

                    axios({
                      url: `${apiURL}/api/producers/${producer_id}`,
                      method: "POST",
                      data: QueryString.stringify(preparedData),
                      auth: {
                        username: apiUsername,
                        password: apiPassword,
                      },
                    })
                      .then((res) => {
                        if (res.data.data) {
                          const dataUpdate = [...tableData];
                          const index = oldData.tableData.id;
                          dataUpdate[index] = newData;
                          setTableData([...dataUpdate]);
                        }
                      })
                      .then(() => {
                        resolve();
                      })
                      .catch((e) => {
                        reject(e);
                      });
                  }
                });
              },
            }}
            columns={tableHeaderOptions}
            data={tableData}
            title="Producer Information"
            options={tableOptions(tableData)}
          />
        </Grid>
      )}
    </Grid>
  ) : (
    <BannedRoleMessage title="Producer Information" />
  );
};

export default ProducerInformation;
