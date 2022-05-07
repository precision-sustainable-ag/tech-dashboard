/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
// Dependency Imports
import React, { useContext, useState, useEffect } from 'react';
// import Axios from "axios";
import Loading from 'react-loading';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
// import MaterialTable from 'material-table';
// import { Edit, DeleteForever, Search, QuestionAnswer, Store } from '@material-ui/icons';

// Local Imports
import { Context } from '../Store/Store';
import { bannedRoles } from '../utils/constants';
import EditDataModal from './EditDataModal';
import UnenrollSiteModal from './UnenrollSiteModal';
import NewIssueModal from './NewIssueModal';
import ReassignDataModal from './ReassignDataModal';
import MapModal from './MapModal';
// import FeatureModal from './FeatureModal'; 
import { BannedRoleMessage } from '../utils/CustomComponents';
import { onfarmAPI } from '../utils/api_secret';
// import { UserIsEditor } from '../utils/SharedFunctions';
import { useAuth0 } from '../Auth/react-auth0-spa';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import TableModal from './TableModal';
const siteInfoAPI_URL = `${onfarmAPI}/raw?output=json&table=site_information${
  process.env.NODE_ENV === 'development' ? `&options=showtest` : ``
}`;

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/**
 * Site information table component
 */

// Default function
const AllDataTable = (props) => {
  const [state, dispatch] = useContext(Context);
  const [showTable, setShowTable] = useState(false);
  const { user } = useAuth0();
  const [bannedRolesCheckMessage, setBannedRolesCheckMessage] = useState(
    'Checking your permissions..',
  );
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: '',
    severity: 'success',
  });

  let height = window.innerHeight;

  // scale height
  if (height < 900 && height > 600) {
    height -= 130;
  } else if (height < 600) {
    height -= 200;
  }

  useEffect(() => {
    const init = () => {
      if (Object.keys(state.userInfo).length > 0) {
        if (state.userInfo.role) {
          if (bannedRoles.includes(state.userInfo.role)) {
            setShowTable(false);
            setBannedRolesCheckMessage(<BannedRoleMessage title="All Contact and Location" />);
          } else {
            setShowTable(true);
          }
        }
        if (state.userInfo.apikey) {
          let records = fetch(siteInfoAPI_URL, {
            headers: {
              'x-api-key': state.userInfo.apikey,
            },
          });

          records.then((response) => {
            let res = response.json();
            console.log(res);
            res
              .then((records) => {
                return parseXHRResponse({ status: 'success', data: records });
              })
              .then((resp) => {
                if (resp) {
                  console.log(resp);
                  setLoading(false);
                } else {
                  setLoading(true);
                  console.log('Check API');
                }
              });
              dispatch({
                type: 'SET_VALUES_EDITED',
                data: {
                  valuesEdited: false,
                },        
              });
          });
        }
      }
    };

    init();
  }, [state.userInfo, state.valuesEdited]);

  const parseXHRResponse = (data) => {
    if (data.status === 'success') {
      let responseData = data.data;
      let modifiedData = responseData.map((data) => {
        return {
          ...data,
          // county: data.county ? data.county : "Not Provided",
          // email: data.email ? data.email : "Not Provided",
          // address: data.address ? data.address : "Not Provided",
          latlng:
            data.latitude !== null && data.longitude !== null
              ? data.latitude !== '-999' && data.longitude !== '-999'
                ? `${data.latitude},${data.longitude}`
                : '-999'
              : '',
          year: parseInt(data.year),
        };
      });

      let finalData = modifiedData.filter((data) => {
        if (data.protocols_enrolled === '-999') {
          return false;
        } else return true;
      });
      setTableData(finalData);
      return true;
    } else {
      return false;
    }
  };

  return showTable ? (
    loading ? (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Loading type="bars" width="200px" height="200px" color="#3f51b5" />
      </div>
    ) : (
      <div>
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
        <TableModal 
          tableData={tableData}
          isDarkTheme={props.isDarkTheme}
          height={height}
          activeSites={true}
          tableTitle={"Contact and Location"}
        />
        <EditDataModal />
        <ReassignDataModal />
        <UnenrollSiteModal />
        <NewIssueModal
          setSnackbarData={setSnackbarData}
          snackbarData={snackbarData}
          nickname={user.nickname}
        />
        <MapModal />
      </div>
    )
  ) : (
    bannedRolesCheckMessage
  );
};

AllDataTable.propTypes = {
  /** Is dark theme enabled? */
};

export default AllDataTable;