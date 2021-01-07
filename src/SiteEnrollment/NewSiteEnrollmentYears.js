// Dependency Imports
import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  makeStyles,
  MenuItem,
  Typography,
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

const NewSiteEnrollmentYears = (props) => {
  const classes = useStyles();

  const handleChange = (event) => {
    props.setCompleteEnrollmentInfo({
      ...props.completeEnrollmentInfo,
      selectedYear: event.target.value,
    });
  };
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">
        <Typography variant="body1">Year</Typography>
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={props.completeEnrollmentInfo.selectedYear}
        onChange={handleChange}
      >
        <MenuItem value={props.currentYear}>
          {props.currentYear.toString()}
        </MenuItem>
        <MenuItem value={props.currentYear + 1}>
          {(props.currentYear + 1).toString()}
        </MenuItem>
      </Select>
    </FormControl>
  );
};
export default NewSiteEnrollmentYears;
