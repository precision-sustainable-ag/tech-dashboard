import React, { useEffect, useContext, useState } from "react";
import { forwardRef } from "react";
import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { Context } from "../Store/Store";
import Axios from "axios";
import { useAuth0 } from "../Auth/react-auth0-spa";
// import ReactLoading from "react-loading";
// import AddIcon from "@material-ui/icons/Add";

// import { Fab } from "@material-ui/core";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const TableComponent = () => {
  const [state, dispatch] = useContext(Context);
  const [tableState, setTableState] = useState(true);
  const { user } = useAuth0();
  useEffect(() => {
    console.log("hello from table");
    console.log(user);
    if (state.site_information.length === 0) {
      fetchRecords(`http://13.72.51.225/api/?tablerecords=all`).then(() => {
        setTableState(false);
      });
    } else {
      setTableState(false);
    }
  }, [tableState]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRecords = async apiURL => {
    await Axios.get(apiURL).then(response => {
      let data = response.data;
      dispatch({
        type: "SET_SITE_INFO",
        data: data
      });
      //   console.log(response);
    });
  };

  const setTableRecordFormat = () => {
    console.log("inside table record function", state);
    state.site_information.map((site, index) => {
      console.log("site", site);
      let grower = site.last_name;
      let county = site.county;
      let email = site.email;
      let address = site.address;
      let latlng = `${site.latitude}, ${site.longitude}`;
      let notes = site.notes;
      let obj = {
        grower: grower,
        county: county,
        email: email,
        address: address,
        latlng: latlng,
        notes: notes
      };
      let arr = [];
      console.log(obj);
      arr.push(obj);
      setTableState(arr);
    });
  };
  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        isLoading={tableState}
        editable={{
          isEditable: rowData => rowData.state === "MD", // only name(a) rows would be editable
          isDeletable: false,
          //   isDeletable: rowData => rowData.name === "b", // only name(a) rows would be deletable
          onRowAdd: newData => {
            // console.log(newData);
            // new Promise((resolve, reject) => {
            //   setTimeout(() => {
            //     {
            //       /* const data = this.state.data;
            //                 data.push(newData);
            //                 this.setState({ data }, () => resolve()); */
            //       dispatch(
            //         {
            //           type: "ADD_ONE_SITE_INFO_TO_STATE",
            //           data: newData
            //         },
            //         () => resolve()
            //       );
            //     }
            //     resolve();
            //   }, 1000);
            // });
          }

          //   onRowUpdate: (newData, oldData) =>
          //     new Promise((resolve, reject) => {
          //       setTimeout(() => {
          //         {
          //           /* const data = this.state.data;
          //                     const index = data.indexOf(oldData);
          //                     data[index] = newData;
          //                     this.setState({ data }, () => resolve()); */
          //         }
          //         resolve();
          //       }, 1000);
          //     }),
          //   onRowDelete: oldData =>
          //     new Promise((resolve, reject) => {
          //       setTimeout(() => {
          //         {
          //           /* let data = this.state.data;
          //                     const index = data.indexOf(oldData);
          //                     data.splice(index, 1);
          //                     this.setState({ data }, () => resolve()); */
          //         }
          //         resolve();
          //       }, 1000);
          //     })
        }}
        icons={tableIcons}
        // onRowClick={(evt, selectedRow) => {
        //   console.log(selectedRow);
        // }}
        // onRowSelected={(evt, selectRow) => {
        //   console.log(selectRow);
        // }}
        columns={[
          { title: "Code", field: "code" },
          { title: "Grower", field: "grower" },
          { title: "State", field: "state" },
          { title: "County", field: "county" },
          { title: "Email", field: "email" },
          { title: "Year", field: "year" },
          //   { title: "Email", field: "birthYear", type: "email" },
          { title: "Address", field: "address" },
          { title: "Lat, Long", field: "latlng" },
          { title: "Notes", field: "notes" }
          //   {
          //     title: "Doğum Yeri",
          //     field: "birthCity",
          //     lookup: { 34: "İstanbul", 63: "Şanlıurfa" }
          //   }
        ]}
        // data={state.site_information.length !== 0 ? state.site_information : {}}
        data={state.site_information}
        title="Data Table"
        options={{
          exportButton: true,
          //   defaultExpanded: true,
          exportFileName: "Site Information",
          addRowPosition: "last",
          exportAllData: true,
          pageSize: 10,
          pageSizeOptions: [5, 10, 20, 50, 100],
          groupRowSeparator: "  ",
          grouping: true
        }}
      />
      {/* )} */}
    </div>
  );
};

export default TableComponent;
