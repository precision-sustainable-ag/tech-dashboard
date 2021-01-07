// Dependency Imports
import React, { useContext, useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  Typography,
  MenuItem,
  makeStyles,
} from "@material-ui/core";

// Local Imports
import { Context } from "../Store/Store";

// Styles
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: "90%",
  },

  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

// Default function 
const NewSiteEnrollmentAffiliations = (props) => {
  const [state, dispatch] = useContext(Context);
  const classes = useStyles();
  const allAffiliations = props.allAffiliations || [];
  const [selectedAff, setSelectedAff] = useState(
    props.completeEnrollmentInfo.selectedAffiliation
  );
  const handleChange = (event) => {
    setSelectedAff(event.target.value);
    props.setCompleteEnrollmentInfo({
      ...props.completeEnrollmentInfo,
      selectedAffiliation: event.target.value,
    });
  };

  useEffect(() => {
    // console.log(allAffiliations);
    if (state.userInfo) {
      if (state.userInfo.state.toUpperCase() === "ALL") {
        setSelectedAff("NC");
      } else {
        const firstState = state.userInfo.state.toUpperCase().split(",")[0];
        setSelectedAff(firstState);
        props.setCompleteEnrollmentInfo({
          ...props.completeEnrollmentInfo,
          selectedAffiliation: firstState,
        });
      }
    }
  }, [state.userInfo]);

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="affiliation-select-label">
        <Typography variant="body1">Affiliation</Typography>
      </InputLabel>
      <Select
        labelId="affiliation-select-label"
        id="affiliation-simple-select"
        value={selectedAff}
        onChange={handleChange}
      >
        {props.allAffs.map((aff) => (
          <MenuItem value={aff.affiliation} key={aff.affiliation}>
            {aff.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default NewSiteEnrollmentAffiliations;
