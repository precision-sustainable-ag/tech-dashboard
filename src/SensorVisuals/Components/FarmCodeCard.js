import React from 'react';
import { Typography, Card, CardContent, CardActionArea, useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { grey } from '@material-ui/core/colors';

const FarmCodeCard = (props) => {
  let { code, year, affiliation, lastUpdated, data, color, isDarkTheme, type, apiKey } = props;
  const theme = useTheme();

  if (color === 'default') color = isDarkTheme ? grey[700] : 'white';

  return (
    <Card
      style={{ backgroundColor: color, height: '75px' }}
      elevation={theme.palette.type === 'dark' ? 4 : 1}
    >
      {color !== 'white' && (
        <CardActionArea
          component={Link}
          enabled="false"
          style={{ height: '75px' }}
          to={{
            pathname: type === "decompbags" ? `/decomp-bags/${year}/${code.toUpperCase()}` :
              (type === 'watersensors' ? `/sensor-visuals/${year}/${code.toUpperCase()}` : `/stress-cam-visuals/${year}/${code.toUpperCase()}`),
            state: { data: type === 'watersensors' ? data : { code: code, apiKey: apiKey, year: year, affiliation: affiliation } },
          }}
        >
          <CardContent style={{ height: '75px' }}>
            <Typography align="center" variant="body1">
              {code.toUpperCase()}
            </Typography>
            {lastUpdated && (
              <Typography align="center" variant="body1">
                {lastUpdated}
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
      )}
      {color === 'white' && (
        <CardContent style={{ height: '75px' }}>
          <Typography align="center" variant="body1">
            {code.toUpperCase()}
          </Typography>
          {lastUpdated && (
            <Typography align="center" variant="body1">
              {lastUpdated}
            </Typography>
          )}
        </CardContent>
      )}
    </Card>
  );
};

FarmCodeCard.propTypes = {
  code: PropTypes.string.isRequired,
  year: PropTypes.any,
  affiliation: PropTypes.string,
  lastUpdated: PropTypes.any,
  data: PropTypes.any,
  color: PropTypes.any,
  isDarkTheme: PropTypes.bool,
  type: PropTypes.string,
  apiKey: PropTypes.string
};

export default FarmCodeCard;
