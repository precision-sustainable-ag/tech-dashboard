import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import RenderActionModal from '../RenderActionModal/RenderActionModal';
import SharedToolbar from '../../../../TableComponents/SharedToolbar';
import { filterData } from '../../../../TableComponents/SharedTableFunctions';
import SharedTableOptions from '../../../../TableComponents/SharedTableOptions';
import { SharedTableContainer } from '../../../../TableComponents/SharedTableContainer';

const TableModal = ({ data, height, activeSites, tableTitle, farmYears, affiliations }) => {
  const [tableData, setTableData] = useState(data);
  const [pickedYears, setPickedYears] = useState([2022]);
  const [pickedAff, setPickedAff] = useState(['All']);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const tableHeaderOptions = [
    {
      title: 'Code',
      field: 'code',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Cash Crop',
      field: 'cash_crop',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Grower',
      field: 'last_name',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Affiliation',
      field: 'affiliation',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'County',
      field: 'county',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Year',
      field: 'year',
      type: 'numeric',
      align: 'justify',
      defaultGroupSort: 'desc',
    },
    {
      title: 'Field Address',
      field: 'address',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Notes',
      field: 'notes',
      type: 'string',
      align: 'justify',
    },
  ];

  useEffect(() => {
    setTableData(filterData(data, pickedYears, pickedAff));
  }, [pickedYears, pickedAff]);

  return (
    <SharedTableContainer>
      <Grid container>
        <Grid item lg={12}>
          <MaterialTable
            detailPanel={[
              {
                tooltip: 'Expand Actions Panel',

                render: (rowData) => {
                  return <RenderActionModal rowData={rowData} activeSites={activeSites} />;
                },
              },
            ]}
            columns={tableHeaderOptions}
            data={tableData}
            title={
              <SharedToolbar
                farmYears={farmYears}
                affiliations={affiliations}
                pickedYears={pickedYears}
                pickedAff={pickedAff}
                setPickedAff={setPickedAff}
                setPickedYears={setPickedYears}
                name={tableTitle}
              />
            }
            options={SharedTableOptions(height, 'Contact and Location', false)}
            components={{
              Groupbar: () => <></>,
            }}
          />
        </Grid>
      </Grid>
    </SharedTableContainer>
  );
};

TableModal.propTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  activeSites: PropTypes.bool.isRequired,
  tableTitle: PropTypes.string.isRequired,
  farmYears: PropTypes.array,
  affiliations: PropTypes.array,
};

export default TableModal;
