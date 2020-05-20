import React, { useState, Fragment } from "react";
import {
  Modal,
  Fade,
  Backdrop,
  makeStyles,
  Button,
  Dialog,
  AppBar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Toolbar,
  Slide,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { AntSwitch } from "../utils/CustomComponents";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  grid: {
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    marginTop: theme.spacing(2),
  },
}));

const NewSiteEnrollmentModal = (props) => {
  const classes = useStyles();

  const [year, setYear] = useState(props.defaultYear);
  const [irrigation, setIrrigation] = useState(false);

  const handleYearChange = (el) => {
    setYear(el.target.value);
  };

  const handleIrrigationChange = (event) => {
    setIrrigation(event.target.checked);
  };
  const renderYears = () => {
    let yearsArray = [props.defaultYear - 2, props.defaultYear - 1];

    yearsArray.push(
      props.defaultYear,
      props.defaultYear + 1,
      props.defaultYear + 2
    );

    return yearsArray.map((year, index) => (
      <MenuItem value={year} key={index}>
        {year}
      </MenuItem>
    ));
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={props.open}
        onClose={props.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={props.handleClose}
              aria-label="close"
            >
              <Close />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Enroll New Site
            </Typography>
            <Button autoFocus color="inherit" onClick={props.handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>

        <Grid container className={classes.grid}>
          <Grid item lg={12} style={{ marginBottom: "2em" }}>
            <Typography variant="h4">Basic Information</Typography>
            <Divider />
          </Grid>
          <Grid item lg={3} sm={12}>
            <InputLabel id="select-year-helper-label">
              Enrollment Year
            </InputLabel>
            <Select
              labelId="select-year-helper-label"
              id="select-year-helper"
              value={year}
              onChange={handleYearChange}
            >
              {renderYears()}
            </Select>
            <FormHelperText>Select enrollment year</FormHelperText>
          </Grid>
          <Grid item lg={3} sm={12}>
            <InputLabel id="check-site-irrigation-label">
              Irrigation on site?
            </InputLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={irrigation}
                  onChange={handleIrrigationChange}
                  color="primary"
                />
              }
              label={irrigation ? "Yes" : "No"}
            />
          </Grid>
          <Grid item lg={3} sm={12}>
            <InputLabel id="select-partner-code-label">Partner Code</InputLabel>
            <Select
              labelId="select-partner-code-label"
              id="select-partner-code"
              value={year}
              onChange={handleYearChange}
            >
              {renderYears()}
            </Select>
            <FormHelperText>Lab or partner code</FormHelperText>
          </Grid>
          <Grid item lg={3} sm={12}></Grid>
          <Grid item lg={12} style={{ marginBottom: "2em", marginTop: "2em" }}>
            <Typography variant="h4">Grower Information</Typography>
            <Divider />
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
};

export default NewSiteEnrollmentModal;

// <Modal
//   aria-labelledby="transition-modal-title"
//   aria-describedby="transition-modal-description"
//   className={classes.modal}
//   open={props.open}
//   onClose={props.handleClose}
//   closeAfterTransition
//   BackdropComponent={Backdrop}
//   BackdropProps={{
//     timeout: 500,
//   }}
// >
//   <Fade in={props.open}>

//     <div className={classes.paper}>
//       <h2 id="transition-modal-title">Transition modal</h2>
//       <p id="transition-modal-description">
//         react-transition-group animates me.
//       </p>
//     </div>
//   </Fade>
// </Modal>
