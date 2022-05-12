// Dependency Imports
import React, { useState, useEffect, Fragment } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardHeader,
  CardContent,
  TableContainer,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Button,
  TableHead,
  Link,
} from '@material-ui/core';
import PropTypes from 'prop-types';

// Local Imports
// import { Context } from '../Store/Store';
import { useAuth0 } from '../Auth/react-auth0-spa';
import { bannedRoles, fetchKoboPasswords, ucFirst } from '../utils/constants';
import { BannedRoleMessage } from '../utils/CustomComponents';
import { useSelector } from 'react-redux';

/**
 * Logged in User's Profile Page
 */

const Profile = () => {
  // const [state] = useContext(Context);
  const userInfo = useSelector((state) => state.theStore.userInfo);
  const { isAuthenticated, user } = useAuth0();
  const [koboDetails, setKoboDetails] = useState({
    data: [],
    allStates: false,
  });

  useEffect(() => {
    if (userInfo.state) {
      const response = fetchKoboPasswords({
        state: userInfo.state,
        showAllStates: userInfo.state.toLowerCase() === 'all' ? true : false,
      });
      response.then(({ status, data, showAllStates }) => {
        if (status === 'success') {
          setKoboDetails({ data: data, allStates: showAllStates });
        } else {
          console.error(data);
        }
      });
    }
    return () => {};
  }, [userInfo.state]);

  return (
    isAuthenticated &&
    (bannedRoles.includes(userInfo.role) || bannedRoles.includes(userInfo.state) ? (
      <BannedRoleMessage title="profile page" />
    ) : (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Welcome, {user.name || user.nickname}</Typography>
        </Grid>

        {Object.keys(userInfo).length > 0 && (
          <Grid item container xs={12} spacing={3}>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardHeader title="Github Details" />
                <CardContent style={{ minHeight: '50vh' }}>
                  <RenderGithubDetails user={user} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardHeader title="Account Details" />
                <CardContent style={{ minHeight: '50vh' }}>
                  <RenderGeneralInfo userInfo={userInfo} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardHeader title="Kobo Details" />
                <CardContent style={{ minHeight: '50vh' }}>
                  <RenderKoboDetails koboData={koboDetails} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Grid>
    ))
  );
};

const RenderGeneralInfo = ({ userInfo }) => {
  const invisibleKeys = ['data', 'updated', 'userid'];
  const transformKey = (key = '', val) => {
    return key === 'apikey'
      ? 'api key'
      : key === 'state'
      ? val.split(',').length > 1 || val === 'all'
        ? 'States'
        : 'State'
      : key.replace('_', ' ');
  };
  const transformVal = (key = '', val = '') => {
    const stringSplitter = (val = '') => {
      return val.split(',').reduce((accumulator, current, index, arr) => {
        if (arr.length === 1) return current;
        else {
          if (index === arr.length - 1) {
            return accumulator + ' and ' + current;
          } else if (index === 0) {
            return `${current}`;
          } else {
            return `${accumulator}, ${current}`;
          }
        }
      }, '');
    };

    switch (key) {
      case 'state':
        return val.toLowerCase() === 'all' ? 'All' : stringSplitter(val);

      case 'permissions':
        return ucFirst(stringSplitter(val)).replace('And', 'and');

      case 'role':
        return ucFirst(val);

      case 'view_protected':
        return val === 1 ? 'Yes' : 'No';

      default:
        return val;
    }
  };
  return (
    <TableContainer>
      <Table>
        <TableBody>
          {Object.keys(userInfo).length > 0 &&
            Object.keys(userInfo).map((key, index) =>
              invisibleKeys.includes(key) ? (
                ''
              ) : (
                <TableRow key={`userinfo${index}`}>
                  <TableCell>
                    <Typography variant="body1">
                      {ucFirst(transformKey(key, userInfo[key]))}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {key === 'apikey'
                        ? showAPIKey(userInfo[key])
                        : transformVal(key, userInfo[key])}
                    </Typography>
                  </TableCell>
                </TableRow>
              ),
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const RenderGithubDetails = ({ user }) => {
  const invisibleKeys = ['picture', 'updated_at', 'email_verified'];
  return (
    <TableContainer>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography variant="body1">Profile</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1">GitHub</Typography>
            </TableCell>
          </TableRow>
          {Object.keys(user).map(
            (userKey, index) =>
              !invisibleKeys.includes(userKey) && (
                <TableRow key={`githubRow${index}`}>
                  <TableCell>
                    <Typography variant="body1">{ucFirst(userKey)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{user[userKey]}</Typography>
                  </TableCell>
                </TableRow>
              ),
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
const RenderKoboDetails = ({ koboData = { data: [{}], allStates: false } }) => {
  return koboData.data.length > 0 ? (
    <Fragment>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="body1">State</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">Username</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">Password</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {koboData.data.map((item, index) => (
              <TableRow key={`koboTableRow${index}`}>
                <TableCell>
                  <Typography variant="body1">{item.state}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{item.kobo_account}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{item.password}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Link href="https://docs.google.com/document/d/1rsSmhmEXTms_MDP745cyEUPTWbbvA34DU4A3jPc34qI/edit">
        <Typography>How to login</Typography>
      </Link>
    </Fragment>
  ) : (
    ''
  );
};

const showAPIKey = (apiKey) => {
  return (
    <span
      id="showAPIKeyBtn"
      style={{
        fontFamily: 'Menlo, sans-serif',
        fontSize: '0.8em',
        fontStyle: 'italic',
      }}
    >
      {apiKey ? (
        <Button
          onClick={() => (document.getElementById('showAPIKeyBtn').innerHTML = apiKey)}
          size="small"
        >
          Show
        </Button>
      ) : (
        'N/A'
      )}
    </span>
  );
};

RenderGeneralInfo.propTypes = {
  userInfo: PropTypes.object.isRequired,
};

RenderGithubDetails.propTypes = {
  user: PropTypes.object.isRequired,
};

RenderKoboDetails.propTypes = {
  koboData: PropTypes.shape({
    data: PropTypes.array.isRequired,
  }).isRequired,
  allStates: PropTypes.bool,
};

showAPIKey.propTypes = {
  apiKey: PropTypes.string.isRequired,
};

export default Profile;
