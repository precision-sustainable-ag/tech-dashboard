import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import {
  Grid,
  Snackbar,
  Tooltip,
  Select,
  MenuItem,
  Button,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControl,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import IssueDialogue from '../Comments/IssueDialogue';
import { useAuth0 } from '../Auth/react-auth0-spa';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { Build } from '@material-ui/icons';

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const CustomSelect = styled(Select)`
  max-width: 200px;
`;

const FilterGroup = styled.div`
  height: fit-content;
  width: fit-content;
  padding: 5px 15px;
  background: transparent;
  border: solid;
  border-width: 2px;
  border-color: #2f7c31;
  display: flex;
  border-radius: 20px;
  align-items: center;
`;

const useStyles = makeStyles(() => ({
  list: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
  },
}));

const FarmValuesTable = (props) => {
  const { data, setSnackbarData, affiliations, farmYears, snackbarData } = props;
  const [tableData, setTableData] = useState(data);
  const { getTokenSilently } = useAuth0();
  const { user } = useAuth0();
  const [units, setUnits] = useState('kg/ha');
  const [pickedYears, setPickedYears] = useState(['2022']);
  const [pickedAff, setPickedAff] = useState(['All']);
  const [height, setHeight] = useState(window.innerHeight);
  const classes = useStyles();

  const handleResize = () => {
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize, false);
  }, []);

  useEffect(() => {
    setTableData(filterData());
  }, [pickedYears, pickedAff]);

  const tableHeaderOptions = [
    {
      title: 'Code',
      field: 'code',
      type: 'string',
      align: 'justify',
    },
    {
      field: 'subplot',
      title: 'Rep',
      type: 'numeric',
    },
    {
      field: 'cc_termination_date',
      title: 'Termination Date',
      type: 'date',
      render: (rowData) => {
        return rowData.cc_termination_date
          ? new Date(rowData.cc_termination_date).toLocaleDateString()
          : 'N/A';
      },
    },
    {
      field: 'cc_species',
      title: 'Cover Crop Species',
      type: 'string',
      render: (rowData) => {
        return rowData.cc_species ? truncateCoverCrop(rowData.cc_species) : 'No Data';
      },
    },
    {
      field: 'uncorrected_cc_dry_biomass_kg_ha',
      title: 'Uncorrected Dry Weight',
      type: 'numeric',
      render: (rowData) => {
        return rowData.uncorrected_cc_dry_biomass_kg_ha
          ? units === 'kg/ha'
            ? Math.round(rowData.uncorrected_cc_dry_biomass_kg_ha)
            : Math.round(rowData.uncorrected_cc_dry_biomass_kg_ha * 0.892179)
          : 'N/A';
      },
    },
    {
      field: 'ash_corrected_cc_dry_biomass_kg_ha',
      title: 'Ash-Free Dry Weight',
      type: 'numeric',
      render: (rowData) => {
        return rowData.ash_corrected_cc_dry_biomass_kg_ha
          ? units === 'kg/ha'
            ? Math.round(rowData.ash_corrected_cc_dry_biomass_kg_ha)
            : Math.round(rowData.ash_corrected_cc_dry_biomass_kg_ha * 0.892179)
          : 'N/A';
      },
    },
    {
      field: 'percent_n_nir',
      title: '%N by NIR',
      type: 'numeric',
      render: (rowData) => {
        return rowData.percent_n_nir ? Math.round(rowData.percent_n_nir * 100) / 100 : 'N/A';
      },
    },
    {
      field: 'CN_ratio',
      title: 'C:N',
      type: 'numeric',
      render: (rowData) => {
        return rowData.CN_ratio ? Math.round(rowData.CN_ratio * 100) / 100 : 'N/A';
      },
    },
    {
      field: 'percent_carbohydrates',
      title: 'Carb %',
      type: 'numeric',
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
      render: (rowData) => {
        return rowData.percent_lignin ? Math.round(rowData.percent_lignin * 100) / 100 : 'N/A';
      },
    },
  ];

  const truncateCoverCrop = (name) => {
    return name.length <= 10 ? (
      name
    ) : (
      <Tooltip title={name}>
        <div>{name.substring(0, 10) + '...'}</div>
      </Tooltip>
    );
  };

  const filterData = () => {
    const filteredYears = data.filter((row) => pickedYears.includes(row.year));

    return pickedAff.includes('All')
      ? filteredYears
      : filteredYears.filter((row) => pickedAff.includes(row.affiliation));
  };

  const handleChangeYears = (event) => {
    const {
      target: { value },
    } = event;
    setPickedYears(typeof value === 'string' ? value.split(',') : value);
  };

  const handleChangeAff = (event) => {
    const {
      target: { value },
    } = event;
    setPickedAff(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Grid item lg={12}>
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
      <MaterialTable
        columns={tableHeaderOptions}
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ paddingRight: '20px' }}>
              <Typography
                variant={'h6'}
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {'Farm Values'}
              </Typography>
            </div>
            <FilterGroup>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <Build style={{ marginTop: '5px' }} />
                    </Grid>
                    <Grid item>
                      <Typography
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {'Years: '}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <FormControl size="small">
                        <CustomSelect
                          id="demo-mutiple-checkbox"
                          multiple
                          value={pickedYears}
                          onChange={handleChangeYears}
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) => selected.join(', ')}
                          MenuProps={{ classes: { list: classes.list } }}
                        >
                          {farmYears.map((year) => (
                            <MenuItem key={year} value={year}>
                              <Checkbox checked={pickedYears.includes(year)} />
                              <ListItemText primary={year} />
                            </MenuItem>
                          ))}
                        </CustomSelect>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <Typography
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {'Affiliations: '}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <FormControl size="small">
                        <CustomSelect
                          id="demo-mutiple-checkbox"
                          multiple
                          value={pickedAff}
                          onChange={handleChangeAff}
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) => selected.join(', ')}
                          MenuProps={{ classes: { list: classes.list } }}
                        >
                          {affiliations.map((aff) => (
                            <MenuItem
                              key={aff}
                              value={aff}
                              disabled={aff !== 'All' && pickedAff.includes('All')}
                            >
                              <Checkbox checked={pickedAff.includes(aff)} />
                              <ListItemText primary={aff} />
                            </MenuItem>
                          ))}
                        </CustomSelect>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <Typography
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {'Units: '}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button
                        onClick={() => {
                          if (units === 'kg/ha') setUnits('lbs/ac');
                          else setUnits('kg/ha');
                        }}
                      >
                        {units}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </FilterGroup>
          </div>
        }
        data={tableData}
        options={{
          paging: false,
          defaultExpanded: false,
          padding: 'dense',
          exportButton: false,
          addRowPosition: 'last',
          exportAllData: false,
          groupRowSeparator: '   ',
          grouping: true,
          headerStyle: {
            fontWeight: 'bold',
            fontFamily: 'Bilo, sans-serif',
            fontSize: '0.8em',
            textAlign: 'left',
            position: 'sticky',
            top: 0,
          },
          rowStyle: () => ({
            fontFamily: 'Roboto, sans-serif',
            fontSize: '0.8em',
            textAlign: 'left',
          }),
          selection: false,
          searchAutoFocus: true,
          toolbarButtonAlignment: 'left',
          actionsColumnIndex: 1,
          maxBodyHeight: height - 170,
        }}
        detailPanel={[
          {
            tooltip: 'Add Comments',
            icon: 'comment',
            openIcon: 'message',
            // eslint-disable-next-line react/display-name
            render: (rowData) => {
              return (
                <IssueDialogue
                  nickname={user.nickname}
                  rowData={rowData}
                  dataType="table"
                  setSnackbarData={setSnackbarData}
                  labels={['weeds3d', rowData.code]}
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
  );
};

export default FarmValuesTable;

FarmValuesTable.propTypes = {
  data: PropTypes.array,
  farmYears: PropTypes.array,
  affiliations: PropTypes.array,
  setSnackbarData: PropTypes.any,
  snackbarData: PropTypes.any,
};
