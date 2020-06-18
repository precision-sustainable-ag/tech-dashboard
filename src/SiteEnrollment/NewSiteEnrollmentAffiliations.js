import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  Typography,
  MenuItem,
  makeStyles,
} from "@material-ui/core";

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

const NewSiteEnrollmentAffiliations = (props) => {
  const classes = useStyles();
  const allAffiliations = props.allAffiliations || [];
  const selectedAff = props.completeEnrollmentInfo.selectedAffiliation;
  const handleChange = (event) => {
    props.setCompleteEnrollmentInfo({
      ...props.completeEnrollmentInfo,
      selectedAffiliation: event.target.value,
    });
  };

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
        {allAffiliations.map((aff) => (
          <MenuItem value={aff} key={aff}>
            {aff}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default NewSiteEnrollmentAffiliations;
