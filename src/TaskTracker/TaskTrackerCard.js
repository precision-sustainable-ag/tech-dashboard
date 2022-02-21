import { CardContent, Divider, Typography, TextField, Chip, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useContext, useState } from 'react';
import { onfarmAPI } from '../utils/api_secret';
import { Context } from '../Store/Store';

const TaskTrackerCard = ({ title, table, year, affiliation, code, time, complete_col }) => {
  if (affiliation == 'all') {
    affiliation = '';
  }
  if (code == 'all') {
    code = '';
  }

  const [state] = useContext(Context);
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

    if (state.userInfo.apikey) {
      fetchData(state.userInfo.apikey)
        .then((response) => {
          const map = new Map();
          for (let item = 0; item < response.length; item++) {
            if (map.has(response[item].code)) {
              response[item].bgcolor = 'yellow';
              response[item].col = 'black';
              response.splice(map.get(response[item].code), 1);
              item--;
            } else {
              if (response[item].flag == '1') {
                response[item].bgcolor = 'green';
                response[item].col = 'white';
              } else if (response[item].flag == '0') {
                response[item].bgcolor = 'gray';
                response[item].col = 'black';
              } else if (response[item].flag == '-1') {
                response.splice(item, 1);
              }
              map.set(response[item].code, item);
            }
          }
          map.clear();
          setCodes(response);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [state.userInfo.apikey, year, affiliation, code]);

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
                  <Grid item spacing={3} key={`newSites-${index}`}>
                    <Chip
                      label={siteinfo.code}
                      size="small"
                      style={{ backgroundColor: siteinfo.bgcolor, color: siteinfo.col }}
                    >
                      <Typography variant="body2">{siteinfo.code}</Typography>
                    </Chip>
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
};

export default TaskTrackerCard;
