import React from 'react';

import Typography from '@material-ui/core/Typography';

import Avatar from '@material-ui/core/Avatar';

import MDEditor from '@uiw/react-md-editor';

import PropTypes from 'prop-types';
// import "./IssueBodyBubble.scss";
import { IconButton, Grid, Tooltip, makeStyles } from '@material-ui/core';
import { format_AM_PM } from '../../utils/constants';
import styled from 'styled-components';
import clsx from 'clsx';

const ChatBubbleBody = styled.div`
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 1.2em;
  padding-right: 1.2em;
  background-color: #f5f5f5;
  border-radius: 20px;
  font-size: 14px;
  box-shadow: 0 2px 1px #2d2d2d;
  &.dark {
    color: black;
  }
  &.light {
    color: black;
  }

  &.flex-end {
    border-bottom-right-radius: 5px;
    background-color: #2e7d32;
    color: white;
  }
  &.flex-start {
    border-top-left-radius: 5px;
  }
`;

const useStyles = makeStyles({
  chatBubbleText: {
    '&:first-letter': {
      textTransform: 'capitalize',
    },
  },
  chatBubbleAvatar: {
    boxShadow: '0 0 6px 1px #2d2d2d',
    border: 0,
  },
});

const IssueBubbleBody = ({ issueData, user }) => {
  const classes = useStyles();
  let side = issueData.hasMention
    ? issueData.user.login === user.nickname
      ? 'flex-end'
      : 'flex-start'
    : 'flex-start';

  const justify = issueData.hasMention
    ? side
    : issueData.user.login === user.nickname
    ? 'flex-end'
    : 'flex-start';

  const issueAuthor = issueData.hasMention
    ? issueData.mention.split('@')[1].split('[')[0]
    : issueData.user.login;

  const updateDate = new Date(issueData.updated_at);
  return (
    <Grid container justifyContent={justify}>
      <Grid item>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="flex-start"
          direction={justify === 'flex-start' ? 'row' : 'row-reverse'}
        >
          <Grid item>
            <Tooltip placement="bottom-start" title={issueAuthor}>
              <IconButton
                href={`https://github.com/${issueAuthor}`}
                target="_blank"
                rel="noreferrer"
              >
                <Avatar
                  className={classes.chatBubbleAvatar}
                  src={
                    issueData.hasMention
                      ? `https://github.com/${issueData.mention.split('@')[1].split('[')[0]}.png`
                      : issueData.user.avatar_url
                  }
                  alt={issueData.user.login}
                />
              </IconButton>
            </Tooltip>
            {/* <Button
              component={Link}
              to={`/issues`}
              variant="contained"
              startIcon={<ArrowBack />}
            >
              All Issues
            </Button> */}
          </Grid>
          <Grid item>
            <Grid container style={{ padding: 0 }} justifyContent={justify} alignItems={justify}>
              {/* ${justify} ${
                    isDarkTheme ? `dark` : `light`
                  }` */}
              <Grid item>
                <ChatBubbleBody className={clsx(justify, {})}>
                  <Typography
                    variant="body1"
                    component="div"
                    className={classes.chatBubbleText}
                    align={justify === 'flex-start' ? 'left' : 'right'}
                  >
                    {issueData.viaEmail ? (
                      <MDEditor.Markdown source={issueData.parsedEmailBody.getVisibleText()} />
                    ) : (
                      <MDEditor.Markdown source={issueData.body} />
                    )}
                  </Typography>
                </ChatBubbleBody>
              </Grid>
              <Grid item xs={12}>
                <Grid container justifyContent={justify}>
                  <Grid item>
                    <Typography
                      variant="caption"
                      align={justify === 'flex-start' ? 'left' : 'right'}
                    >
                      {/* By{" "}
                      <a
                        href={`https://github.com/${issueAuthor}`}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {issueAuthor}
                      </a>{" "}
                      on  */}
                      {updateDate.getMonth() + 1}/{updateDate.getDate()} at{' '}
                      {format_AM_PM(updateDate)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default IssueBubbleBody;

IssueBubbleBody.propTypes = {
  issueData: PropTypes.any,
  isDarkTheme: PropTypes.bool,
  user: PropTypes.object,
};
