import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import { teal } from "@material-ui/core/colors";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineDot,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineContent,
  Skeleton,
} from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { ucFirst } from "../../utils/constants";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "1em 1em",
    border: `2px solid ${theme.palette.primary.main}`,
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
  typography: {
    color: theme.palette.type === "dark" ? teal[400] : "inherit",
    fontWeight: theme.palette.type === "dark" ? "bolder" : "inherit",
    transition: "all 0.3s linear",
  },
}));

/**
 * On farm timeline component
 */

const TaskTimeline = () => {
  const [wpData, setWPData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [plantingData, setPlantingData] = useState(null);
  const [terminationData, setTerminationData] = useState(null);
  const [fertilizerData, setFertilizerData] = useState(null);
  const [harvestData, setHarvestData] = useState(null);
  const style = useStyles();

  useEffect(() => {
    const fetchTimelineData = async () => {
      const response = await fetch(
        "https://precisionsustainableag.org/internal/wp-json/wp/v2/pages/1592"
      );
      const payload = await response.json();
      const { title, status, content } = payload;
      return { title, status, content };
    };

    fetchTimelineData()
      .then((response) => {
        const stripped = response.content.rendered.replace(/\[.*?\]/g, "");
        var doc = new DOMParser().parseFromString(stripped, "text/html");
        const timelineData = doc.getElementsByClassName("timeline-data");
        const coverCropPlantingData = timelineData.namedItem(
          "cover-crop-planting"
        );
        const coverCropTerminationData = timelineData.namedItem(
          "cover-crop-termination"
        );
        const sideDressFertilizerData = timelineData.namedItem(
          "side-dress-fertilizer"
        );
        const cropHarvestData = timelineData.namedItem("crop-harvest");

        setFertilizerData(sideDressFertilizerData || null);
        setHarvestData(cropHarvestData || null);
        setPlantingData(coverCropPlantingData || null);
        setTerminationData(coverCropTerminationData || null);
        setWPData(response);
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  const RenderData = ({ data = Element, from, style }) => {
    const [titles, setTitles] = useState([]);
    const [innerData, setInnerData] = useState([]);

    useEffect(() => {
      if (data) {
        switch (from) {
          case "planting": {
            const innerData = data.querySelectorAll(`.planting-inner`);
            setInnerData(innerData);

            break;
          }
          case "termination": {
            const innerData = data.querySelectorAll(`.termination-inner`);
            setInnerData(innerData);

            break;
          }
          case "fertilizer": {
            const innerData = data.querySelectorAll(`.fertilizer-inner`);
            setInnerData(innerData);

            break;
          }
          case "harvest": {
            const innerData = data.querySelectorAll(`.harvest-inner`);
            setInnerData(innerData);

            break;
          }
          default:
            break;
        }
      }
      return () => setInnerData([]);
    }, [from, data]);

    useEffect(() => {
      if (data) {
        const titles = data.getElementsByTagName("h2");
        setTitles(titles);
      }
      return () => setTitles([]);
    }, [data]);

    return (
      data &&
      innerData && (
        <Grid container spacing={3}>
          {titles.length > 0 && innerData.length > 0
            ? Array.from(innerData).map((data, index) => {
                // const anchor = data.innerHTML.replace(
                //   /<a[\s]+([^>]+)>((?:.(?!\<\/a\>))*.)<\/a>/g,
                //   ""
                // );
                // let a= "";
                const anchor = data.innerHTML;
                return (
                  <Grid item xs={12} key={`plantingTitle${index}`}>
                    <Typography variant="h6">
                      {ucFirst(titles[index].innerHTML)}
                    </Typography>
                    <Paper elevation={3} className={style.paper}>
                      <Typography
                        className={style.typography}
                        dangerouslySetInnerHTML={{ __html: anchor }}
                      ></Typography>
                    </Paper>
                  </Grid>
                );
              })
            : ""}
        </Grid>
      )
    );
  };

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
              {loading ? (
                <RenderSkeleton />
              ) : (
                <RenderData from="planting" data={plantingData} style={style} />
              )}
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
              {loading ? (
                <RenderSkeleton />
              ) : (
                <RenderData
                  from="termination"
                  data={terminationData}
                  style={style}
                />
              )}
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
              {loading ? (
                <RenderSkeleton />
              ) : (
                <RenderData
                  from="fertilizer"
                  data={fertilizerData}
                  style={style}
                />
              )}
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineOppositeContent>Cover Harvest</TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              {loading ? (
                <RenderSkeleton />
              ) : (
                <RenderData from="harvest" data={harvestData} style={style} />
              )}
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Grid>
    </Grid>
  );
};

const RenderSkeleton = () => {
  return <Skeleton height="200px" width="100%" />;
};

export default TaskTimeline;
