import {
  Grid,
  Card,
  Typography,
  Chip,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import React, { useState, useEffect, Fragment } from 'react';
import { onfarmAPI } from '../utils/api_secret';
import {
  BannedRoleMessage,
  CustomLoader,
  YearsAndAffiliations,
  Codes,
} from '../utils/CustomComponents';
import { uniqueYears } from '../utils/SharedFunctions';
import TaskTrackerCard from './components/TaskTrackerCard/TaskTrackerCard';
import { useSelector } from 'react-redux';

// Data for the respective cards
let siteEnrollmentJson = [
  {
    title: 'Address',
    table: 'site_information',
    complete_col: 'address',
    time: '',
    exclusion_protocol: '',
  },
  {
    title: 'Site coordinates',
    table: 'site_information',
    complete_col: 'latitude',
    time: '',
    exclusion_protocol: '',
  },
  {
    title: 'GPS corners',
    table: 'gps_corners',
    complete_col: 'latitude',
    time: '',
    exclusion_protocol: '',
  },
  {
    title: 'Cover Crop Planting Date',
    table: 'farm_history',
    complete_col: 'cc_planting_date',
    time: '',
    exclusion_protocol: '',
  },
];

let biomassJson = [
  {
    title: 'Fresh weight',
    table: 'biomass_in_field',
    complete_col: 'fresh_wt_a',
    time: '',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'Legume percentage',
    table: 'biomass_in_field',
    complete_col: 'legumes_40',
    time: '',
    exclusion_protocol: '',
  },
  {
    title: 'Termination date',
    table: 'farm_history',
    complete_col: 'cc_termination_date',
    time: '',
    exclusion_protocol: '',
  },
  {
    title: 'Species',
    table: 'cc_mixture',
    complete_col: 'code',
    time: '',
    exclusion_protocol: '',
  },
];

let decompBagJson = [
  {
    title: 'T0 empty weights',
    table: 'decomp_biomass_fresh',
    complete_col: 'empty_bag_wt',
    time: '0',
    exclusion_protocol: '',
  },
  {
    title: 'T0 fresh weights',
    table: 'decomp_biomass_fresh',
    complete_col: 'fresh_biomass_wt',
    time: '0',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T0 recovery date',
    table: 'decomp_biomass_dry',
    complete_col: 'recovery_date',
    time: '0',
    exclusion_protocol: '',
  },
  {
    title: 'T0 dry weights',
    table: 'decomp_biomass_dry',
    complete_col: 'dry_biomass_wt',
    time: '0',
    exclusion_protocol: '',
  },
  {
    title: 'T1 empty weights',
    table: 'decomp_biomass_fresh',
    complete_col: 'empty_bag_wt',
    time: '1',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T1 fresh weights',
    table: 'decomp_biomass_fresh',
    complete_col: 'fresh_biomass_wt',
    time: '1',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T1 recovery date',
    table: 'decomp_biomass_dry',
    complete_col: 'recovery_date',
    time: '1',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T1 dry weights',
    table: 'decomp_biomass_dry',
    complete_col: 'dry_biomass_wt',
    time: '1',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T2 empty weights',
    table: 'decomp_biomass_fresh',
    complete_col: 'empty_bag_wt',
    time: '2',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T2 fresh weights',
    table: 'decomp_biomass_fresh',
    complete_col: 'fresh_biomass_wt',
    time: '2',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T2 recovery date',
    table: 'decomp_biomass_dry',
    complete_col: 'recovery_date',
    time: '2',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T2 dry weights',
    table: 'decomp_biomass_dry',
    complete_col: 'dry_biomass_wt',
    time: '2',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T3 empty weights',
    table: 'decomp_biomass_fresh',
    complete_col: 'empty_bag_wt',
    time: '3',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T3 fresh weights',
    table: 'decomp_biomass_fresh',
    complete_col: 'fresh_biomass_wt',
    time: '3',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T3 recovery date',
    table: 'decomp_biomass_dry',
    complete_col: 'recovery_date',
    time: '3',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T3 dry weights',
    table: 'decomp_biomass_dry',
    complete_col: 'dry_biomass_wt',
    time: '3',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T4 empty weights',
    table: 'decomp_biomass_fresh',
    complete_col: 'empty_bag_wt',
    time: '4',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T4 fresh weights',
    table: 'decomp_biomass_fresh',
    complete_col: 'fresh_biomass_wt',
    time: '4',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T4 recovery date',
    table: 'decomp_biomass_dry',
    complete_col: 'recovery_date',
    time: '4',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T4 dry weights',
    table: 'decomp_biomass_dry',
    complete_col: 'dry_biomass_wt',
    time: '4',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T5 empty weights',
    table: 'decomp_biomass_fresh',
    complete_col: 'empty_bag_wt',
    time: '5',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T5 fresh weights',
    table: 'decomp_biomass_fresh',
    complete_col: 'fresh_biomass_wt',
    time: '5',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T5 recovery date',
    table: 'decomp_biomass_dry',
    complete_col: 'recovery_date',
    time: '5',
    exclusion_protocol: 'decomp_biomass',
  },
  {
    title: 'T5 dry weights',
    table: 'decomp_biomass_dry',
    complete_col: 'dry_biomass_wt',
    time: '5',
    exclusion_protocol: 'decomp_biomass',
  },
];

let sensorJson = [
  {
    title: 'Nodes scanned',
    table: 'wsensor_install',
    complete_col: 'bare_node_serial_no',
    time: '',
    exclusion_protocol: '',
  },
  {
    title: 'Cash crop planting date',
    table: 'farm_history',
    complete_col: 'cash_crop_planting_date',
    time: '',
    exclusion_protocol: '',
  },
];

let yieldJson = [
  {
    title: 'Corn hand-harvest',
    table: 'yield_corn',
    complete_col: 'fresh_harvest_wt',
    time: '',
    exclusion_protocol: 'cash_crop_yield',
  },
  {
    title: 'Cotton hand-harvest',
    table: 'yield_cotton',
    complete_col: 'boll_wt',
    time: '',
    exclusion_protocol: 'cash_crop_yield',
  },
  {
    title: 'Soybean hand-harvest',
    table: 'yield_soybeans',
    complete_col: 'fresh_harvest_wt',
    time: '',
    exclusion_protocol: 'cash_crop_yield',
  },
  {
    title: 'Weigh Wagon',
    table: 'yield_wagon',
    complete_col: 'moisture_pct',
    time: '',
    exclusion_protocol: 'cash_crop_yield',
  },
];
const TaskTracker = () => {
  // const [state] = useContext(Context);
  const userInfo = useSelector((state) => state.userInfo);
  const [fetching, setFetching] = useState(true);
  const [farmValues, setFarmValues] = useState([]);
  const [farmYears, setFarmYears] = useState([]);
  const [affiliations, setAffiliations] = useState([]);
  const [codes, setCodes] = useState([]);

  const activeFarmYear = () => {
    const activeYear = farmYears.filter((rec) => rec.active).map((rec) => rec.year);
    return parseInt(activeYear);
  };
  const activeAffiliation = () => {
    const activeAff =
      affiliations
        .filter((rec) => rec.active)
        .map((rec) => rec.affiliation)
        .toString() || 'all';
    return activeAff;
  };
  const activeCode = () => {
    return (
      codes
        .filter((rec) => rec.active)
        .map((rec) => rec.code)
        .toString() || 'all'
    );
  };

  const handleActiveYear = (year = '') => {
    const newFarmYears = farmYears.map((yearInfo) => {
      return { active: year === yearInfo.year, year: yearInfo.year };
    });
    const sortedNewFarmYears = newFarmYears.sort((a, b) => b - a);
    setFarmYears(sortedNewFarmYears);
  };

  const handleActiveAffiliation = (affiliation = 'all') => {
    const newAffiliations = affiliations.map((rec) => {
      return {
        active: affiliation === rec.affiliation,
        affiliation: rec.affiliation,
      };
    });
    const sortedNewAffiliations = newAffiliations.sort((a, b) =>
      b.affiliation < a.affiliation ? 1 : b.affiliation > a.affiliation ? -1 : 0,
    );

    setAffiliations(sortedNewAffiliations);
  };

  const handleActiveCode = (code = 'all') => {
    const newCodes = codes.map((rec) => {
      return {
        active: code === rec.code,
        code: rec.code,
      };
    });
    const sortedNewCodes = newCodes.sort((a, b) =>
      b.code < a.code ? 1 : b.code > a.code ? -1 : 0,
    );

    setCodes(sortedNewCodes);
  };
  useEffect(() => {
    const fetchData = async (apiKey) => {
      const response = await fetch(`${onfarmAPI}/raw?table=site_information`, {
        headers: {
          'x-api-key': apiKey,
        },
      });

      const data = await response.json();
      return data;
    };

    if (userInfo.apikey) {
      setFetching(true);
      fetchData(userInfo.apikey)
        .then((response) => {
          if (response.length === 0) {
            throw new Error('No data');
          }
          setFarmValues(response);

          let allYears = response.map((record) => record.year);
          setFarmYears(uniqueYears(allYears));

          const affiliations = response
            .filter((record) => record.affiliation !== undefined)
            .reduce(
              (prev, curr) =>
                !prev.includes(curr.affiliation) ? [...prev, curr.affiliation] : [...prev],
              [],
            )
            .map((aff) => {
              return {
                affiliation: aff,
                active: false,
              };
            });
          const sortedAffiliations = affiliations.sort((a, b) =>
            b.affiliation < a.affiliation ? 1 : b.affiliation > a.affiliation ? -1 : 0,
          );
          setAffiliations(sortedAffiliations);
        })
        .then(() => setFetching(false))
        .catch((e) => {
          console.error(e);
          setFetching(false);
        });
    }
  }, [userInfo.apikey, farmValues.length]);

  useEffect(() => {
    const fetchData = async (apiKey) => {
      const response = await fetch(
        `${onfarmAPI}/raw?table=site_information&affiliation=${activeAffiliation()}&year=${activeFarmYear()}`,
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
      setFetching(true);
      fetchData(userInfo.apikey)
        .then((response) => {
          const codes = response
            .filter((record) => record.code !== undefined)
            .reduce(
              (prev, curr) => (!prev.includes(curr.code) ? [...prev, curr.code] : [...prev]),
              [],
            )
            .map((aff) => {
              return {
                code: aff,
                active: false,
              };
            });
          const sortedCodes = codes.sort((a, b) =>
            b.code < a.code ? 1 : b.code > a.code ? -1 : 0,
          );
          setCodes(sortedCodes);
        })
        .then(() => setFetching(false))
        .catch((e) => {
          console.error(e);
          setFetching(false);
        });
    }
  }, [userInfo.apikey, activeAffiliation(), activeFarmYear()]);
  return (
    <Grid container spacing={3}>
      {fetching ? (
        <CustomLoader />
      ) : farmValues.length === 0 ? (
        <Grid item xs={12}>
          <BannedRoleMessage title="TaskTracker - Farm Values" />
        </Grid>
      ) : (
        <Fragment>
          {/* Years and Affiliation */}
          <Grid item lg={9} sm={12}>
            <div style={{ marginBottom: '20px' }}>
              {' '}
              Protocol timelines:{' '}
              <a
                href="https://sites.google.com/ncsu.edu/psateamportal/teams/on-farm/on-farm-timeline"
                target="_blank"
                rel="noreferrer"
              >
                view on Team Portal
              </a>
            </div>
            <Grid container spacing={3}>
              <YearsAndAffiliations
                title={'Task Tracker'}
                years={farmYears}
                handleActiveYear={handleActiveYear}
                affiliations={affiliations}
                handleActiveAffiliation={handleActiveAffiliation}
                showYears={true}
              />
            </Grid>
          </Grid>
          {/* Codes */}
          <Grid item lg={9} sm={12}>
            <Grid container spacing={3}>
              <Codes codes={codes} handleActiveCode={handleActiveCode} />
            </Grid>
          </Grid>
          <Grid
            item
            lg={3}
            sm={12}
            container
            justifyContent="flex-end"
            alignItems="center"
            component="label"
          ></Grid>
          {/* Tracker cards */}

          {/* Site Enrollment */}
          <Grid>
            <Accordion defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h5">Site Enrollment</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {siteEnrollmentJson && siteEnrollmentJson.length > 0
                    ? siteEnrollmentJson.map((siteData, index) => (
                        <Grid item xs={12} md={4} lg={3} sm={6} key={`tracker-${index}`}>
                          <Card variant="elevation" elevation={3} className="deviceDataWrapper">
                            <TaskTrackerCard
                              title={siteData.title}
                              table={siteData.table}
                              year={activeFarmYear()}
                              affiliation={activeAffiliation() || ''}
                              code={activeCode() || ''}
                              list_code={codes}
                              complete_col={siteData.complete_col}
                              time={siteData.time}
                              exclusion_protocol={siteData.exclusion_protocol}
                            />
                          </Card>
                        </Grid>
                      ))
                    : ''}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Biomass */}
          <Grid>
            <Accordion defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h5">Biomass</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {biomassJson && biomassJson.length > 0
                    ? biomassJson.map((biomassData, index) => (
                        <Grid item xs={12} md={4} lg={3} sm={6} key={`tracker-${index}`}>
                          <Card variant="elevation" elevation={3} className="deviceDataWrapper">
                            <TaskTrackerCard
                              title={biomassData.title}
                              table={biomassData.table}
                              year={activeFarmYear()}
                              affiliation={activeAffiliation() || ''}
                              code={activeCode() || ''}
                              list_code={codes}
                              complete_col={biomassData.complete_col}
                              time={biomassData.time}
                              exclusion_protocol={biomassData.exclusion_protocol}
                            />
                          </Card>
                        </Grid>
                      ))
                    : ''}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Decomp bag */}
          <Grid>
            <Accordion defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h5">Decomp bag</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {decompBagJson && decompBagJson.length > 0
                    ? decompBagJson.map((decompData, index) => (
                        <Grid item xs={12} md={4} lg={3} sm={6} key={`tracker-${index}`}>
                          <Card variant="elevation" elevation={3} className="deviceDataWrapper">
                            <TaskTrackerCard
                              title={decompData.title}
                              table={decompData.table}
                              year={activeFarmYear()}
                              affiliation={activeAffiliation() || ''}
                              code={activeCode() || ''}
                              list_code={codes}
                              complete_col={decompData.complete_col}
                              time={decompData.time}
                              exclusion_protocol={decompData.exclusion_protocol}
                            />
                          </Card>
                        </Grid>
                      ))
                    : ''}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Sensor Installation */}
          <Grid>
            <Accordion defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h5">Sensor Installation</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {sensorJson && sensorJson.length > 0
                    ? sensorJson.map((sensorData, index) => (
                        <Grid item xs={12} md={4} lg={3} sm={6} key={`tracker-${index}`}>
                          <Card variant="elevation" elevation={3} className="deviceDataWrapper">
                            <TaskTrackerCard
                              title={sensorData.title}
                              table={sensorData.table}
                              year={activeFarmYear()}
                              affiliation={activeAffiliation() || ''}
                              code={activeCode() || ''}
                              list_code={codes}
                              complete_col={sensorData.complete_col}
                              time={sensorData.time}
                              exclusion_protocol={sensorData.exclusion_protocol}
                            />
                          </Card>
                        </Grid>
                      ))
                    : ''}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Yield */}
          <Grid>
            <Accordion defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h5">Yield</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {yieldJson && yieldJson.length > 0
                    ? yieldJson.map((yieldData, index) => (
                        <Grid item xs={12} md={4} lg={3} sm={6} key={`tracker-${index}`}>
                          <Card variant="elevation" elevation={3} className="deviceDataWrapper">
                            <TaskTrackerCard
                              title={yieldData.title}
                              table={yieldData.table}
                              year={activeFarmYear()}
                              affiliation={activeAffiliation() || ''}
                              code={activeCode() || ''}
                              list_code={codes}
                              complete_col={yieldData.complete_col}
                              time={yieldData.time}
                              exclusion_protocol={yieldData.exclusion_protocol}
                            />
                          </Card>
                        </Grid>
                      ))
                    : ''}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Fragment>
      )}
      <Grid item xs={12}>
        <Chip
          label={'Fully Complete'}
          size="small"
          style={{ backgroundColor: 'green', color: 'white' }}
        >
          <Typography variant="body2">{'siteinfo.code'}</Typography>
        </Chip>
        <Chip
          label={'Partially Complete'}
          size="small"
          style={{ backgroundColor: 'yellow', color: 'black' }}
        >
          <Typography variant="body2">{'siteinfo.code'}</Typography>
        </Chip>
        <Chip label={'Incomplete'} size="small" style={{ backgroundColor: 'gray', color: 'black' }}>
          <Typography variant="body2">{'siteinfo.code'}</Typography>
        </Chip>
      </Grid>
    </Grid>
  );
};

export default TaskTracker;
