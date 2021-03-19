// Dependency Imports
import React, { useMemo, useState } from "react";
import { Typography, Grid, Paper } from "@material-ui/core";
import { apiPassword, apiURL, apiUsername } from "../../utils/api_secret";
import { Skeleton } from "@material-ui/lab";

// Default function
const TaskTimeline = () => {
  const [htmlData, setHtmlData] = useState("");

  let data = useMemo(() => {
    const fetchData = async () => {
      let data = await fetch(`${apiURL}/api/psa/internal/pages/1592`, {
        headers: {
          Authorization: "Basic " + btoa(`${apiUsername}:${apiPassword}`),
        },
      });

      return await data.text();
    };

    return fetchData();
  }, []);

  data.then((resp) => {
    setHtmlData(resp);
  });

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h5" align="left" gutterBottom>
          Task Timeline
        </Typography>
      </Grid>

      <Grid item xs={12}>
        {!htmlData ? (
          <Skeleton width="100%" height="50vh" />
        ) : (
          <Paper
            style={{ padding: "1em" }}
            elevation={3}
            dangerouslySetInnerHTML={{ __html: htmlData ? htmlData : "" }}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default TaskTimeline;
