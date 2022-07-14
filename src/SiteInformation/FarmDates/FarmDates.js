import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
import MaterialTable from 'material-table';
import { bannedRoles } from '../../utils/constants';
import { BannedRoleMessage, CustomLoader } from '../../utils/CustomComponents';
import { useAuth0 } from '../../Auth/react-auth0-spa';
import FarmDatesDropdown from './components/FarmDatesDropdown/FarmDatesDropdown';
import { fetchFarmDatesFromApi, makeDateObjects } from '../shared/functions';
import { useSelector, useDispatch } from 'react-redux';
import { setFarmDatesData } from '../../Store/actions';

const FarmDates = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const farmDatesData = useSelector((state) => state.farmDatesData.farmDatesData);
  const farmDatesValuesEdited = useSelector((state) => state.farmDatesData.farmDatesValuesEdited);
  const dispatch = useDispatch();
  const [showBannedMessage, setShowBannedMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth0();

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
              dispatch(setFarmDatesData(responseWithFilter));
            })
            .finally(() => setLoading(false));
        });
      }
    }
  }, [userInfo.apikey, userInfo.role, farmDatesValuesEdited]);

  //let height = window.innerHeight;

  const [height, setHeight] = useState(window.innerHeight);

  const handleResize = () => {
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize, false);
  }, []);

  // scale height
  // if (height < 900 && height > 600) {
  //   height -= 130;
  // } else if (height < 600) {
  //   height -= 200;
  // }

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
  ];

  return !showBannedMessage ? (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {loading ? (
          <CustomLoader />
        ) : farmDatesData.length > 0 ? (
          <div>
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
                // pageSizeOptions: [50, 100, farmDatesData.length],
                // pageSize: farmDatesData.length,
                paging: false,
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
                maxBodyHeight: height - 250,
              }}
              detailPanel={[
                {
                  tooltip: 'View actual dates',
                  render: (rowData) => {
                    return <FarmDatesDropdown rowData={rowData} nickname={user.nickname} />;
                  },
                },
              ]}
            />
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

export default FarmDates;
