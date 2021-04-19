import React from "react";

import Typography from "@material-ui/core/Typography";

import Avatar from "@material-ui/core/Avatar";

import MDEditor from "@uiw/react-md-editor";

import "./IssueBodyBubble.scss";
import { IconButton, Grid, Tooltip } from "@material-ui/core";
import { format_AM_PM } from "../../utils/constants";

const IssueBubbleBody = ({ issueData, user, isDarkTheme }) => {
  let side = issueData.hasMention
    ? issueData.user.login === user.nickname
      ? "flex-end"
      : "flex-start"
    : "flex-start";

  const justify = issueData.hasMention
    ? side
    : issueData.user.login === user.nickname
    ? "flex-end"
    : "flex-start";

  const issueAuthor = issueData.hasMention
    ? issueData.mention.split("@")[1].split("[")[0]
    : issueData.user.login;

  const updateDate = new Date(issueData.updated_at);
  return (
    <Grid container justify={justify}>
      <Grid item>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justify="flex-start"
          direction={justify === "flex-start" ? "row" : "row-reverse"}
        >
          <Grid item>
            <Tooltip placement="bottom-start" title={issueAuthor}>
              <IconButton
                href={`https://github.com/${issueAuthor}`}
                target="_blank"
                rel="noreferrer"
              >
                <Avatar
                  className="chatBubbleAvatar"
                  src={
                    issueData.hasMention
                      ? `https://github.com/${
                          issueData.mention.split("@")[1].split("[")[0]
                        }.png`
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
                    {issueData.viaEmail ? (
                      <MDEditor.Markdown
                        source={issueData.parsedEmailBody.getVisibleText()}
                      />
                    ) : (
                      <MDEditor.Markdown source={issueData.body} />
                    )}
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

export default IssueBubbleBody;
