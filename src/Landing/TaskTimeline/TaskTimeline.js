// Dependency Imports
import React, { useEffect, useState } from 'react';
import { Typography, Grid, Paper, Button } from '@material-ui/core';
import { apiPassword, apiURL, apiUsername } from '../../utils/api_secret';
import { Skeleton } from '@material-ui/lab';
import parse, { attributesToProps } from 'html-react-parser';
import { Link } from 'react-router-dom';

const options = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.name === 'a') {
      const props = attributesToProps(domNode.attribs);
      if (props.href.startsWith('https://onfarmtech.org/')) {
        const relativeLink = props.href.replace('https://onfarmtech.org', '');
        props.target = '_self';
        return (
          <Button
            size="small"
            component={Link}
            to={relativeLink}
            {...props}
            variant="text"
            style={{ textTransform: 'capitalize' }}
          >
            {relativeLink.split('/').join('').split('-').join(' ')}
          </Button>
        );
      }
    }
  },
  trim: true,
};
// Default function
const TaskTimeline = () => {
  const [htmlData, setHtmlData] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      let data = await fetch(`${apiURL}/api/psa/internal/pages/1592`, {
        headers: {
          Authorization: `Basic ${Buffer.from(apiUsername + ':' + apiPassword, 'binary').toString(
            'base64',
          )}`,
        },
      });
      let response = await data.text();

      setHtmlData(response);
    };

    fetchData();
  }, []);

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
          <Paper style={{ padding: '1em' }} elevation={3}>
            {parse(htmlData, options)}
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default TaskTimeline;
