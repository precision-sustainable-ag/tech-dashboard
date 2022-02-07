// import React, { useState, useEffect } from "react";
import React, { useEffect, useState } from 'react';
import { Paper, Typography, Grid, Button } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import PropTypes from 'prop-types';
import { apiPassword, apiURL, apiUsername } from '../utils/api_secret';
import parse, { attributesToProps } from 'html-react-parser';
import { Link } from 'react-router-dom';

const Protocols = () => {
  const [htmlData, setHtmlData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      let data = await fetch(`${apiURL}/api/psa/internal/pages/957`, {
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

  const options = {
    replace: (domNode) => {
      // if (domNode.attribs && domNode.name === "span") {
      //   const props = attributesToProps(domNode.attribs);
      //   // props.style = {};
      //   return <span {...props} />;
      // }

      if (domNode.attribs && domNode.name === 'a') {
        const props = attributesToProps(domNode.attribs);

        if (props.href.startsWith('https://onfarmtech.org/')) {
          // domNode
          console.log(domNode);
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

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h5" align="left" gutterBottom>
          On-Farm Protocols
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

export default Protocols;
Protocols.propTypes = {
  href: PropTypes.string,
};
