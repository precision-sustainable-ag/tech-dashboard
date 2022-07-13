// Dependency Imports
import React, { useState, useEffect } from 'react';
import Loading from 'react-loading';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useSelector } from 'react-redux';

// Local Imports
import { bannedRoles } from '../../utils/constants';
import EditLocationModal from '../shared/EditLocationModal/EditLocationModal';
import UnenrollSiteModal from './components/UnenrollSiteModal/UnenrollSiteModal';
import EditProtocolModal from './components/EditProtocolsModal/EditProtocolsModal';
import NewIssueModal from './components/NewIssueModal/NewIssueModal';
import ReassignDataModal from './components/ReassignDataModal/ReassignDataModal';
import MapModal from './components/MapModal/MapModal';
import { BannedRoleMessage } from '../../utils/CustomComponents';
import { onfarmAPI } from '../../utils/api_secret';
import { useAuth0 } from '../../Auth/react-auth0-spa';
import TableModal from './components/TableModal/TableModal';
import PropTypes from 'prop-types';
import EditCashCropModal from './components/EditCashCropModal/EditCashCropModal';
import { cleanAff, cleanYears } from '../../TableComponents/SharedTableFunctions';

const siteInfoAPI_URL = `${onfarmAPI}/raw?output=json&table=site_information&options=showtest, include_unenrolled_sites`;

// Helper function
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/**
 * Site information table component
 */

// Default function
const AllDataTable = (props) => {
  const { active } = props;
  const userRole = useSelector((state) => state.userInfo.role);
  const userAPIKey = useSelector((state) => state.userInfo.apikey);
  const enrollmentValuesEdited = useSelector(
    (state) => state.sharedSiteInfo.enrollmentValuesEdited,
  );

  const [showTable, setShowTable] = useState(false);
  const { user } = useAuth0();
  const [bannedRolesCheckMessage, setBannedRolesCheckMessage] = useState(
    'Checking your permissions..',
  );
  const [XHRResponse, setXHRResponse] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    text: '',
    severity: 'success',
  });

  const [height, setHeight] = useState(window.innerHeight);
  const [farmYears, setFarmYears] = useState([]);
  const [affiliations, setAffiliations] = useState([]);

  const handleResize = () => {
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize, false);
  }, []);
  useEffect(() => {
    const init = () => {
      if (userRole && userAPIKey) {
        if (userRole) {
          if (bannedRoles.includes(userRole)) {
            setShowTable(false);
            setBannedRolesCheckMessage(<BannedRoleMessage title="All Contact and Location" />);
          } else {
            setShowTable(true);
          }
        }
        if (userAPIKey) {
          let records = fetch(siteInfoAPI_URL, {
            headers: {
              'x-api-key': userAPIKey,
            },
          });

          records.then((response) => {
            let res = response.json();
            res.then((records) => {
              setXHRResponse({ status: 'success', data: records });
            });
          });
        }
      }
    };

    init();
  }, [userAPIKey, userRole, enrollmentValuesEdited]);

  useEffect(() => {
    const parseXHRResponse = async (data) => {
      if (data.status === 'success') {
        let responseData = data.data;
        let modifiedData = responseData.map((data) => {
          return {
            ...data,
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
          if (active) return data.protocols_enrolled !== '-999';
          else return data.protocols_enrolled === '-999';
        });
        setTableData(finalData);        
        setFarmYears(cleanYears(finalData));
        setAffiliations(cleanAff(finalData));

        return true;
      } else {
        return false;
      }
    };

    parseXHRResponse(XHRResponse).then((resp) => {
      if (resp) {
        setLoading(false);
      } else {
        setLoading(true);
        console.log('Check API');
      }
    });
  }, [XHRResponse, active]);

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
          data={tableData}
          height={height}
          activeSites={active}
          tableTitle={active ? 'Contact and Location' : 'Inactive Sites-Contact and Location'}
          farmYears={farmYears}
          affiliations={affiliations}
        />
        <EditLocationModal action="update" />
        <EditProtocolModal setSnackbarDataGlobal={setSnackbarData} />
        <EditCashCropModal setSnackbarDataGlobal={setSnackbarData} />
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
  active: PropTypes.bool,
};

export default AllDataTable;
