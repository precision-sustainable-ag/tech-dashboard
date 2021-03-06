import React from "react";

import Typography from "@material-ui/core/Typography";

import Avatar from "@material-ui/core/Avatar";

import MDEditor from "@uiw/react-md-editor";

import { IconButton, Grid, Tooltip } from "@material-ui/core";
import "./IssueBodyBubble.scss";
import { format_AM_PM } from "../../utils/constants";

export const SingleIssueBodyBubble = ({
  issue: { username = "TechDashboard-BOT", body = "", updated_at },
  isDarkTheme = false,
}) => {
  const justify = "flex-start";
  const updateDate = new Date(updated_at);
  return (
    <Grid container justify={justify}>
      <Grid item>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justify="flex-start"
          direction="row"
        >
          <Grid item>
            <Tooltip placement="bottom-start" title={username}>
              <IconButton
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noreferrer"
              >
                <Avatar
                  className="chatBubbleAvatar"
                  src={`https://github.com/${username}.png`}
                  alt={username}
                />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Grid
              container
              style={{ padding: 0 }}
              justify={justify}
              alignItems={justify}
            >
              <Grid item>
                <div
                  className={`chatBubbleBody ${justify} ${
                    isDarkTheme ? `dark` : `light`
                  }`}
                >
                  <Typography
                    variant="body1"
                    component="div"
                    className="chatBubbleText"
                    align={justify === "flex-start" ? "left" : "right"}
                  >
                    <MDEditor.Markdown source={body} />
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <Grid container justify={justify}>
                  <Grid item>
                    <Typography
                      variant="caption"
                      align={justify === "flex-start" ? "left" : "right"}
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
                      {updateDate.getMonth() + 1}/{updateDate.getDate()} at{" "}
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
