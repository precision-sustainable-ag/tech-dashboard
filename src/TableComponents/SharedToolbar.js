import React from 'react';
import styled from 'styled-components';
import {
  Grid,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControl,
  Switch,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const FilterGroup = styled.div`
  padding: 5px 15px;
  background: transparent;
  border: solid;
  border-width: 2px;
  border-color: #2f7c31;
  display: flex;
  border-radius: 20px;
  align-items: center;
  overflow: visible;
`;

const CustomSelect = styled(Select)`
  max-width: 200px;
`;

const UnitButton = styled(Button)`
  height: 20px;
  width: 70px;
  background: ${({ units, thisUnit }) => (units === thisUnit ? '#2F7C31' : 'none')};
`;

const UnitButtonText = styled.div`
  font-size: 0.8em;
`;

const useStyles = makeStyles(() => ({
  list: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
  },
}));

const SharedToolbar = (props) => {
  const {
    farmYears,
    affiliations,
    setSimpleView,
    setUnits,
    units,
    simpleView,
    pickedAff,
    setPickedAff,
    pickedYears,
    setPickedYears,
    name,
  } = props;
  const classes = useStyles();

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
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ paddingRight: '20px' }}>
        <Typography variant={'h6'}>{name}</Typography>
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
          {units !== null && (
            <Grid item>
              <div style={{ display: 'grid' }}>
                <UnitButton onClick={() => setUnits('kg/ha')} units={units} thisUnit={'kg/ha'}>
                  <UnitButtonText>Kg/Ha</UnitButtonText>
                </UnitButton>
                <UnitButton onClick={() => setUnits('lbs/ac')} units={units} thisUnit={'lbs/ac'}>
                  <UnitButtonText>Lbs/ac</UnitButtonText>
                </UnitButton>
              </div>
            </Grid>
          )}
          {simpleView !== null && (
            <Grid item>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Switch
                  size="small"
                  color="primary"
                  checked={!simpleView}
                  onChange={() => setSimpleView(!simpleView)}
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'start',
                    marginLeft: '5px',
                  }}
                >
                  <div style={{ fontSize: '0.9em' }}>Advanced</div>
                  <div style={{ fontSize: '0.9em' }}>View</div>
                </div>
              </div>
            </Grid>
          )}
        </Grid>
      </FilterGroup>
    </div>
  );
};

export default SharedToolbar;

SharedToolbar.propTypes = {
  farmYears: PropTypes.array,
  affiliations: PropTypes.array,
  setSimpleView: PropTypes.func,
  setUnits: PropTypes.func,
  units: PropTypes.string,
  simpleView: PropTypes.bool,
  pickedAff: PropTypes.array,
  setPickedAff: PropTypes.func,
  pickedYears: PropTypes.array,
  setPickedYears: PropTypes.func,
  name: PropTypes.string,
};

SharedToolbar.defaultProps = {
  units: null,
  simpleView: null,
};