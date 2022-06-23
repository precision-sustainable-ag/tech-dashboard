import React, { useState, useEffect } from 'react';
import { Grid, Slide, Select, MenuItem, Typography } from '@material-ui/core';
// import { Context } from '../Store/Store';
import Loading from 'react-loading';
import { useHistory } from 'react-router-dom';

import { RenderAllowedStatesTab } from './components/RenderAllowedStatesTab/RenderAllowedStatesTab';
import { RenderIssues } from './components/RenderIssues/RenderIssues';
import { useSelector } from 'react-redux';
/**
 *
 * A wrapper component for Issues that loads the RenderIssues component
 */

const Issues = () => {
  // const [state] = useContext(Context);
  const userInfo = useSelector((state) => state.userInfo);
  const loading = useSelector((state) => state.loading);
  const loadingUser = useSelector((state) => state.userInfo.loadingUser);
  const userRole = useSelector((state) => state.userRole);

  const [activeState, setActiveState] = useState('');
  const [assignedStates, setAssignedStates] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [filter, setFilter] = useState('all');
  const { location } = useHistory();

  useEffect(() => {
    setActiveState(location.state ? location.state.activeAffiliation : '');
  }, [location]);

  // setFilter("all")

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    if (Object.keys(userInfo).length > 0 && userInfo.state) {
      setActiveState((activeState) => (activeState ? activeState : userInfo.state.split(',')[0]));
      setAssignedStates(userInfo.state.split(','));
      setShowLoader(false);
    } else {
      setShowLoader(true);
    }
  }, [userInfo, loading]);

  return loadingUser && showLoader ? (
    <Loading type="bars" width="200px" height="200px" color="#3f51b5" />
  ) : (
    <>
      <Grid container spacing={3} direction="column">
        <RenderAllowedStatesTab
          activeState={activeState}
          setActiveState={setActiveState}
          assignedStates={assignedStates}
        />
        <Grid item>
          <Grid container spacing={1}>
            <Grid item>
              <Typography variant="body1">Filter Issues</Typography>
            </Grid>
            <Grid item>
              <Select
                autoFocus
                value={filter}
                onChange={handleFilterChange}
                defaultValue="all"
                // defaultChecked="all"
                // inputProps={{
                //   name: "max-width",
                //   id: "max-width",
                // }}
              >
                <MenuItem value="all">all</MenuItem>
                <MenuItem value="kobo-forms">kobo-forms</MenuItem>
                <MenuItem value="site-information">site-information</MenuItem>
                <MenuItem value="producer-information">producer-information</MenuItem>
                <MenuItem value="farm-dates">farm-dates</MenuItem>
                <MenuItem value="farm-values">farm-values</MenuItem>
                <MenuItem value="water-sensor-visuals">water-sensor-visuals</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Slide in={!showLoader || !loadingUser} direction="down" timeout={800}>
        <div style={{ paddingTop: '20px' }}>
          <RenderIssues stateLabel={activeState} userRole={userRole} filter={filter} />
        </div>
      </Slide>
    </>
  );
};

export default Issues;
