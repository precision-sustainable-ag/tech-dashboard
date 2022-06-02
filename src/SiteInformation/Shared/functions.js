import Axios from 'axios';
import { apiPassword, apiURL, apiUsername, onfarmAPI } from '../../utils/api_secret';
const qs = require('qs');
import { addDays } from 'date-fns';

import { callAzureFunction } from '../../utils/SharedFunctions';

const farmDatesURL = `${onfarmAPI}/dates`;

export const saveNewGrowerAndFetchProducerId = async (enrollmentData = {}) => {
  let dataObject = {
    firstName: enrollmentData.growerInfo.firstName,
    lastName: enrollmentData.growerInfo.lastName,
    email: enrollmentData.growerInfo.email,
    phone: enrollmentData.growerInfo.phone
      .split('(')
      .join('')
      .split(')')
      .join('')
      .split(' ')
      .join('')
      .split('-')
      .join(''),
    year: enrollmentData.year,
    affiliation: enrollmentData.affiliation,
    collaborationStatus: enrollmentData.growerInfo.collaborationStatus,
  };
  let dataString = qs.stringify(dataObject);
  return await Axios.post(`${apiURL}/api/growers/add`, dataString, {
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });
};

export const updateGrowerInfo = async (enrollmentData = {}) => {
  let dataObject = {
    firstName: enrollmentData.growerInfo.firstName,
    lastName: enrollmentData.growerInfo.lastName,
    email: enrollmentData.growerInfo.email,
    phone: enrollmentData.growerInfo.phone
      .split('(')
      .join('')
      .split(')')
      .join('')
      .split(' ')
      .join('')
      .split('-')
      .join(''),
    year: enrollmentData.year,
    affiliation: enrollmentData.affiliation,
    collaborationStatus: enrollmentData.growerInfo.collaborationStatus,
  };
  let dataString = qs.stringify(dataObject);
  return await Axios.post(`${apiURL}/api/growers/add`, dataString, {
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });
};

export const fetchGrowerByLastName = async (query, apiKey) => {
  const response = await fetch(`${onfarmAPI}/producers?search=${query}`, {
    headers: {
      'x-api-key': apiKey,
    },
  });

  const data = await response.json();
  return data;
};

export const updateSite = async (
  enrollmentData = {},
  getTokenSilently,
  code,
  producerId,
  year,
  affiliation,
  growerType,
) => {
  if (growerType !== 'existing') {
    let newGrowerPromise = updateGrowerInfo({
      ...enrollmentData,
      year: year,
      affiliation: affiliation,
    });
    newGrowerPromise.then((resp) => {
      let apiStatus = callAzureFunction(
        null,
        `crowndb/site_information/producers/${resp.data.producerId}/${code}`,
        'POST',
        getTokenSilently,
      );
      apiStatus
        .then(() => {
          return 'success';
        })
        .catch(() => {
          return 'error';
        });
    });
  } else {
    let apiStatus = callAzureFunction(
      null,
      `crowndb/site_information/producers/${producerId}/${code}`,
      'POST',
      getTokenSilently,
    );
    apiStatus
      .then(() => {
        return 'success';
      })
      .catch(() => {
        return 'error';
      });
  }
};

// Helper functions
export const getStats = async (state) => {
  let records = await fetchStats(state);

  let data = records.data.data;

  return data;
};

const fetchStats = async (state) => {
  return await Axios.get(`${apiURL}/api/total/sites/${state}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  });
};

export const fetchSiteAffiliations = async () => {
  return await Axios.get(`${apiURL}/api/retrieve/grower/affiliation/all`, {
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  });
};

export const makeDateObjects = async (response) => {
  return Promise.all(
    response.map((record) => {
      const biomassDate = record.biomass_harvest ? new Date(record.biomass_harvest) : '';

      return {
        ...record,
        t1_target:
          biomassDate && record.protocols.decomp_biomass == 1
            ? addDays(biomassDate, 14).toLocaleDateString()
            : '',
        t1_actual: record.t1_actual ? new Date(record.t1_actual).toLocaleDateString() : '',
        t2_target:
          biomassDate && record.protocols.decomp_biomass == 1
            ? addDays(biomassDate, 30).toLocaleDateString()
            : '',
        t2_actual: record.t2_actual ? new Date(record.t2_actual).toLocaleDateString() : '',
        t3_target:
          biomassDate && record.protocols.decomp_biomass == 1
            ? addDays(biomassDate, 60).toLocaleDateString()
            : '',
        t3_actual: record.t3_actual ? new Date(record.t3_actual).toLocaleDateString() : '',
        t4_target:
          biomassDate && record.protocols.decomp_biomass == 1
            ? addDays(biomassDate, 90).toLocaleDateString()
            : '',
        t4_actual: record.t4_actual ? new Date(record.t4_actual).toLocaleDateString() : '',
        t5_target:
          record.t5_target && record.protocols.decomp_biomass == 1
            ? new Date(record.t5_target)
            : 'at hand harvest',
      };
    }),
  );
};

export const fetchFarmDatesFromApi = async (apiKey = '') => {
  let data = [];
  try {
    data = await fetchFromApi(farmDatesURL, apiKey);
  } catch (e) {
    console.error(e);
  }
  return data;
};

export const fetchFromApi = async (url, apiKey) => {
  let records = await fetch(url, {
    headers: {
      'x-api-key': apiKey,
    },
  });

  records = await records.json();
  return records;
};
