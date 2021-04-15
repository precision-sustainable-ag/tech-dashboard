import { useState, useEffect, useContext } from "react";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { Context } from "../../Store/Store";
import MaterialTable from "material-table";
import { bannedRoles } from "../../utils/constants";
import { BannedRoleMessage, CustomLoader } from "../../utils/CustomComponents";
import { onfarmAPI } from "../../utils/api_secret";
import Comments from "../../Comments/Comments"
import { addDays } from "date-fns";
const farmDatesURL = `${onfarmAPI}/dates`;

const tableHeaderOptions = [
  {
    title: "Code",
    field: "code",
    type: "string",
    align: "justify",
    searchable: true,
  },
  {
    title: "Cover Crop Planting",
    field: "cover_planting",
    type: "date",
    align: "justify",
    searchable: false,
  },
  {
    title: "Biomass Harvest",
    field: "biomass_harvest",
    type: "date",
    align: "justify",
    searchable: false,
  },
  {
    title: "Cover Crop Termination",
    field: "cover_termination",
    type: "date",
    align: "justify",
    searchable: false,
  },
  {
    title: "Cash Planting",
    field: "cash_planting",
    type: "date",
    align: "justify",
    searchable: false,
  },
  {
    title: 'T1 "Target"',
    field: "t1_target",
    type: "date",
    align: "justify",
    searchable: false,
  },
  {
    title: 'T1 "Actual"',
    field: "t1_actual",
    type: "date",
    align: "justify",
    searchable: false,
  },
  {
    title: "T2",
    field: "t2_target",
    type: "date",
    align: "justify",
    searchable: false,
  },
  {
    title: 'T2 "Actual"',
    field: "t2_actual",
    type: "date",
    align: "justify",
    searchable: false,
  },
  {
    title: "T3",
    field: "t3_target",
    type: "date",
    align: "justify",
    searchable: false,
  },
  {
    title: 'T3 "Actual"',
    field: "t3_actual",
    type: "date",
    align: "justify",
    searchable: false,
  },
  {
    title: "T4",
    field: "t4_target",
    type: "date",
    align: "justify",
    searchable: false,
  },
  {
    title: 'T4 "Actual"',
    field: "t4_actual",
    type: "date",
    align: "justify",
    searchable: false,
  },
  {
    title: 'T5 "Target"',
    field: "t5_target",
    type: "string",
    searchable: false,
  },

  //     {
  //         title: "Yield Harvest",
  //     field: "cash_planting",
  //     type: "date",
  //     align: "justify",
  //   },
  //   {},
];

const FarmDates = () => {
  const [state] = useContext(Context);
  const [farmDatesData, setFarmDatesData] = useState([]);
  const [showBannedMessage, setShowBannedMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state.userInfo.role && bannedRoles.includes(state.userInfo.role)) {
      setShowBannedMessage(true);
    } else {
      if (state.userInfo.apikey) {
        setShowBannedMessage(false);
        setLoading(true);
        fetchFarmDatesFromApi(state.userInfo.apikey).then((response) => {
          makeDateObjects(response)
            .then((response) => {
              setFarmDatesData(response);
            })
            .finally(() => setLoading(false));
        });
      }
    }
  }, [state.userInfo]);

  return !showBannedMessage ? (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {loading ? (
          <CustomLoader />
        ) : farmDatesData.length > 0 ? (
          <MaterialTable
            title={"Farm Dates"}
            columns={tableHeaderOptions}
            data={farmDatesData}
            options={{
              padding: "default",

              exportButton: true,
              exportFileName: "Farm Dates",
              exportAllData: false,
              pageSizeOptions: [50, 100, farmDatesData.length],
              pageSize: 100,
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
              //   maxBodyHeight: "100vh",
              selection: false,
              searchAutoFocus: true,
              toolbarButtonAlignment: "left",
            }}
            detailPanel={[
              {
                tooltip: "Add Comments",
                icon: "comment",

                openIcon: "message",
                render: (rowData) => {
                  return (
                    <>
                      {/* <Grid
                        container
                        spacing={3}
                        style={{
                          minHeight: "10vh",
                          padding: "1em",
                        }}
                      >
                          <RenderExistingComments />
                      </Grid> */}
                      {/* <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          console.log(JSON.stringify(rowData));
                        }}
                      >
                        <Grid
                          container
                          spacing={3}
                          style={{
                            minHeight: "10vh",
                            padding: "2em",
                          }}
                        >
                          <Grid item xs={12}>
                            <TextField type="hidden" value={rowData} />
                            <TextField
                              required
                              label="Add a new comment"
                              variant="outlined"
                              multiline
                              fullWidth
                              rows={4}
                              type="text"
                            />
                          </Grid>
                          <Grid item>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              type="submit"
                            >
                              Comment
                            </Button>
                          </Grid>
                        </Grid>
                      </form> */}
                      <Comments/>
                    </>
                  );
                },
              },
            ]}
          />
        ) : (
          <Typography variant="body1">No Data</Typography>
        )}
      </Grid>
    </Grid>
  ) : (
    <BannedRoleMessage title="Farm Dates" />
  );
};

const makeDateObjects = async (response) => {
  return Promise.all(
    response.map((record) => {
      const biomassDate = record.biomass_harvest
        ? new Date(record.biomass_harvest)
        : "";

      return {
        ...record,
        t1_target: biomassDate ? addDays(biomassDate, 14) : "",
        t1_actual: record.t1_actual ? new Date(record.t1_actual) : "",
        t2_target: biomassDate ? addDays(biomassDate, 30) : "",
        t2_actual: record.t2_actual ? new Date(record.t2_actual) : "",
        t3_target: biomassDate ? addDays(biomassDate, 60) : "",
        t3_actual: record.t3_actual ? new Date(record.t3_actual) : "",
        t4_target: biomassDate ? addDays(biomassDate, 90) : "",
        t4_actual: record.t4_actual ? new Date(record.t4_actual) : "",
        t5_target: record.t5_target
          ? new Date(record.t5_target)
          : "at hand harvest",
      };
    })
  );
};

const fetchFarmDatesFromApi = async (apiKey = "") => {
  let data = [];
  try {
    data = await fetchFarmDates(farmDatesURL, apiKey);
  } catch (e) {
    console.error(e);
  }
  return data;
};

const fetchFarmDates = async (url, apiKey) => {
  let records = await fetch(url, {
    headers: {
      "x-api-key": apiKey,
    },
  });

  records = await records.json();
  return records;
};
export default FarmDates;
