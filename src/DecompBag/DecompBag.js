import React, { useState, useEffect, useContext } from "react";
import { Grid } from "@material-ui/core";
import { onfarmAPI } from "../utils/api_secret";
import { Context } from "../Store/Store";
import { CustomLoader } from "../utils/CustomComponents";
import MaterialTable from "material-table";
import Typography from "@material-ui/core/Typography";

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
    title: "Pickup #",
    field: "time",
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
      const decompBag_url = onfarmAPI + `/raw?table=decomp_bag`;

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

      const allJoined = await fetchRecords(decompBag_url);

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
            title={
              <div>
                <div>
                  <Typography
                    variant={"h6"}
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                    >{"Decomp Bags"}
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant={"caption"}
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                    >{"All weights in grams"}
                  </Typography>
                </div>
              </div>
            }
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
