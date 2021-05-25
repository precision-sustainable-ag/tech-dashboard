import { useState, useEffect, useContext } from "react";
import { Box, Grid, Slide, Select, MenuItem, Typography } from "@material-ui/core";
import { Context } from "../Store/Store";
import Loading from "react-loading";

import { RenderAllowedStatesTab } from "./components/RenderAllowedStatesTab";
import { RenderIssues } from "./components/RenderIssues";

/**
 *
 * A wrapper component for Issues that loads the RenderIssues component
 */

const Issues = (props) => {
  const [state] = useContext(Context);
  const [activeState, setActiveState] = useState("");
  const [assignedStates, setAssignedStates] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [filter, setFilter] = useState("all");

  // setFilter("all")

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  useEffect(() => {
    if (Object.keys(state.userInfo).length > 0 && state.userInfo.state) {
      setActiveState(state.userInfo.state.split(",")[0]);
      setAssignedStates(state.userInfo.state.split(","));
      setShowLoader(false);
    } else {
      setShowLoader(true);
    }
  }, [state.userInfo, state.loading]);

  return state.loadingUser && showLoader ? (
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
          <Grid container spacing = {1}>
            <Grid item><Typography variant="body1">Filter Issues</Typography></Grid>
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
              </Select>
            </Grid>
          </Grid>
        </Grid>
        
      </Grid>
      <Slide
        in={!showLoader || !state.loadingUser}
        direction="down"
        timeout={800}
      >
        <div style={{ paddingTop: "20px" }}>
          <RenderIssues stateLabel={activeState} userRole={state.userRole} filter={filter}/>
        </div>
      </Slide>
    </>
  );
};

export default Issues;
