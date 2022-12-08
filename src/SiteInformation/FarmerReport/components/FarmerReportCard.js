import React from 'react';
import { Typography, Card, CardContent, CardActionArea, useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';
import { green } from '@material-ui/core/colors';
import fileDownload from 'js-file-download';
import { useSelector } from 'react-redux';
import { callAzureFunction } from '../../../utils/SharedFunctions';
import { useAuth0 } from '../../../Auth/react-auth0-spa';
import { useDispatch } from 'react-redux';
import { setSnackbarData } from '../../../Store/actions';

const FarmerReportCard = (props) => {
  let { code, setDownloading } = props;
  const { getTokenSilently } = useAuth0();
  const theme = useTheme();
  const isDarkTheme = useSelector((state) => state.userInfo.isDarkTheme);
  const dispatch = useDispatch();

  const saveFile = () => {
    setDownloading(true);
    /**fetch data*/
    callAzureFunction(null, `report/${code}`, 'GET', getTokenSilently, 'blob')
      .then((res) => {
        /** download data */
        if (res.blobResponse && res.response.status === 201) {
          fileDownload(res.blobResponse, `${code.toUpperCase()}-Report.docx`);
          dispatch(
            setSnackbarData({
              open: true,
              text: 'Download Success!',
              severity: 'success',
            }),
          );
        } else {
          dispatch(
            setSnackbarData({
              open: true,
              text: 'Download Failed. Response status returned failure.',
              severity: 'failure',
            }),
          );
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(
          setSnackbarData({
            open: true,
            text: 'Download Failed. Fetching failed.',
            severity: 'failure',
          }),
        );
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
