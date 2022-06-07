import React from 'react';
import { Grid } from '@material-ui/core';

import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import RenderActionModal from './RenderActionModal.js';

const TableModal = ({ tableData, height, activeSites, tableTitle }) => {
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
      defaultGroupOrder: 0,
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
      defaultGroupOrder: 1,
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

  return (
    <>
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
            title={tableTitle}
            options={{
              defaultExpanded: true,
              padding: 'default',
              exportButton: false,
              exportFileName: 'Contact and Location',
              addRowPosition: 'last',
              exportAllData: false,
              pageSize: tableData.length,
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
          />
        </Grid>
      </Grid>
    </>
  );
};

TableModal.propTypes = {
  tableData: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  activeSites: PropTypes.bool.isRequired,
  tableTitle: PropTypes.string.isRequired,
};

export default TableModal;
