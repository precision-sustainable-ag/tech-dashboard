// Dependency Imports
import React from "react";
import {
  Card,
  makeStyles,
  CardHeader,
  Avatar,
  CardActions,
  Button,
  CardContent,
  Typography
} from "@material-ui/core";

// Styles
const useStyles = makeStyles({
  card: {
    minWidth: 275,
    maxWidth: 300
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

// Default function 
const RepositoriesComponent = props => {
  const repos = props.data;
  console.log(repos);

  return (
    <div className="repoRow">
      {repos.map((repo, index) => (
        <CardBuilder key={index} data={repo} />
      ))}
    </div>
  );
};

// Helper function
const CardBuilder = props => {
  const repo = props.data;
  const classes = useStyles();
  return (
    <Card key={repo.id} className="repo">
      <CardHeader
        avatar={
          <Avatar
            variant="square"
            src={repo.owner.avatar_url}
            alt={repo.owner.login}
          />
        }
        title={repo.name}
      />
      <CardContent>
        <Typography>Open Issues: {repo.open_issues_count}</Typography>
      </CardContent>
      <CardActions>
        <Button
          type="button"
          size="small"
          href={repo.url}
          target="_blank"
          title="Check it on github"
        >
          View
        </Button>
      </CardActions>
    </Card>
  );
};

export default RepositoriesComponent;
