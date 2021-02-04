// Dependency Imports
import React, { useEffect } from "react";
import { makeStyles, Chip } from "@material-ui/core";

// const useStyles = makeStyles(theme => ({
//   root: {
//     backgroundColor: theme.palette.background.paper
//   }
// }));

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

// Default Function
const WaterSensorByGatewayTopbar = (props) => {
  const classes = useStyles();

  const bareNodes = props.bareNodes;
  const coverNodes = props.coverNodes;
  let activeChip = props.activeChip;

  useEffect(() => {
    activeChip = props.activeChip;

    return () => {};
  }, [props.activeChip]);
  return (
    <div className={classes.root}>
      {bareNodes.length > 0 ? (
        <div>
          {bareNodes.map((node, index) => {
            let icon;

            return (
              <Chip
                color={activeChip === node ? "primary" : "secondary"}
                title={`Bare Node, Serial No: ${node}`}
                key={index}
                label={node}
                onClick={() => {
                  console.log("bare node chip clicked");
                  if (activeChip !== node) props.setActiveChip(node);
                }}
                className={classes.chip}
              />
            );
          })}
        </div>
      ) : (
        ""
      )}
      {coverNodes.length > 0 ? (
        <div>
          {coverNodes.map((node, index) => {
            let icon;

            return (
              <Chip
                title={`Cover Node, Serial No: ${node}`}
                color={activeChip === node ? "primary" : "secondary"}
                key={index}
                label={node}
                onClick={() => {
                  if (activeChip !== node) props.setActiveChip(node);
                  console.log("cover node chip clicked");
                }}
                className={classes.chip}
              />
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default WaterSensorByGatewayTopbar;
