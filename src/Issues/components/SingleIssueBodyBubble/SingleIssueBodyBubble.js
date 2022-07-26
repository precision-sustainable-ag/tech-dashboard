import React from 'react';
import Typography from '@material-ui/core/Typography';
// import Avatar from '@material-ui/core/Avatar';
// import { useSelector } from 'react-redux';
import MDEditor from '@uiw/react-md-editor';
import PropTypes from 'prop-types';
import { IconButton, Grid, Tooltip } from '@material-ui/core';
// import './IssueBodyBubble.scss';
import { format_AM_PM } from '../../../utils/constants';
import {
  ChatBubbleBody,
  ChatBubbleAvatar,
  ChatBubbleText,
} from '../../IssueStyledComponents';
// import { Context } from '../../Store/Store';

export const SingleIssueBodyBubble = ({
  issue: { username = 'TechDashboard-BOT', body = '', updated_at },
}) => {
  const justify = 'flex-start';
  const updateDate = new Date(updated_at);
  // const [state] = useContext(Context);
  // const isDarkTheme = useSelector((state) => state.userInfo.isDarkTheme);

  return (
    <Grid container justifyContent={justify}>
      <Grid item>
        <Grid container spacing={2} alignItems="center" justifyContent="flex-start" direction="row">
          <Grid item>
            <Tooltip placement="bottom-start" title={username}>
              <IconButton href={`https://github.com/${username}`} target="_blank" rel="noreferrer">
                {/* <Avatar
                  className="chatBubbleAvatar"
                  src={`https://github.com/${username}.png`}
                  alt={username}
                /> */}
                <ChatBubbleAvatar src={`https://github.com/${username}.png`} alt={username} />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Grid container style={{ padding: 0 }} justifyContent={justify} alignItems={justify}>
              <Grid item>
                {/* <div className={`chatBubbleBody ${justify} ${isDarkTheme ? `dark` : `light`}`}> */}
                <ChatBubbleBody justify={justify}>
                  {/* <Typography
                    variant="body1"
                    component="div"
                    className="chatBubbleText"
                    align={justify === 'flex-start' ? 'left' : 'right'}
                  > */}
                  <ChatBubbleText
                    variant="body1"
                    component="div"
                    align={justify === 'flex-start' ? 'left' : 'right'}
                  >
                    <MDEditor.Markdown source={body} />
                  </ChatBubbleText>
                  {/* </Typography> */}
                </ChatBubbleBody>
                {/* </div> */}
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

SingleIssueBodyBubble.propTypes = {
  issue: PropTypes.object,
};
