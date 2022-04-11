import * as React from 'react';
import { Switch, Typography, FormControl, FormGroup } from '@material-ui/core';
import { alpha, styled } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const WhiteSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: alpha('#FFFFFF', theme.palette.action.hoverOpacity),
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#FFFFFF',
    },
  }));

export default function SwitchesGroup({ setViewType }) {
  const handleChange = (event) => {
    if (event.target.checked) {
        setViewType('home');
    } else {
        setViewType('global');
    }
  };

  return (
    <FormControl component="fieldset" variant="standard">
      <FormGroup>
        <div style={{display: 'flex'}}>
            <div style={{padding: '6px'}}><Typography variant="body1">Global View</Typography></div>
            <WhiteSwitch defaultChecked onChange={handleChange} />
            <div style={{padding: '6px'}}><Typography variant="body1">Home View</Typography></div>
        </div>
        
      </FormGroup>
    </FormControl>
  );
}

SwitchesGroup.propTypes = {
    setViewType: PropTypes.any,
};