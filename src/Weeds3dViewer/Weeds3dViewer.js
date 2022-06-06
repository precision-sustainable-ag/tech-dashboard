import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { callAzureFunction } from '../utils/SharedFunctions';
import { useAuth0 } from '../Auth/react-auth0-spa';
import { Grid, Snackbar } from '@material-ui/core';
import MaterialTable from 'material-table';
import Typography from '@material-ui/core/Typography';
import IssueDialogue from '../Comments/IssueDialogue';
import { useSelector } from 'react-redux';
import { CustomLoader } from '../utils/CustomComponents';
import { onfarmAPI } from '../utils/api_secret';
import MuiAlert from '@material-ui/lab/Alert';

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const fetchCodes = async (apikey) => {
  let listOfCodes = [];
  await axios({
    method: 'GET',
    url: onfarmAPI + '/raw?output=json&table=site_information',
    headers: {
      'x-api-key': apikey,
    },
    responseType: 'json',
    timeout: 5000,
  })
    .then((res) => {
      const data = res.data;
      Object.keys(data).forEach((key) => {
        listOfCodes.push(data[key].code);
      });
    })
    .catch((err) => {
      console.log('API error: ' + err);
    });

  return listOfCodes;
};

const fetchAPIData = async (codes, getTokenSilently, setVideos, setLoading) => {
  const data = { codes: codes };
  await callAzureFunction(data, '/weeds3d/videos', 'POST', getTokenSilently)
    .then((res) => {
      setVideos(res.jsonResponse.files);
      setLoading(false);
    })
    .catch((err) => {
      console.log('API error: ' + err);
    });
};

const Weeds3dViewer = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((state) => state.userInfo);
  const { getTokenSilently } = useAuth0();
  const { user } = useAuth0();
  const height = window.innerHeight;
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: '',
    severity: 'success',
  });

  const tableHeaderOptions = [
    {
      title: 'Code',
      field: 'code',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Timing Number',
      field: 'timing_number',
      type: 'numeric',
      align: 'justify',
    },
    {
      title: 'Treatment',
      field: 'treatment',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Subplot',
      field: 'subplot',
      type: 'numeric',
      align: 'justify',
    },
    {
      title: 'Crop',
      field: 'crop',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Date',
      field: 'last_modified',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Video Number',
      field: 'video_number',
      type: 'numeric',
      align: 'justify',
    },
    {
      title: 'File Size',
      field: 'file_size',
      type: 'numeric',
      align: 'justify',
    },
  ];

  useEffect(() => {
    const fetchData = async (apikey) => {
      const codes = await fetchCodes(apikey);
      await fetchAPIData(codes, getTokenSilently, setVideos, setLoading);
    };

    if (!userInfo.apikey) return false;
    fetchData(userInfo.apikey);
  }, [getTokenSilently, userInfo.apikey]);

  return (
    <Grid container>
      {loading ? (
        <CustomLoader />
      ) : (
        <Grid item lg={12}>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={snackbarData.open}
            autoHideDuration={10000}
            onClose={() => setSnackbarData({ ...snackbarData, open: !snackbarData.open })}
          >
            <Alert severity={snackbarData.severity}>{snackbarData.text}</Alert>
          </Snackbar>
          <MaterialTable
            columns={tableHeaderOptions}
            data={videos}
            title={
              <div>
                <div>
                  <Typography
                    variant={'h6'}
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {'Weeds 3d Videos'}
                  </Typography>
                </div>
              </div>
            }
            options={{
              paging: false,
              defaultExpanded: false,
              padding: 'default',
              exportButton: false,
              exportFileName: 'Weeds 3d Videos',
              addRowPosition: 'last',
              exportAllData: false,
              groupRowSeparator: '   ',
              grouping: true,
              headerStyle: {
                fontWeight: 'bold',
                fontFamily: 'Bilo, sans-serif',
                fontSize: '0.8em',
                textAlign: 'left',
                position: 'sticky',
                top: 0,
              },
              rowStyle: {
                fontFamily: 'Roboto, sans-serif',
                fontSize: '0.8em',
                textAlign: 'left',
              },
              selection: false,
              searchAutoFocus: true,
              toolbarButtonAlignment: 'left',
              actionsColumnIndex: 1,
              maxBodyHeight: height * 0.7,
            }}
            detailPanel={[
              {
                tooltip: 'Add Comments',
                icon: 'comment',

                openIcon: 'message',
                render: (rowData) => {
                  return (
                    <IssueDialogue
                      nickname={user.nickname}
                      rowData={rowData}
                      dataType="table"
                      setSnackbarData={setSnackbarData}
                      labels={[
                        'weeds3D',
                        rowData.code,
                        rowData.timing_number,
                        rowData.treatment,
                        rowData.subplot,
                        rowData.video_number,
                      ]}
                      getTokenSilently={getTokenSilently}
                    />
                  );
                },
              },
            ]}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default Weeds3dViewer;
