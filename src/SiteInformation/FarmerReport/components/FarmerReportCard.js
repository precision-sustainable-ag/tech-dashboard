import React, { useState } from 'react';
import { Typography, Card, CardContent, CardActionArea, useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { green } from '@material-ui/core/colors';
import { useSelector } from 'react-redux';
//import { onfarmAPI } from '../../../utils/api_secret';
import { CustomLoader } from '../../../utils/CustomComponents';
// import { Context } from '../../Store/Store';

const FarmerReportCard = (props) => {
  let { code } = props;
  const theme = useTheme();
  const { loading, setLoading } = useState(false);
  // const [state] = useContext(Context);
  const isDarkTheme = useSelector((state) => state.userInfo.isDarkTheme);

  const saveFile = () => {
    setLoading(true);

    setLoading(false);
  };

  return (
    <Card
      style={{ backgroundColor: isDarkTheme ? green : 'white', height: '75px' }}
      elevation={theme.palette.type === 'dark' ? 4 : 1}
    >
      <CardActionArea
        component={Link}
        enabled="false"
        style={{ height: '75px' }}
        onClick={saveFile}
      >
        <CardContent style={{ height: '75px' }}>
          {loading && <CustomLoader />}
          <Typography align="center" variant="body1">
            {code.toUpperCase()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

FarmerReportCard.propTypes = {
  code: PropTypes.string.isRequired,
  year: PropTypes.any,
  affiliation: PropTypes.string,
  data: PropTypes.any,
  color: PropTypes.any,
  type: PropTypes.string,
  apiKey: PropTypes.string,
};

export default FarmerReportCard;
