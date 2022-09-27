import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { callAzureFunction } from '../utils/SharedFunctions';
import { useAuth0 } from '../Auth/react-auth0-spa';
import { Grid, Tooltip } from '@material-ui/core';
import MaterialTable from 'material-table';
import IssueDialogue from '../Comments/components/IssueDialogue/IssueDialogue';
import { useSelector } from 'react-redux';
import { CustomLoader } from '../utils/CustomComponents';
import { onfarmAPI } from '../utils/api_secret';
import { Info, Error, CheckCircle } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { setIssueDialogueData } from './../Store/actions';
import SharedToolbar from '../TableComponents/SharedToolbar';
import SharedTableOptions from '../TableComponents/SharedTableOptions';
import { SharedTableContainer } from '../TableComponents/SharedTableContainer';

const Weeds3dViewer = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [yearsAndAffiliations, setYearsAndAffiliations] = useState([]);
  const userInfo = useSelector((state) => state.userInfo);
  const { getTokenSilently } = useAuth0();
  const { user } = useAuth0();
  const dispatch = useDispatch();
  const [farmYears, setFarmYears] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [pickedYears, setPickedYears] = useState(['2022']);
  const [pickedAff, setPickedAff] = useState(['All']);
  const height = useSelector((state) => state.appData.windowHeight);
  // const userAPIKey = useSelector((state) => state.userInfo.apikey);

  useEffect(() => {
    dispatch(
      setIssueDialogueData({
        nickname: user.nickname,
        dataType: 'table',
        setShowNewIssueDialogue: true,
      }),
    );
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
  };

  const fetchCodes = async (apikey) => {
    // setLoading(true);
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
        let listOfYears = [];
        let listOfAff = [];

        const data = res.data;
        Object.keys(data).forEach((key) => {
          listOfCodes.push(data[key].code);

          yearsAndAffiliationsDict[data[key].code] = {
            year: data[key].year,
            affiliation: data[key].affiliation,
          };

          listOfYears.push(data[key].year);
          listOfAff.push(data[key].affiliation);
        });

        const allYearsUniqueAndSorted = [...new Set(listOfYears)].sort();
        const allAffUniqueAndSorted = [...new Set(listOfAff)].sort();

        setYearsAndAffiliations(yearsAndAffiliationsDict);
        setAffiliations(allAffUniqueAndSorted);
        setFarmYears(allYearsUniqueAndSorted);

        return listOfCodes;
      })
      // feeds list of site codes to weeds 3d API and gets list of video files, sets state
      .then(async (res) => {
        const data = { codes: res };
        const files = await callAzureFunction(data, '/weeds3d/videos', 'POST', getTokenSilently);

        if (files.jsonResponse.status === 'success') {
          setVideos(files.jsonResponse.files);
        } else {
          setVideos([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log('API error: ' + err);
      });
  };

  useEffect(() => {
    setLoading(true);
  }, [userInfo]);

  useEffect(() => {
    const fetchData = async (apikey) => {
      await fetchCodes(apikey);
    };

    if (!userInfo.apikey) return false;
    fetchData(userInfo.apikey);
  }, [getTokenSilently, userInfo.apikey]);

  const filterData = () => {
    const filteredYears = videos.filter((row) => {
      if (yearsAndAffiliations[row.code]) {
        return pickedYears.includes(yearsAndAffiliations[row.code].year);
      } else {
        return false;
      }
    });

    const filteredAff = pickedAff.includes('All')
      ? filteredYears
      : filteredYears.filter((row) =>
          pickedAff.includes(yearsAndAffiliations[row.code].affiliation),
        );

    return filteredAff;
  };

  return (
    <SharedTableContainer>
      <Grid container>
        {loading ? (
          <CustomLoader />
        ) : (
          <Grid item lg={12}>
            <MaterialTable
              columns={tableHeaderOptions}
              data={filterData()}
              title={
                <SharedToolbar
                  farmYears={farmYears}
                  affiliations={affiliations}
                  pickedYears={pickedYears}
                  pickedAff={pickedAff}
                  setPickedAff={setPickedAff}
                  setPickedYears={setPickedYears}
                  name={'Weeds 3d Videos'}
                />
              }
              options={SharedTableOptions(height, 'Weeds 3d Videos', false)}
              detailPanel={[
                {
                  tooltip: 'Add Comments',
                  icon: 'comment',
                  openIcon: 'message',
                  // eslint-disable-next-line react/display-name
                  render: (rowData) => {
                    return <IssueDialogue rowData={rowData} labels={['weeds3d', rowData.code]} />;
                  },
                },
              ]}
              components={{
                Groupbar: () => <></>,
              }}
            />
          </Grid>
        )}
      </Grid>
    </SharedTableContainer>
  );
};

export default Weeds3dViewer;
