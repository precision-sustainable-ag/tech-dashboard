import { useState, useEffect, useContext } from "react";
import { Box, Grid, Slide } from "@material-ui/core";
import { Context } from "../Store/Store";
import Loading from "react-loading";

import { RenderAllowedStatesTab } from "./components/RenderAllowedStatesTab";
import { RenderIssues } from "./components/RenderIssues";

const Issues = (props) => {
  const [state] = useContext(Context);
  const [activeState, setActiveState] = useState("");
  const [assignedStates, setAssignedStates] = useState([]);
  const [showLoader, setShowLoader] = useState(true);

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
      <Grid container>
        <Slide
          in={!showLoader || !state.loadingUser}
          direction="down"
          timeout={200}
        >
          <Grid item xs={12}>
            <RenderAllowedStatesTab
              activeState={activeState}
              setActiveState={setActiveState}
              assignedStates={assignedStates}
            />
          </Grid>
        </Slide>
      </Grid>
      <Slide
        in={!showLoader || !state.loadingUser}
        direction="down"
        timeout={800}
      >
        <div style={{ paddingTop: "20px" }}>
          <RenderIssues stateLabel={activeState} userRole={state.userRole} />
        </div>
      </Slide>
    </>
  );
};

export default Issues;
