import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ExpandMore, ExpandLess, FilterList } from '@material-ui/icons';
import {
  Grid,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControl,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Select,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const CustomSelect = styled(Select)`
  max-width: 200px;
`;

const MobileTableRow = styled.div`
  border-top: solid;
  display: grid;
  fontsize: 20px;
  background: #424242;
  padding: 0px 10px;
`;

const MobileTableRowHead = styled.div`
  display: flex;
  align-items: center;
  fontsize: 20px;
  background: #424242;
  justify-content: space-between;
`;

const MobileTableRowLabel = styled.div`
  background: green;
  font-weight: bold;
  margin-right: 5px;
  height: fit-content;
  width: fit-content;
`;

const MobileHeaderContainer = styled.div`
  height: 50px;
  background: #424242;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px;
`;

const useStyles = makeStyles(() => ({
  list: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
  },
}));

const FarmValuesMobileView = (props) => {
  const { farmYears, affiliations, tableHeaderOptions, data } = props;
  const [mobileModalOpen, setMobileModelOpen] = useState(false);
  const [mobileSelectedCode, setMobileSelectedCode] = useState('');
  const [pickedYears, setPickedYears] = useState(['2022']);
  const [pickedAff, setPickedAff] = useState(['All']);
  const classes = useStyles();
  const [tableData, setTableData] = useState(data);

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

  useEffect(() => {
    const filteredYears = data.filter((row) => pickedYears.includes(row.year));

    const filteredAff = pickedAff.includes('All')
      ? filteredYears
      : filteredYears.filter((row) => pickedAff.includes(row.affiliation));

    setTableData(filteredAff);
  }, [pickedYears, pickedAff]);

  return (
    <div>
      <Dialog open={mobileModalOpen}>
        <DialogContent>
          <Grid container spacing={2} direction="column" alignItems="center">
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
                      MenuProps={{
                        classes: { list: classes.list },
                      }}
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
              {' '}
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
                      MenuProps={{
                        classes: { list: classes.list },
                      }}
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
            {/* <Grid item>{UnitButtonComponent()}</Grid>
                <Grid item>{AdvancedViewToggle()}</Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMobileModelOpen(false)} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <MobileHeaderContainer>
        <Typography variant={'h6'}>{'Farm Values'}</Typography>
        <FilterList onClick={() => setMobileModelOpen(true)} />
      </MobileHeaderContainer>
      <div
        style={{
          overflow: 'scroll',
          height: 'calc(100vh - 170px)',
        }}
      >
        {tableData.map((code) => (
          <MobileTableRow key={code.code + code.subplot}>
            <MobileTableRowHead>
              <div>
                <strong>{code['code']}</strong>
                {', subplot ' + code.subplot}
              </div>
              {mobileSelectedCode != code.code + code.subplot ? (
                <ExpandMore onClick={() => setMobileSelectedCode(code.code + code.subplot)} />
              ) : (
                <ExpandLess onClick={() => setMobileSelectedCode(null)} />
              )}
            </MobileTableRowHead>
            {mobileSelectedCode === code.code + code.subplot ? (
              <div style={{ display: 'grid', marginBottom: '5px' }} key={code.code + code.subplot}>
                {tableHeaderOptions
                  .filter(
                    (option) =>
                      option.field !== 'code' &&
                      option.field !== 'subplot' &&
                      option.field !== 'affiliation' &&
                      option.field !== 'year',
                  )
                  .map((option) => (
                    <div style={{ display: 'flex' }} key={code.code + code.suplot + option.field}>
                      <MobileTableRowLabel>{option.title + ':'}</MobileTableRowLabel>
                      {option.render(code)}
                    </div>
                  ))}
              </div>
            ) : null}
          </MobileTableRow>
        ))}
      </div>
    </div>
  );
};

export default FarmValuesMobileView;

FarmValuesMobileView.propTypes = {
  farmYears: PropTypes.array,
  affiliations: PropTypes.array,
  tableHeaderOptions: PropTypes.any,
  data: PropTypes.any,
};
