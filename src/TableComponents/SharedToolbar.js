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
  background: ${({ value, targetValue }) => (value === targetValue ? '#2F7C31' : 'none')};

  &:hover {
    background: ${({ value, targetValue }) => (value === targetValue ? '#2F7C31' : 'none')};
  }
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
    buacToggle,
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
          {units !== null &&
            (buacToggle ? (
              <Grid item>
                <div style={{ display: 'grid' }}>
                  <UnitButton onClick={() => setUnits('mg/ha')} value={'mg/ha'} targetValue={units}>
                    <UnitButtonText>mg/ha</UnitButtonText>
                  </UnitButton>
                  <UnitButton value={'bu/ac'} targetValue={units} onClick={() => setUnits('bu/ac')}>
                    <UnitButtonText>bu/ac</UnitButtonText>
                  </UnitButton>
                </div>
              </Grid>
            ) : (
              <Grid item>
                <div style={{ display: 'grid' }}>
                  <UnitButton onClick={() => setUnits('kg/ha')} value={'kg/ha'} targetValue={units}>
                    <UnitButtonText>Kg/Ha</UnitButtonText>
                  </UnitButton>
                  <UnitButton
                    value={'lbs/ac'}
                    targetValue={units}
                    onClick={() => setUnits('lbs/ac')}
                  >
                    <UnitButtonText>Lbs/ac</UnitButtonText>
                  </UnitButton>
                </div>
              </Grid>
            ))}
          {simpleView !== null && (
            <Grid item>
              <div style={{ display: 'grid' }}>
                <UnitButton
                  value={true}
                  targetValue={simpleView}
                  onClick={() => setSimpleView(true)}
                >
                  <UnitButtonText>Simple</UnitButtonText>
                </UnitButton>
                <UnitButton
                  value={false}
                  targetValue={simpleView}
                  onClick={() => setSimpleView(false)}
                >
                  <UnitButtonText>Advanced</UnitButtonText>
                </UnitButton>
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
  buacToggle: PropTypes.bool,
};

SharedToolbar.defaultProps = {
  units: null,
  simpleView: null,
};
