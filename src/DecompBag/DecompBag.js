import React, { useState, useEffect, useContext } from "react";
import { Grid } from "@material-ui/core";
import { onfarmAPI } from "../utils/api_secret";
import { Context } from "../Store/Store";
import { CustomLoader } from "../utils/CustomComponents";
import MaterialTable from "material-table";
const _ = require("lodash");

const tableHeaderOptions = [
  {
    title: "Code",
    field: "code",
    type: "string",
    align: "justify",
  },
  {
    title: "Year",
    field: "year",
    type: "numeric",
    align: "justify",
  },
  {
    title: "Rep",
    field: "subplot",
    type: "string",
    align: "justify",
  },
  {
    title: "Subsample",
    field: "subsample",
    type: "string",
    align: "justify",
  },
  {
    title: "Grower",
    field: "last_name",
    type: "string",
    align: "justify",
  },
  {
    title: "Affiliation",
    field: "affiliation",
    type: "string",
    align: "justify",
  },

  {
    title: "Empty Bag Wt",
    field: "empty_bag_wt",
    type: "string",
    align: "justify",
  },
  {
    title: "Fresh Biomass Wt",
    field: "fresh_biomass_wt",
    type: "string",
    align: "justify",
  },
  {
    title: "Crucible Wt",
    field: "crucible_wt",
    type: "string",
    align: "justify",
  },
  {
    title: "Recovery Date",
    field: "recovery_date",
    type: "string",
    align: "justify",
  },
  {
    title: "Bag Weight at 65",
    field: "tot_bwt_at_65",
    type: "string",
    align: "justify",
  },
  {
    title: "Bag Weight at 550",
    field: "tot_bwt_at_550",
    type: "string",
    align: "justify",
  },
  {
    title: "Percent C",
    field: "percent_c",
    type: "string",
    align: "justify",
  },
  {
    title: "Percent N",
    field: "percent_n",
    type: "string",
    align: "justify",
  },
  {
    title: "Dry Biomass Wt",
    field: "dry_biomass_wt",
    type: "string",
    align: "justify",
  },
];

const DecompBag = () => {
  const [state] = useContext(Context);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (apiKey) => {
      setLoading(true);
      const freshBiomass_url = onfarmAPI + `/raw?table=decomp_biomass_fresh`;
      const dryBiomass_url = onfarmAPI + `/raw?table=decomp_biomass_dry`;
      const cnBiomass_url = onfarmAPI + `/raw?table=decomp_biomass_cn`;
      const ashBiomass_url = onfarmAPI + `/raw?table=decomp_biomass_ash`;

      const fetchRecords = async (url) => {
        try {
          const response = await fetch(url, {
            headers: {
              "x-api-key": apiKey,
            },
          });
          return await response.json();
        } catch (e) {
          console.error("API Error", e);
        }
      };

      const freshRecords = await fetchRecords(freshBiomass_url);
      const dryRecords = await fetchRecords(dryBiomass_url);
      const cnRecords = await fetchRecords(cnBiomass_url);
      const ashRecords = await fetchRecords(ashBiomass_url);

      const leftJoin = (objArr1, objArr2, key1, key2, key3) =>
        objArr1.map((obj1) => ({
          ...objArr2.find(
            (obj2) =>
              obj1[key1] === obj2[key1] &&
              obj1[key2] === obj2[key2] &&
              obj1[key3] === obj2[key3]
          ),
          ...obj1,
        }));

      const freshDryJoined = leftJoin(
        freshRecords,
        dryRecords,
        "code",
        "subplot",
        "subsample"
      );
      const cnAshJoined = leftJoin(
        cnRecords,
        ashRecords,
        "code",
        "subplot",
        "subsample"
      );
      const allJoined = leftJoin(
        freshDryJoined,
        cnAshJoined,
        "code",
        "subplot",
        "subsample"
      );

      //   const freshDryJoined = freshRecords.map(function (e) {
      //     return Object.assign(
      //       {},
      //       e,
      //       dryRecords.reduce(function (acc, val) {
      //         if (
      //           val.code === e.code &&
      //           val.subplot === e.subplot &&
      //           val.subsample === e.subsample
      //         ) {
      //           return val;
      //         } else {
      //           return acc;
      //         }
      //       }, {})
      //     );
      //   });

      //   const cnAshJoined = cnRecords.map(function (e) {
      //     return Object.assign(
      //       {},
      //       e,
      //       ashRecords.reduce(function (acc, val) {
      //         if (
      //           val.code === e.code &&
      //           val.subplot === e.subplot &&
      //           val.subsample === e.subsample
      //         ) {
      //           return val;
      //         } else {
      //           return acc;
      //         }
      //       }, {})
      //     );
      //   });

      //   const allJoined = freshDryJoined.map(function (e) {
      //     return Object.assign(
      //       {},
      //       e,
      //       cnAshJoined.reduce(function (acc, val) {
      //         if (
      //           val.code === e.code &&
      //           val.subplot === e.subplot &&
      //           val.subsample === e.subsample
      //         ) {
      //           return val;
      //         } else {
      //           return acc;
      //         }
      //       }, {})
      //     );
      //   });
      const uniq = _.uniqWith(allJoined, _.isEqual);
      console.log(uniq);
      setData(uniq);
      setLoading(false);
    };

    if (!state.userInfo.apikey) return false;

    fetchData(state.userInfo.apikey);
  }, [state.userInfo.apikey]);

  const height = window.innerHeight;
  return (
    <Grid container>
      {loading ? (
        <CustomLoader />
      ) : (
        <Grid item xs={12}>
          <MaterialTable
            columns={tableHeaderOptions}
            data={data}
            title="Decomp Bags"
            options={{
              padding: "default",
              exportButton: false,
              exportFileName: "Site Information",
              addRowPosition: "last",
              exportAllData: false,
              pageSizeOptions: [20, 50, 100, data.length],
              pageSize: 20,
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
              maxBodyHeight: height * 0.7,
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default DecompBag;
