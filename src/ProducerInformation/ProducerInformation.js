import React, { useState, useEffect, Fragment } from 'react';
import { Grid } from '@material-ui/core';
// import { Context } from '../Store/Store';
import MaterialTable from 'material-table';
import { bannedRoles } from '../utils/constants';
import IssueDialogue from '../Comments/components/IssueDialogue/IssueDialogue';
import { BannedRoleMessage, CustomLoader } from '../utils/CustomComponents';
import { apiPassword, apiURL, apiUsername, onfarmAPI } from '../utils/api_secret';
import { useAuth0 } from '../Auth/react-auth0-spa';

import axios from 'axios';
import QueryString from 'qs';
import { useSelector } from 'react-redux';

const producersURL = `${onfarmAPI}/producers${
  process.env.NODE_ENV === 'development' ? `?options=showtest` : ``
}`;

const ProducerInformation = () => {
  const [tableData, setTableData] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

  // const [state] = useContext(Context);
  const userInfo = useSelector((state) => state.userInfo);
  const { user } = useAuth0();

  const allowEditing = () => {
    let permissions = userInfo.permissions;
    const allowedPermissions = ['edit', 'update', 'all'];

    return (
      permissions.split(',').some((i) => allowedPermissions.includes(i)) &&
      userInfo.view_type === 'home'
    );
  };

  const { getTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchProducers = async () => {
      let response = await fetch(producersURL, {
        headers: {
          'x-api-key': userInfo.apikey,
        },
      });

      return await response.json();
    };

    if (bannedRoles.includes(userInfo.role)) {
      setIsAuthorized(false);
    } else {
      if (userInfo.apikey && userInfo.apikey !== null) {
        setIsAuthorized(true);
        setLoading(true);
        fetchProducers()
          .then((res) => {
            let modRes = res.map((rec) => {
              return {
                ...rec,
                years: rec.years.split('.').join(', '),
                codes: rec.codes.split('.').join(', '),
              };
            });

            setTableData(modRes);
          })
          .then(() => {
            setLoading(false);
          })
          .catch((e) => {
            setLoading(false);
            console.error(e);
            setTableData([]);
          });
      } else {
        setIsAuthorized(false);
      }
    }
  }, [userInfo.apikey, userInfo.role]);

  //let height = window.innerHeight;

  const [height, setHeight] = useState(window.innerHeight);

  const handleResize = () => {
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize, false);
  }, []);

  // scale height
  // if (height < 900 && height > 600) {
  //   height -= 130;
  // } else if (height < 600) {
  //   height -= 200;
  // }

  const tableHeaderOptions = [
    {
      title: 'Producer ID',
      field: 'producer_id',
      type: 'string',
      align: 'justify',
      editable: 'never',
    },
    {
      title: 'First Name',
      field: 'first_name',
      type: 'string',
      align: 'justify',
      editable: 'always',
    },
    {
      title: 'Last Name or Organization Name',
      field: 'last_name',
      type: 'string',
      align: 'justify',
      editable: 'always',
    },
    {
      title: 'Site Codes',
      field: 'codes',
      type: 'string',
      align: 'justify',
      editable: 'never',
    },
    {
      title: 'Years',
      field: 'years',
      type: 'string',
      align: 'justify',
      editable: 'never',
    },

    {
      title: 'Email',
      field: 'email',
      type: 'string',
      align: 'justify',
      editable: 'always',
    },
    {
      title: 'Phone',
      field: 'phone',
      type: 'string',
      align: 'justify',
      editable: 'always',
    },
  ];

  const tableOptions = () => ({
    padding: 'dense',
    exportButton: true,
    exportFileName: 'Producer Information',
    addRowPosition: 'first',
    exportAllData: false,
    // pageSizeOptions: [5, 10, 20, tableData.length],
    // pageSize: tableData.length,
    paging: false,
    groupRowSeparator: '  ',
    grouping: true,
    headerStyle: {
      fontWeight: 'bold',
      fontFamily: 'Bilo, sans-serif',
      fontSize: '0.8em',
      textAlign: 'justify',
      position: 'sticky',
      top: 0,
    },
    rowStyle: {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '0.8em',
      textAlign: 'justify',
    },
    selection: false,
    searchAutoFocus: true,
    toolbarButtonAlignment: 'left',
    actionsColumnIndex: 0,
    maxBodyHeight: height - 250,
  });

  return isAuthorized ? (
    <Grid container>
      {loading ? (
        <Grid item xs={12}>
          <CustomLoader />
        </Grid>
      ) : (
        <Fragment>
          <Grid item xs={12}>
            <MaterialTable
              editable={
                allowEditing() && {
                  onRowUpdate: (newData, oldData) => {
                    return new Promise((resolve, reject) => {
                      const { producer_id } = oldData;
                      const { email, last_name, phone, first_name } = newData;
                      // const filteredData = tableData.filter((records) => records.producer_id !== producer_id);
                      if (!producer_id) {
                        reject('Producer id missing');
                      } else {
                        const preparedData = {
                          first_name: first_name || '',
                          last_name: last_name || '',
                          email: email || '',
                          phone: phone || '',
                        };

                        axios({
                          url: `${apiURL}/api/producers/${producer_id}`,
                          method: 'POST',
                          data: QueryString.stringify(preparedData),
                          auth: {
                            username: apiUsername,
                            password: apiPassword,
                          },
                        })
                          .then((res) => {
                            if (res.data.data) {
                              const dataUpdate = [...tableData];
                              const index = oldData.tableData.id;
                              dataUpdate[index] = newData;
                              setTableData([...dataUpdate]);
                            }
                          })
                          .then(() => {
                            resolve();
                          })
                          .catch((e) => {
                            reject(e);
                          });
                      }
                    });
                  },
                }
              }
              columns={tableHeaderOptions}
              data={tableData}
              title="Producer Information"
              options={tableOptions()}
              detailPanel={[
                {
                  tooltip: 'Add Comments',
                  icon: 'comment',

                  openIcon: 'message',
                  // eslint-disable-next-line react/display-name
                  render: (rowData) => {
                    return (
                      <IssueDialogue
                        nickname={user.nickname}
                        rowData={rowData}
                        dataType="table"
                        labels={['producer-information'].concat(
                          rowData.codes.replace(/\s/g, '').split(','),
                        )}
                        getTokenSilently={getTokenSilently}
                      />
                    );
                  },
                },
              ]}
            />
          </Grid>
        </Fragment>
      )}
    </Grid>
  ) : (
    <BannedRoleMessage title="Producer Information" />
  );
};

export default ProducerInformation;
