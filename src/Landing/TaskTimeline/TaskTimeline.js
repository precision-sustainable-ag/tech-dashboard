// Dependency Imports
import React, { useEffect } from "react";
import { Typography, Grid, Paper, makeStyles } from "@material-ui/core";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "1em 1em",
    border: `2px solid ${theme.palette.primary.main}`,
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const RenderTimelineContent = (props) => {
  // const docBody =

  useEffect(() => {}, []);
  switch (props.for) {
    case "cover-crop-planting":
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Fall</Typography>
            <Paper elevation={3} className={props.style.paper}>
              <ul>
                <li>
                  Enroll Growers -{" "}
                  <a rel="noreferrer" href="/site-enroll" target="_blank">
                    Site Enrollment
                  </a>
                </li>
                <li>Ensure clean bare ground strips</li>
              </ul>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Winter</Typography>
            <Paper elevation={3} className={props.style.paper}>
              <ul>
                <li>
                  Interview growers about field history and farm management -{" "}
                  <a
                    rel="noreferrer"
                    href="https://ee.kobotoolbox.org/x/ggAJsJ8P"
                    target="_blank"
                  >
                    PSA Farm History Survey
                  </a>
                </li>
              </ul>
            </Paper>
          </Grid>
        </Grid>
      );
    case "cover-crop-termination":
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Spring</Typography>
            <Paper elevation={3} className={props.style.paper}>
              <ul>
                <li>Cover Crop biomass collection and decomp bag deployment</li>
                <ul>
                  <li>
                    <a
                      rel="noreferrer"
                      href="https://ee.kobotoolbox.org/x/A0vJkKxS"
                      target="_blank"
                    >
                      PSA decomp bag pre weight form
                    </a>
                  </li>
                  <li>
                    <a
                      rel="noreferrer"
                      href="https://ee.kobotoolbox.org/x/v82BT9fq"
                      target="_blank"
                    >
                      PSA biomass decomp bag form
                    </a>
                  </li>
                  <li>
                    <a
                      rel="noreferrer"
                      href="https://ee.kobotoolbox.org/x/nQY7I8Z5"
                      target="_blank"
                    >
                      PSA GPS form
                    </a>
                  </li>
                </ul>

                <li>
                  Water sensor installation -{" "}
                  <a
                    rel="noreferrer"
                    href="https://ee.kobotoolbox.org/x/dcm60P5u"
                    target="_blank"
                  >
                    PSA water sensor install form
                  </a>
                </li>
                <li>
                  Decomp bag retrieval 2 weeks, 4 weeks -{" "}
                  <a
                    rel="noreferrer"
                    href="https://ee.kobotoolbox.org/x/mWXqWfvy"
                    target="_blank"
                  >
                    PSA decomp bag collect form
                  </a>
                </li>
              </ul>
            </Paper>
          </Grid>
        </Grid>
      );
    case "side-dress-fertilizer":
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Summer</Typography>
            <Paper elevation={3} className={props.style.paper}>
              <ul>
                <li>Raise water sensor solar panels</li>
                <li>
                  Decomp bag retrieval 8 weeks, 12 weeks -{" "}
                  <a
                    rel="noreferrer"
                    href="https://ee.kobotoolbox.org/x/mWXqWfvy"
                    target="_blank"
                  >
                    PSA decomp bag collect form
                  </a>
                </li>
              </ul>
            </Paper>
          </Grid>
        </Grid>
      );
    case "crop-harvest":
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Fall</Typography>
            <Paper elevation={3} className={props.style.paper}>
              <ul>
                <li>
                  Remove sensors -{" "}
                  <a
                    rel="noreferrer"
                    href="https://ee.kobotoolbox.org/x/becz2BBJ"
                    target="_blank"
                  >
                    PSA water sensor uninstall form
                  </a>
                </li>
                <li>
                  Yield samples -{" "}
                  <a
                    rel="noreferrer"
                    href="https://ee.kobotoolbox.org/x/TvRNAAyF"
                    target="_blank"
                  >
                    PSA yield and texture form
                  </a>
                </li>
                <li>Soil texture samples, bulk density samples</li>
                <li>
                  Last decomp bag pickup -{" "}
                  <a
                    rel="noreferrer"
                    href="https://ee.kobotoolbox.org/x/mWXqWfvy"
                    target="_blank"
                  >
                    PSA decomp bag collect form
                  </a>
                </li>
                <li>
                  Weigh decomp bags -{" "}
                  <a
                    rel="noreferrer"
                    href="https://ee.kobotoolbox.org/x/UUEvjBK0"
                    target="_blank"
                  >
                    PSA decomp bag dry weight form
                  </a>
                </li>
              </ul>
            </Paper>
          </Grid>
        </Grid>
      );
    default:
      return (
        <div>
          <div></div>
        </div>
      );
  }
};

// Default function
const TaskTimeline = (props) => {
  const style = useStyles();
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h5" align="center" gutterBottom>
          Task Timeline
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Timeline align="left">
          <TimelineItem>
            <TimelineOppositeContent>
              Cover Crop Planting
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <RenderTimelineContent
                for="cover-crop-planting"
                style={{ ...style }}
              />
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent>
              Cover Crop Termination, Crop Planting
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <RenderTimelineContent
                for="cover-crop-termination"
                style={{ ...style }}
              />
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent>
              Side Dress Fertilizer
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <RenderTimelineContent
                for="side-dress-fertilizer"
                style={{ ...style }}
              />
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent>Cover Harvest</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <RenderTimelineContent for="crop-harvest" style={{ ...style }} />
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Grid>
    </Grid>
  );
};

export default TaskTimeline;
