import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import {
  Grid,
  Tooltip,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControl,
  Switch,
  FormGroup,
  FormControlLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IssueDialogue from '../../../../Comments/components/IssueDialogue/IssueDialogue';
import { useAuth0 } from '../../../../Auth/react-auth0-spa';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
//import { MoreHoriz } from '@material-ui/icons';

const CustomSelect = styled(Select)`
  max-width: 200px;
`;

const FilterGroup = styled.div`
  padding: 0px 15px;
  background: transparent;
  border: solid;
  border-width: 2px;
  border-color: #2f7c31;
  display: flex;
  border-radius: 20px;
  align-items: center;
  overflow: visible;
`;

const useStyles = makeStyles(() => ({
  list: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
  },
}));

const FarmValuesTable = (props) => {
  const { data, setSnackbarData, affiliations, farmYears } = props;
  const [tableData, setTableData] = useState(data);
  const { getTokenSilently } = useAuth0();
  const { user } = useAuth0();
  const [units, setUnits] = useState('kg/ha');
  const [pickedYears, setPickedYears] = useState(['2022']);
  const [pickedAff, setPickedAff] = useState(['All']);
  const [height, setHeight] = useState(window.innerHeight);
  const [simpleView, setSimpleView] = useState(true);
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
      field: 'cc_termination_date',
      title: 'Biomass Harvest',
      type: 'date',
      align: 'justify',
      render: (rowData) => {
        return rowData.cc_termination_date
          ? new Date(rowData.cc_termination_date).toLocaleDateString()
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
          <div>
            {/* <div style={{ display: 'flex' }}>{name.substring(0, 10) + "..."}</div> */}
            {/* <MoreHoriz size="small" style={{ color: '#3da641' }} /> */}
            {name.substring(0, 10) + '...'}
          </div>
        </Tooltip>
      );
    }
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
    const pick = value[value.length - 1];

    if (pick === 'All') {
      setPickedAff(['All']);
    } else if (pick != 'All' && value.includes('All')) {
      const removeAll = value.filter((aff) => aff !== 'All');
      setPickedAff(removeAll);
    } else {
      setPickedAff(typeof value === 'string' ? value.split(',') : value);
    }
  };

  return (
    <Grid item lg={12}>
      <MaterialTable
        columns={tableHeaderOptions}
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ paddingRight: '20px' }}>
              <Typography variant={'h6'}>{'Farm Values'}</Typography>
            </div>
            <FilterGroup>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <Typography>{'Years: '}</Typography>
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
                              <Checkbox
                                checked={pickedYears.includes(year)}
                                style={{ color: '#3da641' }}
                              />
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
                      <Typography>{'Affiliations: '}</Typography>
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
                            <MenuItem key={aff} value={aff} className={aff}>
                              <Checkbox
                                checked={pickedAff.includes(aff)}
                                className={aff}
                                style={{ color: '#3da641' }}
                              />
                              <ListItemText primary={aff} />
                            </MenuItem>
                          ))}
                        </CustomSelect>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          size="small"
                          color="primary"
                          checked={!simpleView}
                          onChange={() => setSimpleView(!simpleView)}
                        />
                      }
                      label="Advanced View"
                    />
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item>kg/ha</Grid>
                      <Grid item>
                        <Switch
                          size="small"
                          color="primary"
                          checked={units === 'lbs/ac'}
                          onChange={() => {
                            if (units === 'kg/ha') setUnits('lbs/ac');
                            else setUnits('kg/ha');
                          }}
                        />
                      </Grid>
                      <Grid item>lbs/ac</Grid>
                    </Grid>
                  </FormGroup>
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
          grouping: true,
          tableLayout: 'auto',
          headerStyle: {
            fontWeight: 'bold',
            fontFamily: 'Bilo, sans-serif',
            fontSize: '0.8em',
            textAlign: 'left',
            position: 'sticky',
            top: 0,
            //padding: '5px 0px',
          },
          rowStyle: () => ({
            fontFamily: 'Roboto, sans-serif',
            fontSize: '0.8em',
            //textAlign: 'left',
            overflowWrap: 'break-word',
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
                  labels={['farm-values', rowData.code]}
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
