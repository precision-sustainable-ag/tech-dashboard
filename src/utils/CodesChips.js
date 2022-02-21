import React from 'react';
import { Chip, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';

const CodesChips = (props) => {
  const { codes, handleActiveCode, activeCode } = props;
  return (
    <>
      <Grid item>
        <Chip
          label={'All'}
          color={activeCode === 'all' ? 'primary' : 'default'}
          onClick={() => {
            handleActiveCode('all');
          }}
        />
      </Grid>
      {codes.length > 0 &&
        codes.map((code, index) => (
          <Grid item key={`codeChip-${index}`}>
            <Chip
              label={code.code}
              color={code.active ? 'primary' : 'default'}
              onClick={() => {
                handleActiveCode(code.code);
              }}
            />
          </Grid>
        ))}
    </>
  );
};

CodesChips.defaultProps = {
  activeCode: 'all',
  codes: [{ code: 'all', active: true }],
};

CodesChips.propTypes = {
  activeCode: PropTypes.string,
  codes: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired,
    }),
  ),
  handleActiveCode: PropTypes.func,
};
export default CodesChips;
