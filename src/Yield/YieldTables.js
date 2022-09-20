import React, { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import MaterialTable from 'material-table';
import { SharedTableContainer } from '../TableComponents/SharedTableContainer';
import { useAuth0 } from '../Auth/react-auth0-spa';
import { filterData } from '../TableComponents/SharedTableFunctions';
import SharedToolbar from '../TableComponents/SharedToolbar';
import SharedTableOptions from '../TableComponents/SharedTableOptions';
import IssueDialogue from '../Comments/components/IssueDialogue/IssueDialogue';

const YieldTables = (props) => {
  const { tableName, data, affiliations, farmYears } = props;
  const { getTokenSilently } = useAuth0();
  const { user } = useAuth0();
  const [tableData, setTableData] = useState(data);
  const [units, setUnits] = useState('mg/ha');
  //const [simpleView, setSimpleView] = useState(true);
  const currTime = new Date();
  const [pickedYears, setPickedYears] = useState([currTime.getFullYear()]);
  const [pickedAff, setPickedAff] = useState(['All']);
  const height = useSelector((state) => state.appData.windowHeight);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    var filteredData = filterData(data, pickedYears, pickedAff);
    switch (tableName) {
      case 'Cotton':
        filteredData = filteredData.filter((row) => row['cash.crop'] === 'Cotton');
        break;
      case 'Soybean':
        filteredData = filteredData.filter((row) => row['cash.crop'] === 'Soybeans');
        break;
      default:
        filteredData = filteredData.filter((row) => row['cash.crop'] === 'Corn');
    }
    setTableData(filteredData);
  }, [pickedYears, pickedAff, tableName]);

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
      field: 'adjusted.grain.yield.Mg_ha',
      title: 'Grain Yield',
      type: 'numeric',
      align: 'justify',
      hidden: tableName === 'Cotton',
      render: (rowData) => {
        if (tableName === 'Corn') {
          if (!rowData['adjusted.grain.yield.Mg_ha']) {
            return 'N/A';
          }
          if (units === 'bu/ac') {
            return Math.round(10 * (rowData['adjusted.grain.yield.Mg_ha'] * 1000 * 0.0159)) / 10;
          }
          return Math.round(10 * rowData['adjusted.grain.yield.Mg_ha']) / 10;
        } else if (tableName === 'Soybean') {
          if (!rowData['adjusted.grain.yield.Mg_ha']) {
            return 'N/A';
          }
          if (units === 'bu/ac') {
            return Math.round(10 * (rowData['adjusted.grain.yield.Mg_ha'] * 1000 * 0.0149)) / 10;
          }
          return Math.round(10 * rowData['adjusted.grain.yield.Mg_ha']) / 10;
        }
      },
    },
    {
      field: 'lint.kg_ha',
      title: 'Lint Yield',
      type: 'numeric',
      align: 'justify',
      hidden: tableName === 'Corn' || tableName === 'Soybean',
      render: (rowData) => {
        if (tableName === 'Cotton') {
          if (!rowData['lint.kg_ha']) {
            return 'N/A';
          }
          if (units === 'bu/ac') {
            return Math.round(10 * ((rowData['lint.kg_ha'] / 1000) * 892)) / 10;
          }
          return Math.round(10 * rowData['lint.kg_ha']);
        }
      },
    },
  ];

  return (
    <>
      {data ? (
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
                  //setSimpleView={setSimpleView}
                  units={units}
                  //simpleView={simpleView}
                  pickedYears={pickedYears}
                  pickedAff={pickedAff}
                  setPickedAff={setPickedAff}
                  setPickedYears={setPickedYears}
                  name={tableName}
                  buacToggle={tableName === 'Corn' || tableName === 'Soybean' ? true : false}
                />
              }
              data={tableData}
              options={SharedTableOptions(height, tableName, false)}
              detailPanel={[
                {
                  tooltip: 'Add Comments',
                  icon: 'comment',
                  openIcon: 'message',
                  render: (rowData) => {
                    return (
                      <IssueDialogue
                        nickname={user.nickname}
                        rowData={rowData}
                        dataType="table"
                        //add table name
                        labels={['yield tables', rowData.code]}
                        getTokenSilently={getTokenSilently}
                      />
                    );
                  },
                },
              ]}
              components={{
                Groupbar: () => <></>,
              }}
            />
          </Grid>
        </SharedTableContainer>
      ) : (
        <Typography>No data!</Typography>
      )}
    </>
  );
};

YieldTables.propTypes = {
  tableName: PropTypes.string,
  data: PropTypes.array,
  farmYears: PropTypes.array,
  affiliations: PropTypes.array,
};

export default YieldTables;
