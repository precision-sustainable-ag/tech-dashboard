// Dependency Imports
import React, { useEffect } from 'react';
import { makeStyles, Chip } from '@material-ui/core';
import PropTypes from 'prop-types';
// const useStyles = makeStyles(theme => ({
//   root: {
//     backgroundColor: theme.palette.background.paper
//   }
// }));

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

// Default Function
const WaterSensorByGatewayTopbar = (props) => {
  const classes = useStyles();

  let { activeChip, coverNodes, bareNodes, setActiveChip } = props;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    activeChip = props.activeChip;

    return () => {};
  }, [props.activeChip]);
  return (
    <div className={classes.root}>
      {bareNodes.length > 0 ? (
        <div>
          {bareNodes.map((node, index) => {
            return (
              <Chip
                color={activeChip === node ? 'primary' : 'secondary'}
                title={`Bare Node, Serial No: ${node}`}
                key={index}
                label={node}
                onClick={() => {
                  console.log('bare node chip clicked');
                  if (activeChip !== node) setActiveChip(node);
                }}
                className={classes.chip}
              />
            );
          })}
        </div>
      ) : (
        ''
      )}
      {coverNodes.length > 0 ? (
        <div>
          {coverNodes.map((node, index) => {
            return (
              <Chip
                title={`Cover Node, Serial No: ${node}`}
                color={activeChip === node ? 'primary' : 'secondary'}
                key={index}
                label={node}
                onClick={() => {
                  if (activeChip !== node) setActiveChip(node);
                  console.log('cover node chip clicked');
                }}
                className={classes.chip}
              />
            );
          })}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default WaterSensorByGatewayTopbar;

WaterSensorByGatewayTopbar.propTypes = {
  activeChip: PropTypes.string,
  coverNodes: PropTypes.array,
  bareNodes: PropTypes.array,
  setActiveChip: PropTypes.func,
};
