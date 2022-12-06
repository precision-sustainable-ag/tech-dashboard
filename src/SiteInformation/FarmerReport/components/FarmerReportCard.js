import React from 'react';
import { Typography, Card, CardContent, CardActionArea, useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';
import { green } from '@material-ui/core/colors';
import fileDownload from 'js-file-download';
import { useSelector } from 'react-redux';
import { callAzureFunction } from '../../../utils/SharedFunctions';
import { useAuth0 } from '../../../Auth/react-auth0-spa';

//`${code.toUpperCase()}-Report.docx`
const FarmerReportCard = (props) => {
  let { code, setDownloading } = props;
  const { getTokenSilently } = useAuth0();
  const theme = useTheme();
  const isDarkTheme = useSelector((state) => state.userInfo.isDarkTheme);

  const saveFile = () => {
    setDownloading(true);
    callAzureFunction(null, `report/${code}`, 'GET', getTokenSilently)
      .then((res) => res.response.blob)
      .then((blob) => {
        fileDownload(blob.data, `${code.toUpperCase()}-Report.docx`);
        // const url = window.URL.createObjectURL(new Blob([blob]));
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', `${code.toUpperCase()}-Report.docx`);
        // document.body.appendChild(link);
        // link.click();
        // link.parentNode.removeChild(link);
      })
      .finally(() => {
        setDownloading(false);
      });
  };

  return (
    <Card
      style={{ backgroundColor: isDarkTheme ? green : 'white', height: '75px' }}
      elevation={theme.palette.type === 'dark' ? 4 : 1}
    >
      <CardActionArea enabled="false" style={{ height: '75px' }} onClick={saveFile}>
        <CardContent style={{ height: '75px' }}>
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
  setDownloading: PropTypes.func.isRequired,
};

export default FarmerReportCard;
