import React, { useState, useEffect } from 'react';
import { Box, Grid, Tab } from '@material-ui/core';
import { TabList, TabContext } from '@material-ui/lab';
import YieldCharts from './YieldTabs';
import { onfarmAPI } from '../utils/api_secret';
import { useSelector } from 'react-redux';
import { CustomLoader } from '../utils/CustomComponents';
import { cleanYears, cleanAff } from './../TableComponents/SharedTableFunctions';

const YieldPage = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const [value, setValue] = useState(1);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [activeTable, setActiveTable] = useState('Corn');
  const [farmYears, setFarmYears] = useState([]);
  const [affiliations, setAffiliations] = useState([]);

  useEffect(() => {
    const fetchData = async (apiKey) => {
      const response = await fetch(`${onfarmAPI}/yield`, {
        headers: {
          'x-api-key': apiKey,
        },
      });

      const data = await response.json();
      return data;
    };

    if (userInfo.apikey) {
      setLoading(true);
      fetchData(userInfo.apikey)
        .then((response) => {
          if (response.length === 0) {
            throw new Error('No data');
          }
          setData(response);
          setFarmYears(cleanYears(response));
          setAffiliations(cleanAff(response));
        })
        .then(() => {
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
        });
    }
  }, [userInfo.apikey]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case '1':
        setActiveTable('Corn');
        break;
      case '2':
        setActiveTable('Soybean');
        break;
      case '3':
        setActiveTable('Cotton');
        break;
      default:
        break;
    }
  };

  return loading ? (
    <CustomLoader />
  ) : (
    <Grid container spacing={3} justifyContent="space-evenly" alignItems="center">
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="yield tabs" centered>
                <Tab label="Corn" value="1" />
                <Tab label="Soybean" value="2" />
                <Tab label="Cotton" value="3" />
              </TabList>
            </Box>
          </TabContext>
        </Box>
      </Grid>
      <Grid item>
        <YieldCharts
          data={data}
          activeTable={activeTable}
          farmYears={farmYears}
          affiliations={affiliations}
        ></YieldCharts>
      </Grid>
    </Grid>
  );
};

export default YieldPage;
