import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { callAzureFunction } from '../utils/SharedFunctions';
import { useAuth0 } from '../Auth/react-auth0-spa';
import { Grid, Tooltip } from '@material-ui/core';
import MaterialTable from 'material-table';
import Typography from '@material-ui/core/Typography';
import IssueDialogue from '../Comments/components/IssueDialogue/IssueDialogue';
import { useSelector } from 'react-redux';
import { CustomLoader } from '../utils/CustomComponents';
import { onfarmAPI } from '../utils/api_secret';
import { Info, Error, CheckCircle } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { setIssueDialogData } from './../Store/actions';

const Weeds3dViewer = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearsAndAffiliations, setYearsAndAffiliations] = useState([]);
  const userInfo = useSelector((state) => state.userInfo);
  const { getTokenSilently } = useAuth0();
  const { user } = useAuth0();
  //const height = window.innerHeight;
  const dispatch = useDispatch();

  const [height, setHeight] = useState(window.innerHeight);

  const handleResize = () => {
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize, false);
  }, []);

  const tableHeaderOptions = [
    {
      title: 'Affiliation',
      align: 'justify',
      render: (rowData) => {
        return yearsAndAffiliations[rowData.code]
          ? yearsAndAffiliations[rowData.code].affiliation
          : null;
      },
    },
    {
      title: 'Year',
      align: 'justify',
      render: (rowData) => {
        return yearsAndAffiliations[rowData.code] ? yearsAndAffiliations[rowData.code].year : null;
      },
    },
    {
      title: 'Code',
      field: 'code',
      type: 'string',
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
      title: 'Timing Number',
      field: 'timing_number',
      type: 'numeric',
      align: 'justify',
    },
    {
      title: 'Video Number',
      field: 'video_number',
      type: 'numeric',
      align: 'justify',
    },
    {
      title: 'Date',
      field: 'last_modified',
      type: 'date',
      align: 'justify',
    },
    {
      title: 'File Size',
      field: 'file_size',
      type: 'numeric',
      align: 'justify',
      render: (rowData) => {
        return convertToMB(rowData.file_size) + ' MB';
      },
    },
    {
      title: 'File Info',
      align: 'justify',
      render: (rowData) => {
        return convertToMB(rowData.file_size) < 25 ? (
          <Tooltip title="This file size is too small">
            <Error style={{ color: 'red' }} />
          </Tooltip>
        ) : convertToMB(rowData.file_size) > 750 ? (
          <Tooltip title="This file size is good">
            <CheckCircle style={{ color: 'green' }} />
          </Tooltip>
        ) : (
          <Tooltip title="Is this a file for a plot with no-weeds?">
            <Info style={{ color: 'yellow' }} />
          </Tooltip>
        );
      },
    },
  ];

  const convertToMB = (bytes) => {
    const bytesToMegaBytes = bytes / 1024 ** 2;
    return Math.round(bytesToMegaBytes);
    //Math.round(bytesToMegaBytes * 10 ) / 10;
  };

  const fetchCodes = async (apikey) => {
    // calls the site_information API and gets a list of sites
    await axios({
      method: 'GET',
      url: onfarmAPI + '/raw?output=json&table=site_information',
      headers: {
        'x-api-key': apikey,
      },
      responseType: 'json',
      timeout: 5000,
    })
      //iterates over sites objects and compiles a list of site codes
      .then((res) => {
        let listOfCodes = [];
        let yearsAndAffiliationsDict = {};

        const data = res.data;
        Object.keys(data).forEach((key) => {
          listOfCodes.push(data[key].code);

          yearsAndAffiliationsDict[data[key].code] = {
            year: data[key].year,
            affiliation: data[key].affiliation,
          };
        });

        setYearsAndAffiliations(yearsAndAffiliationsDict);

        return listOfCodes;
      })
      // feeds list of site codes to weeds 3d API and gets list of video files, sets state
      .then(async (res) => {
        const data = { codes: res };
        const files = await callAzureFunction(data, '/weeds3d/videos', 'POST', getTokenSilently);
        setVideos(files.jsonResponse.files);
        setLoading(false);
      })
      .catch((err) => {
        console.log('API error: ' + err);
      });
  };

  useEffect(() => {
    const fetchData = async (apikey) => {
      await fetchCodes(apikey);
      //await fetchAPIData(codes, getTokenSilently, setVideos, setLoading);
      //await fetchYearsAndAffiliations(videos);
    };

    if (!userInfo.apikey) return false;
    fetchData(userInfo.apikey);
  }, [getTokenSilently, userInfo.apikey]);

  console.log(yearsAndAffiliations);

  return (
    <Grid container>
      {loading ? (
        <CustomLoader />
      ) : (
        <Grid item lg={12}>
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
              //rowData as prop
              rowStyle: () => ({
                fontFamily: 'Roboto, sans-serif',
                fontSize: '0.8em',
                textAlign: 'left',
                // backgroundColor:
                //   convertToMB(rowData.file_size) < 25
                //     ? '#A61C3C'
                //     : convertToMB(rowData.file_size) > 750
                //     ? '#2F7C31'
                //     : '#1E3888',
              }),
              selection: false,
              searchAutoFocus: true,
              toolbarButtonAlignment: 'left',
              actionsColumnIndex: 1,
              maxBodyHeight: height - 250,
            }}
            detailPanel={[
              {
                tooltip: 'Add Comments',
                icon: 'comment',
                openIcon: 'message',
                // eslint-disable-next-line react/display-name
                render: (rowData) => {
                  dispatch(
                    setIssueDialogData({
                      nickname: user.nickname,
                      rowData: rowData,
                      dataType: 'table',
                      labels: ['weeds3d', rowData.code],
                      setShowNewIssueDialog: true,
                    }),
                  );
                  return (
                    <IssueDialogue
                    // nickname={user.nickname}
                    // rowData={rowData}
                    // dataType="table"
                    // labels={['weeds3d', rowData.code]}
                    // getTokenSilently={getTokenSilently}
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
