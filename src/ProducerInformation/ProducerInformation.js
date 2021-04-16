import React, { useState, useEffect, useContext } from "react";
import { Grid } from "@material-ui/core";
import { Context } from "../Store/Store";
import MaterialTable from "material-table";
import { bannedRoles } from "../utils/constants";
import { BannedRoleMessage, CustomLoader } from "../utils/CustomComponents";
import { onfarmAPI } from "../utils/api_secret";
import { UserIsEditor } from "../utils/SharedFunctions";
import EditProducerModal from "./EditProducerModal";

const tableHeaderOptions = [
  {
    title: "Producer ID",
    field: "producer_id",
    type: "string",
    align: "justify",
  },
  {
    title: "Last Name or Organization/Corporation Name",
    field: "name",
    type: "string",
    align: "justify",
  },
  {
    title: "Site Codes",
    field: "codes",
    type: "string",
    align: "justify",
  },
  {
    title: "Years",
    field: "years",
    type: "string",
    align: "justify",
  },

  {
    title: "Email",
    field: "email",
    type: "string",
    align: "justify",
  },
  {
    title: "Phone",
    field: "phone",
    type: "numeric",
    align: "justify",
  },
];

const ProducerInformation = (props) => {
  const [tableData, setTableData] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editModalData, setEditModalData] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [state] = useContext(Context);

  useEffect(() => {
    const fetchProducers = async () => {
      let response = await fetch(`${onfarmAPI}/producers`, {
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
                name: rec.first_name
                  ? rec.last_name + rec.first_name
                  : rec.last_name,
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

            throw new Error(e);
          });
      } else {
        setIsAuthorized(false);
      }
    }
  }, [state.userInfo]);

  let height = window.innerHeight;

  // scale height
  if (height < 900 && height > 600) {
    height -= 130;
  } else if (height < 600) {
    height -= 200;
  }

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
            columns={tableHeaderOptions}
            data={tableData}
            title="Producer Information"
            options={{
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
              actionsColumnIndex: 0,
              actionsColumnIndex: 1,
              maxBodyHeight: height * 0.7,
            }}
          />
        </Grid>
      )}
      <EditProducerModal
        open={editModalOpen}
        setOpen={setEditModalOpen}
        data={editModalData}
        setData={setEditModalData}
      />
    </Grid>
  ) : (
    <BannedRoleMessage title="Producer Information" />
  );
};

export default ProducerInformation;
