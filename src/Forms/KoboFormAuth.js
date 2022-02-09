// Dependency Imports
import Axios from 'axios';
import { apiPassword, apiURL, apiUsername } from '../utils/api_secret';

// Default function
const getAllKoboAssets = async (who) => {
  switch (who) {
    case 'psa':
      return await Axios.get(`${apiURL}/api/kobo/psa/basic/`, {
        auth: {
          username: apiUsername,
          password: apiPassword,
        },
      });
    case 'psassg':
      return await Axios.get(`${apiURL}/api/kobo/psassg/basic/`, {
        auth: {
          username: apiUsername,
          password: apiPassword,
        },
      });

    default:
      return await Axios.get(`${apiURL}/api/kobo/psa/basic/`, {
        auth: {
          username: apiUsername,
          password: apiPassword,
        },
      });
  }
};

export default getAllKoboAssets;
