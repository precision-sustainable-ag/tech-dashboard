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
import { cleanAff, cleanYears, filterData } from '../../TableComponents/SharedTableFunctions';
import SharedToolbar from '../../TableComponents/SharedToolbar';
import SharedTableOptions from '../../TableComponents/SharedTableOptions';
import { SharedTableContainer } from '../../TableComponents/SharedTableContainer';

const FarmDates = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const farmDatesData = useSelector((state) => state.farmDatesData.farmDatesData);
  const farmDatesValuesEdited = useSelector((state) => state.farmDatesData.farmDatesValuesEdited);
  const dispatch = useDispatch();
  const [showBannedMessage, setShowBannedMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth0();
  const [pickedYears, setPickedYears] = useState(['2022']);
  const [pickedAff, setPickedAff] = useState(['All']);
  const [farmYears, setFarmYears] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [tableData, setTableData] = useState(farmDatesData);
  const height = useSelector((state) => state.appData.windowHeight);


  useEffect(() => {
    setLoading(true);
    if (userInfo.role && bannedRoles.includes(userInfo.role)) {
      setShowBannedMessage(true);
    } else {
      if (userInfo.apikey) {
        setShowBannedMessage(false);
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

  useEffect(() => {
    setFarmYears(cleanYears(farmDatesData));
    setAffiliations(cleanAff(farmDatesData));
  }, [farmDatesData]);

  useEffect(() => {
    setTableData(filterData(farmDatesData, pickedYears, pickedAff));
  }, [pickedYears, pickedAff, farmDatesData]);

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
      defaultSort: 'desc',
    },
    {
      title: 'Affiliation',
      field: 'affiliation',
      type: 'string',
      align: 'justify',
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
    <SharedTableContainer>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {loading ? (
            <CustomLoader />
          ) : farmDatesData.length > 0 ? (
            <div>
              <MaterialTable
                style={{ minWidth: '890px' }}
                title={
                  <SharedToolbar
                    farmYears={farmYears}
                    affiliations={affiliations}
                    pickedYears={pickedYears}
                    pickedAff={pickedAff}
                    setPickedAff={setPickedAff}
                    setPickedYears={setPickedYears}
                    name={'Farm Dates'}
                  />
                }
                columns={tableHeaderOptions}
                data={tableData}
                options={SharedTableOptions(height, 'Farm Dates', true)}
                detailPanel={[
                  {
                    tooltip: 'View actual dates',
                    render: (rowData) => {
                      return <FarmDatesDropdown rowData={rowData} nickname={user.nickname} />;
                    },
                  },
                ]}
                components={{
                  Groupbar: () => <></>,
                }}
              />
            </div>
          ) : (
            <Typography variant="body1">No Data</Typography>
          )}
        </Grid>
      </Grid>
    </SharedTableContainer>
  ) : (
    <BannedRoleMessage title="Farm Dates" />
  );
};

export default FarmDates;
