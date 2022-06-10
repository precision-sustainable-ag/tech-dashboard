import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import { Buffer } from 'buffer';
import React, { useState } from 'react';
import { apiPassword, apiUsername } from '../utils/api_secret';
import { azureDebugURL, githubWebhookDebugURL } from '../utils/constants';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light';
import dark from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import PropTypes from 'prop-types';
import { CustomLoader } from '../utils/CustomComponents';

SyntaxHighlighter.registerLanguage('json', json);

const Debug = () => {
  const [data, setData] = useState({
    github: [],
    azure: [],
  });

  const [loading, setLoading] = useState({
    github: true,
    azure: true,
  });

  const [currentSelection, setCurrentSelection] = useState(-1);

  const handleAPICall = (selection) => {
    const fetchGHWebHookLog = async () => {
      setLoading((val) => ({ ...val, azure: true }));
      try {
        const response = await fetch(githubWebhookDebugURL, {
          headers: {
            Authorization:
              `Basic ` + Buffer.from(apiUsername + ':' + apiPassword, 'binary').toString('base64'),
          },
        });
        const records = await response.json();
        const parsedData = records.data.map((rec) => {
          return { ...rec, data: JSON.parse(rec.data) };
        });
        setData((data) => ({ ...data, github: parsedData }));
        setLoading((val) => ({ ...val, github: false }));
      } catch (e) {
        console.error(e);
      }
    };
    const fetchAZDebugLog = async () => {
      setLoading((val) => ({ ...val, azure: true }));
      try {
        const response = await fetch(azureDebugURL, {
          headers: {
            Authorization:
              `Basic ` + Buffer.from(apiUsername + ':' + apiPassword, 'binary').toString('base64'),
          },
        });

        const records = await response.json();

        const parsedData = records.data.map((rec) => {
          return { ...rec, data: JSON.parse(rec.data) };
        });

        setData((data) => ({ ...data, azure: parsedData }));
        setLoading((val) => ({ ...val, azure: false }));
      } catch (e) {
        console.log(e);
      }
    };

    if (selection === 1) {
      if (currentSelection !== 1) {
        setCurrentSelection(1);

        fetchGHWebHookLog();
      }
    }

    if (selection === 0) {
      if (currentSelection !== 0) {
        setCurrentSelection(0);
        fetchAZDebugLog();
      }
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" id="debug">
          Debug
        </Typography>
      </Grid>
      <Grid item>
        <Button
          size="small"
          variant="contained"
          color="primary"
          disabled={currentSelection === 0}
          onClick={() => handleAPICall(0)}
        >
          Azure Cloud Fn
        </Button>
      </Grid>
      <Grid item>
        <Button
          size="small"
          variant="contained"
          disabled={currentSelection === 1}
          color="primary"
          onClick={() => handleAPICall(1)}
        >
          Github Webhooks
        </Button>
      </Grid>

      <Grid item xs={12}>
        {currentSelection === 0 &&
          (loading.azure ? <CustomLoader /> : <RenderCardData type="azure" data={data.azure} />)}
      </Grid>
      <Grid item xs={12}>
        {currentSelection === 1 &&
          (loading.github ? <CustomLoader /> : <RenderCardData type="github" data={data.github} />)}
      </Grid>
    </Grid>
  );
};

export default Debug;

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
});
const RenderCardData = ({ data = [], type = 'azure' }) => {
  const classes = useStyles();
  const { palette } = useTheme();
  return data.length > 0 ? (
    data.map((val, index) => (
      <Card key={`${type}-${index}`}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            {new Date(val.timestamp).toLocaleString()}
          </Typography>
          <Divider />
          <SyntaxHighlighter language="json" style={palette.type === 'dark' ? dark : docco}>
            {JSON.stringify(val.data, undefined, 2)}
          </SyntaxHighlighter>
        </CardContent>
      </Card>
    ))
  ) : (
    <Card>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          No Data
        </Typography>
        <Divider />
      </CardContent>
    </Card>
  );
};

RenderCardData.propTypes = {
  data: PropTypes.array,

  type: PropTypes.oneOf(['azure', 'github']),
};
