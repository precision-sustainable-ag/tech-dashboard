import MDEditor, { commands } from "@uiw/react-md-editor";
import React, { useState, useEffect } from "react";
import { PersonAdd } from "@material-ui/icons";
import { Octokit } from "@octokit/rest";
import { githubToken } from "../utils/api_secret";
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
  } from "@material-ui/core";

const Comments = (props) => {
    const [newComment, setNewComment] = useState("");
    const [searchUser, setSearchUser] = useState("");
    const [showUsersDialog, setShowUsersDialog] = useState(false);
    const [githubUsers, setGithubUsers] = useState([]);

    const setNewCommentBody = (text) => {
        setNewComment(text);
    };

    const filteredUsers = React.useMemo(() => {
        return githubUsers.filter((user) =>
          user.login.toLowerCase().includes(searchUser.toLowerCase())
        );
      }, [searchUser, githubUsers]);

    const githubUserMentionCommand = {
        name: "MentionUser",
        keyCommand: "MentionUser",
        buttonProps: { "aria-label": "Mention user" },
        icon: <PersonAdd style={{ width: "12px", height: "12px" }} />,
        execute: (state, api) => {
            console.log(state, api);
            if (!state.selectedText) {
            // no text selected, show all users
            setSearchUser("");
            setShowUsersDialog(true);
            } else {
            // find users that begin with selected users
            setSearchUser(state.selectedText);
            setShowUsersDialog(true);
            }
        },
    };

    useEffect(() => {
        async function getUsers() {
          const octokit = new Octokit({ auth: githubToken });
          return await octokit.request("GET /repos/{owner}/{repo}/collaborators", {
            owner: "precision-sustainable-ag",
            repo: "data_corrections",
          });
        }
    
        getUsers().then((response) => {
          if (response.status === 200 && response.data.length > 0) {
            setGithubUsers(
              response.data.filter((user) => user.login !== "TechDashboard-BOT")
            );
          } else {
            setGithubUsers([]);
            console.error(response);
          }
        });
    
        return () => {
          setGithubUsers([]);
        };
      }, []);

    let body;

    if(props.dataType === "table"){
        let tableData = `<table>
            <tbody>`
        
        for(var key in props.rowData) {
            var value = props.rowData[key];

            if(key !== "tableData"){
                tableData = tableData + `<tr>
                                        <td>${key}</td>
                                        <td>${value}</td>
                                    </tr>`;
            }
            else
                continue;
        }

        tableData = tableData + `</tbody>
        </table>`;
        body = tableData + " <br/> " + newComment
    } else if(props.dataType === "json"){
        body = "```json\n" + props.rowData + "\n```\n" + " <br/> " + newComment;
    } else
        body = newComment;

    return(
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Grid container spacing={1}>
                    <Grid item lg={12}>
                        <Typography variant="caption">
                            Please enter your comments below
                        </Typography>
                        <MDEditor
                            preview="edit"
                            value={newComment}
                            height={110}
                            onChange={setNewCommentBody}
                            commands={[
                            commands.bold,
                            commands.italic,
                            commands.hr,
                            commands.code,
                            commands.checkedListCommand,
                            commands.unorderedListCommand,
                            commands.quote,
                            commands.title,
                            commands.fullscreen,
                            commands.codeLive,
                            commands.codeEdit,
                            githubUserMentionCommand,
                            ]}
                        />
                    </Grid>
                    <Grid item xs={12}>
                    
                    </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={props.buttonDisabled}
                                onClick={() => {props.handleNewComment(body); setNewCommentBody("")}}
                            >
                                {props.buttonDisabled ? "Creating Comment" : "Add Comment"}
                            </Button>
                        </Grid>
                </Grid>
            </Grid>
            <Dialog
            open={showUsersDialog}
            onClose={() => setShowUsersDialog(false)}
            aria-labelledby="form-dialog-title"
            disableBackdropClick
            fullWidth
            maxWidth="lg"
            >
                <DialogTitle id="form-dialog-title">Github Users</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                    {githubUsers.length > 0 ? (
                        <>
                        <Grid item xs={12}>
                            <TextField
                            fullWidth
                            placeholder="Search users here"
                            value={searchUser}
                            onChange={(e) => setSearchUser(e.target.value)}
                            />
                        </Grid>

                        {filteredUsers.map((user) => (
                            <Grid item key={user.id} xs={12} md={4}>
                            <Grid
                                container
                                direction="row"
                                justify="flex-start"
                                spacing={1}
                            >
                                <Grid item xs="auto" md="auto">
                                <Avatar
                                    variant="rounded"
                                    alt={user.login}
                                    src={user.avatar_url}
                                />
                                </Grid>
                                <Grid item xs="auto" md="auto">
                                <Button
                                    onClick={() => {
                                    setNewComment(newComment + ` @${user.login}`);
                                    setShowUsersDialog(false);
                                    setSearchUser("");
                                    }}
                                >
                                    {user.login}
                                </Button>
                                </Grid>
                            </Grid>
                            </Grid>
                        ))}
                        </>
                    ) : (
                        <Typography variant="body1">No Users Available</Typography>
                    )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowUsersDialog(false)}
                    >
                    Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}

export default Comments;
