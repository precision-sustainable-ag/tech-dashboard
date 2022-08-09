import React, { useState, useEffect, Fragment } from 'react';
import { Grid } from '@material-ui/core';
import MaterialTable from 'material-table';
import { bannedRoles } from '../utils/constants';
import IssueDialogue from '../Comments/components/IssueDialogue/IssueDialogue';
import { BannedRoleMessage, CustomLoader } from '../utils/CustomComponents';
import { apiPassword, apiURL, apiUsername, onfarmAPI } from '../utils/api_secret';
import { useAuth0 } from '../Auth/react-auth0-spa';
import SharedToolbar from '../TableComponents/SharedToolbar';
import axios from 'axios';
import QueryString from 'qs';
import { useSelector } from 'react-redux';
import { SharedTableContainer } from '../TableComponents/SharedTableContainer';
import SharedTableOptions from '../TableComponents/SharedTableOptions';

const producersURL = `${onfarmAPI}/producers${
  process.env.NODE_ENV === 'development' ? `?options=showtest` : ``
}`;

const ProducerInformation = () => {
  const [tableData, setTableData] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [farmYears, setFarmYears] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [pickedYears, setPickedYears] = useState(['2022']);
  const [pickedAff, setPickedAff] = useState(['All']);
  const height = useSelector((state) => state.appData.windowHeight);
  // const [state] = useContext(Context);
  const userInfo = useSelector((state) => state.userInfo);
  const { user } = useAuth0();

  useEffect(() => {
    setLoading(true);
  }, [userInfo]);

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
        // setLoading(true);
        fetchProducers()
          .then((res) => {
            let modRes = res.map((rec) => {
              return {
                ...rec,
                years: rec.years.split('.').join(', '),
                codes: rec.codes.split('.').join(', '),
              };
            });

            let allYearsArr = [],
              allAffArr = [];

            modRes.map((record) => {
              const allYears = record.years.split(/[, ]+/);
              allYearsArr = allYearsArr.concat(allYears);
              record.yearArr = allYears;
              const findAff = record.producer_id.match(/[a-zA-Z]+/)[0];
              if (findAff && findAff != 'nonenone') {
                record.affiliation = findAff;
                allAffArr = allAffArr.concat(findAff);
              }
            });
            const allYearsUniqueAndSorted = [...new Set(allYearsArr)].sort();
            const allAffUniqueAndSorted = [...new Set(allAffArr)].sort();
            allAffUniqueAndSorted.unshift('All');

            setFarmYears(allYearsUniqueAndSorted);
            setAffiliations(allAffUniqueAndSorted);
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

  const filterData = () => {
    const yearsOverlap = (arr1, arr2) => {
      return arr1.some((item) => arr2.includes(item));
    };

    const filteredYears = tableData.filter((row) => yearsOverlap(pickedYears, row.years));

    const filteredAff = pickedAff.includes('All')
      ? filteredYears
      : filteredYears.filter((row) => pickedAff.includes(row.affiliation));

    return filteredAff;
  };

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

  return isAuthorized ? (
    <SharedTableContainer>
      <Grid container>
        {loading ? (
          <Grid item xs={12}>
            <CustomLoader />
          </Grid>
        ) : (
          <Fragment>
            <Grid item xs={12}>
              <MaterialTable
                style={{ minWidth: '985px' }}
                editable={
                  allowEditing() && {
                    onRowUpdate: (newData, oldData) => {
                      return new Promise((resolve, reject) => {
                        const { producer_id } = oldData;
                        const { email, last_name, phone, first_name } = newData;
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
                data={filterData()}
                title={
                  <SharedToolbar
                    farmYears={farmYears}
                    affiliations={affiliations}
                    pickedYears={pickedYears}
                    pickedAff={pickedAff}
                    setPickedAff={setPickedAff}
                    setPickedYears={setPickedYears}
                    name={'Producer Information'}
                  />
                }
                options={SharedTableOptions(height, 'Producer Information', true)}
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
                components={{
                  Groupbar: () => <></>,
                }}
              />
            </Grid>
          </Fragment>
        )}
      </Grid>
    </SharedTableContainer>
  ) : (
    <BannedRoleMessage title="Producer Information" />
  );
};

export default ProducerInformation;
