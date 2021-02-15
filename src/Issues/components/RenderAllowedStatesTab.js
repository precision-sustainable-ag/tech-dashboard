import { Paper, Tab, Tabs, Typography, Grid } from "@material-ui/core";
import PropTypes from "prop-types";

export const RenderAllowedStatesTab = ({
  assignedStates = [],
  setActiveState,
  activeState,
}) => {
  return assignedStates[0] !== "all" ? (
    <Grid container justify="flex-start" alignItems="center" spacing={3}>
      <Grid item>
        <Paper square>
          <Tabs value={activeState} indicatorColor="primary">
            {assignedStates.length > 0 &&
              assignedStates.map((state, index) => (
                <Tab
                  key={index}
                  label={state}
                  value={state}
                  onClick={() => setActiveState(state)}
                />
              ))}
          </Tabs>
        </Paper>
      </Grid>
    </Grid>
  ) : (
    <Grid container justify="flex-start" alignItems="center" spacing={3}>
      <Typography variant="body1">Showing Issues for All States</Typography>
    </Grid>
  );
};

RenderAllowedStatesTab.propTypes = {
  assignedStates: PropTypes.array.isRequired,
  activeState: PropTypes.string.isRequired,
  setActiveState: PropTypes.func.isRequired,
};
