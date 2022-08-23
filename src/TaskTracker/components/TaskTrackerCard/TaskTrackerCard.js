import { CardContent, Divider, Typography, TextField, Chip, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { onfarmAPI } from '../../../utils/api_secret';
// import { Context } from '../Store/Store';

const TaskTrackerCard = ({
  title,
  table,
  year,
  affiliation,
  code,
  time,
  complete_col,
  exclusion_protocol,
}) => {
  if (affiliation == 'all') {
    affiliation = '';
  }
  if (code == 'all') {
    code = '';
  }

  // const [state] = useContext(Context);
  const userInfo = useSelector((state) => state.userInfo);
  const [codes, setCodes] = useState([]);

  useEffect(() => {
    const fetchData = async (apiKey) => {
      const response = await fetch(
        `${onfarmAPI}/raw?table=${table}&complete_count=${complete_col}&affiliation=${affiliation}&year=${year}&code=${code}&time=${time}`,
        {
          headers: {
            'x-api-key': apiKey,
          },
        },
      );
      const data = await response.json();
      return data;
    };

    if (userInfo.apikey) {
      fetchData(userInfo.apikey)
        .then((response) => {
          const map = new Map();
          for (let item = 0; item < response.length; item++) {
            // If the complete count response is some combination of -1 and +1, the chip should be green.
            //  If there's any 0 and 1/-1 combo, yellow, and if all 0, gray.
            if (map.has(response[item].code)) {
              let flagAndItem = map.get(response[item].code);
              if (flagAndItem[1] == '0' || response[item].flag == '0') {
                response[flagAndItem[0]].bgcolor = 'yellow';
                response[flagAndItem[0]].col = 'black';
                if (flagAndItem[1] == '-1') {
                  response[flagAndItem[0]].flag = response[item].flag;
                }
                response.splice(item, 1);
                item--;
              } else if (flagAndItem[1] == '-1' || response[item].flag == '-1') {
                response[flagAndItem[0]].bgcolor = 'green';
                response[flagAndItem[0]].col = 'white';
                if (flagAndItem[1] == '-1') {
                  response[flagAndItem[0]].flag = response[item].flag;
                }
                response.splice(item, 1);
                item--;
              }
            } else {
              if (response[item].flag == '1') {
                response[item].bgcolor = 'green';
                response[item].col = 'white';
                map.set(response[item].code, [item, response[item].flag]);
              } else if (response[item].flag == '0') {
                response[item].bgcolor = 'gray';
                response[item].col = 'black';
                map.set(response[item].code, [item, response[item].flag]);
              } else if (response[item].flag == '-1') {
                map.set(response[item].code, [item, response[item].flag]);
              }
            }
          }
          // Remove codes with flag '-1'.
          for (let item = 0; item < response.length; item++) {
            if (response[item].flag == '-1') {
              response.splice(item, 1);
              item--;
            }
          }

          if (exclusion_protocol !== '') {
            for (let item = 0; item < response.length; item++) {
              if (
                response[item].protocols[exclusion_protocol] == null ||
                response[item].protocols[exclusion_protocol] == 0 ||
                response[item].protocols[exclusion_protocol] == -999
              ) {
                response.splice(item, 1);
                item--;
              }
            }
          }

          map.clear();
          setCodes(response);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [userInfo.apikey, year, affiliation, code]);

  const linkDict = {
    /*Site Enrollment*/
    Address: '/site-information/contact-enrollment',
    'Site coordinates': '/site-information/contact-enrollment',
    'GPS corners': '/kobo-forms/ak6HVZZJPwC2EgR3qVWTsA',
    'Cover Crop Planting Date': '/site-information/farm-dates',

    /*Biomass*/
    'Fresh weight': '/kobo-forms/a5Do7iYsTxrHxHqqaqcfU9',
    'Legume percentage': '/kobo-forms/a5Do7iYsTxrHxHqqaqcfU9',
    'Termination date': '/site-information/farm-dates',

    /*Decomp Bags*/
    /* T0 */
    'T0 empty weights': '/kobo-forms/afHDjP6jCPMGvDDZqDqdyL',
    'T0 fresh weights': '/kobo-forms/a5Do7iYsTxrHxHqqaqcfU9',
    'T0 recovery date': '/kobo-forms/aGCjaJEeADNxfoPZD9rUm7',
    'T0 dry weights': '/kobo-forms/aGPMTPpqU68JvdHK6Wuejb',
    /* T1 */
    'T1 empty weights': '/kobo-forms/afHDjP6jCPMGvDDZqDqdyL',
    'T1 fresh weights': '/kobo-forms/a5Do7iYsTxrHxHqqaqcfU9',
    'T1 recovery date': '/kobo-forms/aGCjaJEeADNxfoPZD9rUm7',
    'T1 dry weights': '/kobo-forms/aGPMTPpqU68JvdHK6Wuejb',
    /* T2 */
    'T2 empty weights': '/kobo-forms/afHDjP6jCPMGvDDZqDqdyL',
    'T2 fresh weights': '/kobo-forms/a5Do7iYsTxrHxHqqaqcfU9',
    'T2 recovery date': '/kobo-forms/aGCjaJEeADNxfoPZD9rUm7',
    'T2 dry weights': '/kobo-forms/aGPMTPpqU68JvdHK6Wuejb',
    /* T3 */
    'T3 empty weights': '/kobo-forms/afHDjP6jCPMGvDDZqDqdyL',
    'T3 fresh weights': '/kobo-forms/a5Do7iYsTxrHxHqqaqcfU9',
    'T3 recovery date': '/kobo-forms/aGCjaJEeADNxfoPZD9rUm7',
    'T3 dry weights': '/kobo-forms/aGPMTPpqU68JvdHK6Wuejb',
    /* T4 */
    'T4 empty weights': '/kobo-forms/afHDjP6jCPMGvDDZqDqdyL',
    'T4 fresh weights': '/kobo-forms/a5Do7iYsTxrHxHqqaqcfU9',
    'T4 recovery date': '/kobo-forms/aGCjaJEeADNxfoPZD9rUm7',
    'T4 dry weights': '/kobo-forms/aGPMTPpqU68JvdHK6Wuejb',
    /* T5 */
    'T5 empty weights': '/kobo-forms/afHDjP6jCPMGvDDZqDqdyL',
    'T5 fresh weights': '/kobo-forms/a5Do7iYsTxrHxHqqaqcfU9',
    'T5 recovery date': '/kobo-forms/aGCjaJEeADNxfoPZD9rUm7',
    'T5 dry weights': '/kobo-forms/aGPMTPpqU68JvdHK6Wuejb',

    /*Sensor Installation*/
    'Nodes scanned': '/kobo-forms/aixsrhq7hngRuJaPMLCMQy',
    'Cash crop planting date': '/site-information/farm-dates',

    /*Yield*/
    'Corn hand-harvest': '/kobo-forms/aK58LtJJkQZx8ZRJ8uyiLq',
    'Soybean hand-harvest': '/kobo-forms/aK58LtJJkQZx8ZRJ8uyiLq',
    'Cotton hand-harvest': '/kobo-forms/aK58LtJJkQZx8ZRJ8uyiLq',
    'Weigh Wagon': '/kobo-forms/aK58LtJJkQZx8ZRJ8uyiLq',
  };

  return (
    <>
      <CardContent>
        <Typography component="div" align="center" variant="body1" className="cardTitle">
          <TextField
            type="text"
            placeholder="Enter device name"
            variant="standard"
            inputProps={{ style: { textAlign: 'center' } }}
            fullWidth
            value={title}
          />
        </Typography>
      </CardContent>
      <Divider />
      <CardContent>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            {codes && codes.length > 0
              ? codes.map((siteinfo, index) => (
                  <Grid item key={`newSites-${index}`}>
                    <Link to={{ pathname: linkDict[title] }} style={{ textDecoration: 'none' }}>
                      {
                        <Chip
                          label={siteinfo.code}
                          size="small"
                          style={{ backgroundColor: siteinfo.bgcolor, color: siteinfo.col }}
                        >
                          <Typography variant="body2">{siteinfo.code}</Typography>
                        </Chip>
                      }
                    </Link>
                  </Grid>
                ))
              : ''}
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
};

TaskTrackerCard.propTypes = {
  title: PropTypes.string,
  table: PropTypes.string,
  year: PropTypes.number.isRequired,
  affiliation: PropTypes.string,
  code: PropTypes.string,
  list_code: PropTypes.array,
  complete_col: PropTypes.string,
  time: PropTypes.string,
  exclusion_protocol: PropTypes.string,
};

export default TaskTrackerCard;
