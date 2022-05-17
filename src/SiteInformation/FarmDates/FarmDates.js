/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { Grid, Typography, Snackbar } from '@material-ui/core';
// import { Context } from '../../Store/Store';
import MaterialTable from 'material-table';
import { bannedRoles } from '../../utils/constants';
import { BannedRoleMessage, CustomLoader } from '../../utils/CustomComponents';
import { onfarmAPI } from '../../utils/api_secret';
import { addDays } from 'date-fns';
import { useAuth0 } from '../../Auth/react-auth0-spa';
import MuiAlert from '@material-ui/lab/Alert';
import FarmDatesDropdown from './FarmDatesDropdown';
import { useSelector } from 'react-redux';

const farmDatesURL = `${onfarmAPI}/dates`;

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const FarmDates = () => {
  // const [state] = useContext(Context);
  const userInfo = useSelector((state) => state.userInfo);
  const [farmDatesData, setFarmDatesData] = useState([]);
  const [showBannedMessage, setShowBannedMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth0();
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: '',
    severity: 'success',
  });

  useEffect(() => {
    if (userInfo.role && bannedRoles.includes(userInfo.role)) {
      setShowBannedMessage(true);
    } else {
      if (userInfo.apikey) {
        setShowBannedMessage(false);
        setLoading(true);
        fetchFarmDatesFromApi(userInfo.apikey).then((response) => {
          makeDateObjects(response)
            .then((response) => {
              let responseWithFilter = response.filter((r) => {
                return r.protocols_enrolled !== '-999';
              });
              setFarmDatesData(responseWithFilter);
            })
            .finally(() => setLoading(false));
        });
      }
    }
  }, [userInfo.apikey, userInfo.role]);

  let height = window.innerHeight;

  // scale height
  if (height < 900 && height > 600) {
    height -= 130;
  } else if (height < 600) {
    height -= 200;
  }

  const FarmDatesTable = () => {
    const tableHeaderOptions = [
      {
        title: 'Code',
        field: 'code',
        type: 'string',
        align: 'justify',
        searchable: true,
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
        title: 'Affiliation',
        field: 'affiliation',
        type: 'string',
        align: 'justify',
        defaultGroupOrder: 0,
      },
      {
        title: 'Cover Crop Planting',
        field: 'cover_planting',
        type: 'date',
        align: 'justify',
        searchable: false,
      },
      {
        title: 'Biomass Harvest',
        field: 'biomass_harvest',
        type: 'date',
        align: 'justify',
        searchable: false,
      },
      {
        title: 'Cover Crop Termination',
        field: 'cover_termination',
        type: 'date',
        align: 'justify',
        searchable: false,
      },
      {
        title: 'Cash Planting',
        field: 'cash_planting',
        type: 'date',
        align: 'justify',
        searchable: false,
      },
      {
        title: 'T1',
        field: 't1_target',
        type: 'date',
        align: 'justify',
        searchable: false,
      },

      {
        title: 'T2',
        field: 't2_target',
        type: 'date',
        align: 'justify',
        searchable: false,
      },

      {
        title: 'T3',
        field: 't3_target',
        type: 'date',
        align: 'justify',
        searchable: false,
      },

      {
        title: 'T4',
        field: 't4_target',
        type: 'date',
        align: 'justify',
        searchable: false,
      },

      {
        title: 'T5',
        field: 't5_target',
        type: 'string',
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

    return (
      <MaterialTable
        title={'Farm Dates'}
        columns={tableHeaderOptions}
        data={farmDatesData}
        options={{
          padding: 'default',
          defaultExpanded: true,
          exportButton: true,
          exportFileName: 'Farm Dates',
          exportAllData: false,
          pageSizeOptions: [50, 100, farmDatesData.length],
          pageSize: farmDatesData.length,
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
          //   maxBodyHeight: "100vh",
          selection: false,
          searchAutoFocus: true,
          toolbarButtonAlignment: 'left',
          actionsColumnIndex: 1,
          maxBodyHeight: height * 0.65,
        }}
        detailPanel={[
          {
            tooltip: 'View actual dates',
            render: (rowData) => {
              return (
                <FarmDatesDropdown
                  rowData={rowData}
                  fetchFromApi={fetchFromApi}
                  nickname={user.nickname}
                  setSnackbarData={setSnackbarData}
                />
              );
            },
          },
        ]}
      />
    );
  };

  return !showBannedMessage ? (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {loading ? (
          <CustomLoader />
        ) : farmDatesData.length > 0 ? (
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
            <FarmDatesTable />
          </div>
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
      const biomassDate = record.biomass_harvest ? new Date(record.biomass_harvest) : '';

      return {
        ...record,
        t1_target:
          biomassDate && record.protocols.decomp_biomass == 1
            ? addDays(biomassDate, 14).toLocaleDateString()
            : '',
        t1_actual: record.t1_actual ? new Date(record.t1_actual).toLocaleDateString() : '',
        t2_target:
          biomassDate && record.protocols.decomp_biomass == 1
            ? addDays(biomassDate, 30).toLocaleDateString()
            : '',
        t2_actual: record.t2_actual ? new Date(record.t2_actual).toLocaleDateString() : '',
        t3_target:
          biomassDate && record.protocols.decomp_biomass == 1
            ? addDays(biomassDate, 60).toLocaleDateString()
            : '',
        t3_actual: record.t3_actual ? new Date(record.t3_actual).toLocaleDateString() : '',
        t4_target:
          biomassDate && record.protocols.decomp_biomass == 1
            ? addDays(biomassDate, 90).toLocaleDateString()
            : '',
        t4_actual: record.t4_actual ? new Date(record.t4_actual).toLocaleDateString() : '',
        t5_target:
          record.t5_target && record.protocols.decomp_biomass == 1
            ? new Date(record.t5_target)
            : 'at hand harvest',
      };
    }),
  );
};

const fetchFarmDatesFromApi = async (apiKey = '') => {
  let data = [];
  try {
    data = await fetchFromApi(farmDatesURL, apiKey);
  } catch (e) {
    console.error(e);
  }
  return data;
};

const fetchFromApi = async (url, apiKey) => {
  let records = await fetch(url, {
    headers: {
      'x-api-key': apiKey,
    },
  });

  records = await records.json();
  return records;
};
export default FarmDates;
