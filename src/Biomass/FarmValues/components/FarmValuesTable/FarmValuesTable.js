import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import { Grid, Tooltip } from '@material-ui/core';
import IssueDialogue from '../../../../Comments/components/IssueDialogue/IssueDialogue';
import { useAuth0 } from '../../../../Auth/react-auth0-spa';
import SharedToolbar from '../../../../TableComponents/SharedToolbar';
// import FarmValuesMobileView from './FarmValuesTableMobile';
import { filterData } from '../../../../TableComponents/SharedTableFunctions';
import SharedTableOptions from '../../../../TableComponents/SharedTableOptions';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setIssueDialogueData } from '../../../../Store/actions';
import { SharedTableContainer } from '../../../../TableComponents/SharedTableContainer';

const FarmValuesTable = (props) => {
  const { data, affiliations, farmYears } = props;
  const [tableData, setTableData] = useState(data);
  const { user } = useAuth0();
  const [units, setUnits] = useState('kg/ha');
  const [simpleView, setSimpleView] = useState(true);
  const [pickedYears, setPickedYears] = useState([]);
  const [pickedAff, setPickedAff] = useState(['All']);
  const height = useSelector((state) => state.appData.windowHeight);
  const dispatch = useDispatch();
  // const width = useSelector((state) => state.appData.windowWidth);

  useEffect(() => {
    setPickedYears([farmYears.sort()[farmYears.length - 1]]);
  }, [farmYears]);

  useEffect(() => {
    setTableData(filterData(data, pickedYears, pickedAff));
  }, [pickedYears, pickedAff]);

  useEffect(() => {
    dispatch(
      setIssueDialogueData({
        nickname: user.nickname,
        dataType: 'table',
        setShowNewIssueDialog: true,
      }),
    );
  }, []);

  const tableHeaderOptions = [
    {
      field: 'year',
      defaultSort: 'desc',
      hidden: true,
    },
    {
      field: 'affiliation',
      defaultSort: 'asc',
      hidden: true,
    },
    {
      title: 'Code',
      field: 'code',
      type: 'string',
      align: 'justify',
      defaultSort: 'asc',
    },
    {
      field: 'subplot',
      title: 'Rep',
      type: 'numeric',
      align: 'justify',
      defaultSort: 'asc',
    },
    {
      field: 'cc_harvest_date',
      title: 'Biomass Harvest',
      type: 'date',
      align: 'justify',
      render: (rowData) => {
        return rowData.cc_harvest_date
          ? new Date(rowData.cc_harvest_date).toLocaleDateString()
          : 'N/A';
      },
    },
    {
      field: 'cc_species',
      title: 'Cover Crops',
      type: 'string',
      align: 'justify',
      render: (rowData) => {
        return rowData.cc_species ? truncateCoverCrop(rowData.cc_species) : 'No Data';
      },
      width: '100%',
    },
    {
      field: 'uncorrected_cc_dry_biomass_kg_ha',
      title: 'Dry Weight',
      type: 'numeric',
      align: 'justify',
      render: (rowData) => {
        return rowData.uncorrected_cc_dry_biomass_kg_ha
          ? units === 'kg/ha'
            ? Math.round(rowData.uncorrected_cc_dry_biomass_kg_ha)
            : Math.round(rowData.uncorrected_cc_dry_biomass_kg_ha * 0.8922)
          : 'N/A';
      },
    },
    {
      field: 'cc_termination_data',
      title: 'Termination date',
      type: 'date',
      align: 'justify',
      hidden: simpleView,
      render: (rowData) => {
        return rowData.cc_termination_date
          ? new Date(rowData.cc_termination_date).toLocaleDateString()
          : 'N/A';
      },
    },
    {
      field: 'ash_corrected_cc_dry_biomass_kg_ha',
      title: 'Ash-Free Wt.',
      type: 'numeric',
      align: 'justify',
      hidden: simpleView,
      render: (rowData) => {
        return rowData.ash_corrected_cc_dry_biomass_kg_ha
          ? units === 'kg/ha'
            ? Math.round(rowData.ash_corrected_cc_dry_biomass_kg_ha)
            : Math.round(rowData.ash_corrected_cc_dry_biomass_kg_ha * 0.8922)
          : 'N/A';
      },
    },
    {
      field: 'percent_n_nir',
      title: '%N by NIR',
      type: 'numeric',
      align: 'justify',
      hidden: simpleView,
      render: (rowData) => {
        return rowData.percent_n_nir ? Math.round(rowData.percent_n_nir * 100) / 100 : 'N/A';
      },
    },
    {
      field: 'CN_ratio',
      title: 'C:N',
      type: 'numeric',
      align: 'justify',
      hidden: simpleView,
      render: (rowData) => {
        return rowData.CN_ratio ? Math.round(rowData.CN_ratio * 100) / 100 : 'N/A';
      },
    },
    {
      field: 'percent_carbohydrates',
      title: 'Carb %',
      type: 'numeric',
      align: 'justify',
      hidden: simpleView,
      render: (rowData) => {
        return rowData.percent_carbohydrates
          ? Math.round(rowData.percent_carbohydrates * 100) / 100
          : 'N/A';
      },
    },
    {
      field: 'percent_cellulose',
      title: 'Cellulose %',
      type: 'numeric',
      align: 'justify',
      hidden: simpleView,
      render: (rowData) => {
        return rowData.percent_cellulose
          ? Math.round(rowData.percent_cellulose * 100) / 100
          : 'N/A';
      },
    },
    {
      field: 'percent_lignin',
      title: 'Lignin %',
      type: 'numeric',
      align: 'justify',
      hidden: simpleView,
      render: (rowData) => {
        return rowData.percent_lignin ? Math.round(rowData.percent_lignin * 100) / 100 : 'N/A';
      },
    },
  ];

  const truncateCoverCrop = (name) => {
    if (simpleView || name.length <= 10) {
      return name;
    } else {
      return (
        <Tooltip title={name}>
          <div>{name.substring(0, 10) + '...'}</div>
        </Tooltip>
      );
    }
  };

  return (
    <SharedTableContainer>
      <Grid item lg={12}>
        <MaterialTable
          style={{ width: 'calc(100vw - 100px)', minWidth: '1145px' }}
          columns={tableHeaderOptions}
          title={
            <SharedToolbar
              farmYears={farmYears}
              affiliations={affiliations}
              setUnits={setUnits}
              setSimpleView={setSimpleView}
              units={units}
              simpleView={simpleView}
              pickedYears={pickedYears}
              pickedAff={pickedAff}
              setPickedAff={setPickedAff}
              setPickedYears={setPickedYears}
              name={'Farm Values'}
            />
          }
          data={tableData}
          options={SharedTableOptions(height, 'Farm Values', false)}
          detailPanel={[
            {
              tooltip: 'Add Comments',
              icon: 'comment',
              openIcon: 'message',
              render: (rowData) => {
                return <IssueDialogue rowData={rowData} labels={['farm-values', rowData.code]} />;
              },
            },
          ]}
          components={{
            Groupbar: () => <></>,
          }}
        />
      </Grid>
    </SharedTableContainer>
  );
};

export default FarmValuesTable;

FarmValuesTable.propTypes = {
  data: PropTypes.array,
  farmYears: PropTypes.array,
  affiliations: PropTypes.array,
};
