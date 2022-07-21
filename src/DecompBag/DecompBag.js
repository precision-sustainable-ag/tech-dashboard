import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { onfarmAPI } from '../utils/api_secret';
// import { Context } from '../Store/Store';
import { CustomLoader } from '../utils/CustomComponents';
import IssueDialogue from '../Comments/components/IssueDialogue/IssueDialogue';
import { useAuth0 } from '../Auth/react-auth0-spa';
import MaterialTable from 'material-table';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setIssueDialogData } from '../Store/actions';
const _ = require('lodash');

const DecompBag = () => {
  const history = useHistory();
  const originalData = history.location.state.data;
  // const [state] = useContext(Context);
  const userInfo = useSelector((state) => state.userInfo);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  //const { getTokenSilently } = useAuth0();
  const { user } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async (apiKey) => {
      setLoading(true);
      const decompBag_url =
        onfarmAPI +
        `/raw?table=decomp_bag&output=json&code=` +
        originalData.code.toUpperCase() +
        `&year=` +
        originalData.year;

      const fetchRecords = async (url) => {
        try {
          const response = await fetch(url, {
            headers: {
              'x-api-key': apiKey,
            },
          });
          return await response.json();
        } catch (e) {
          console.error('API Error', e);
        }
      };

      const allJoined = await fetchRecords(decompBag_url);

      const uniq = _.uniqWith(allJoined, _.isEqual);
      // console.log(uniq);
      setData(uniq);
      setLoading(false);
    };

    if (!userInfo.apikey) return false;

    fetchData(userInfo.apikey);

    return () => {
      const location = {
        ...history.location,
        state: { previousState: originalData },
      };
      history.push(location);
    };
  }, []);

  //const height = window.innerHeight;

  const [height, setHeight] = useState(window.innerHeight);

  const handleResize = () => {
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize, false);
  }, []);

  const tableHeaderOptions = [
    {
      title: 'Year',
      field: 'year',
      type: 'numeric',
      align: 'justify',
    },
    {
      title: 'Code',
      field: 'code',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Rep',
      field: 'subplot',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Subsample',
      field: 'subsample',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Pickup #',
      field: 'time',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Grower',
      field: 'last_name',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Affiliation',
      field: 'affiliation',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Empty Bag Wt',
      field: 'empty_bag_wt',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Fresh Biomass Wt',
      field: 'fresh_biomass_wt',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Dry Biomass Wt',
      field: 'dry_biomass_wt',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Recovery Date',
      field: 'recovery_date',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Percent N',
      field: 'percent_n',
      type: 'string',
      align: 'justify',
    },
    {
      title: 'Percent C',
      field: 'percent_c',
      type: 'string',
      align: 'justify',
    },
  ];

  return (
    <Grid container>
      {loading ? (
        <CustomLoader />
      ) : (
        <Grid item xs={12}>
          <MaterialTable
            columns={tableHeaderOptions}
            data={data}
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
                    {'Decomp Bags'}
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant={'caption'}
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {'All weights in grams'}
                  </Typography>
                </div>
              </div>
            }
            options={{
              padding: 'default',
              exportButton: false,
              exportFileName: 'Site Information',
              addRowPosition: 'last',
              exportAllData: false,
              // pageSizeOptions: [20, 50, 100, data.length],
              // pageSize: 20,
              paging: false,
              groupRowSeparator: '  ',
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
                      labels: ['decomp', rowData.year, rowData.code, rowData.affiliation],
                      setShowNewIssueDialog: true,
                    }),
                  );
                  return (
                    <IssueDialogue
                    // nickname={user.nickname}
                    // rowData={rowData}
                    // dataType="table"
                    // labels={['decomp', rowData.year, rowData.code, rowData.affiliation]}
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

export default DecompBag;
