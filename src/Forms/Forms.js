// Dependency Imports
import React, { useEffect, useState, useContext } from "react";
import {
  Typography,
  makeStyles,
  Card,
  CardContent,
  Paper,
  Box,
  Grid,
  CardActionArea,
  Button,
  CardActions,
  Slide,
  Dialog,
  DialogContent,
  IconButton,
  withStyles,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";

// Local Imports
import getAllKoboAssets from "./KoboFormAuth";
import FormsLoadingSkeleton from "./FormsLoadingSkeleton";
import { Context } from "../Store/Store";
import { bannedRoles } from "../utils/constants";
import "./Forms.scss";
import { BannedRoleMessage } from "../utils/CustomComponents";
import FormData from "./FormData";
import { Close } from "@material-ui/icons";

// Styles
const useStyles = makeStyles({
  cardContent: {
    minHeight: "80px",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <Close />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

// Default function
const Forms = (props) => {
  const classes = useStyles();

  const [isPSALoading, setIsPSALoading] = useState(true);
  const [isPSASSGLoading, setIsPSASSGLoading] = useState(true);
  const [showForms, setShowForms] = useState(false);
  const [state] = useContext(Context);
  const [open, setOpen] = useState(false);
  const [psaForms, setPsaForms] = useState([]);
  const [psassgForms, setPsassgForms] = useState([]);

  const [dialogMaxWidth, setDialogMaxWidth] = useState("xl");

  const [openAsset, setOpenAsset] = useState({});

  useEffect(() => {
    if (bannedRoles.includes(state.userRole)) {
      setShowForms(false);
    } else {
      console.log("hello from forms");

      getAllKoboAssets("psa")
        .then((response) => {
          setIsPSALoading(false);

          setPsaForms(response.data.data.results);
        })
        .then(async () => {
          await getAllKoboAssets("psassg").then((response) => {
            setIsPSASSGLoading(false);
            setPsassgForms(response.data.data.results);
          });
        });
      setShowForms(true);
    }
  }, [state.userRole]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return showForms ? (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" className="mb-2">
          PSA Forms
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {isPSALoading ? (
          <FormsLoadingSkeleton />
        ) : psaForms.length !== 0 ? (
          <Grid container spacing={3}>
            {psaForms.map((form, index) =>
              form.name !== "" && form.deployment__active ? (
                <Grid item xs={12} md={2} key={`psa-${index}`}>
                  <Card variant="outlined">
                    <CardContent className={classes.cardContent}>
                      <Typography variant="body1">{form.name}</Typography>
                      <Typography variant="body2">
                        Total Submission Count:{" "}
                        {form.deployment__submission_count}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        disabled={form.deployment__submission_count === 0}
                        size="small"
                        variant="text"
                        onClick={() => {
                          setOpenAsset({ ...form, userType: "psa" });
                          handleClickOpen(true);
                        }}
                      >
                        View
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ) : (
                ""
              )
            )}
          </Grid>
        ) : (
          ""
        )}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" className="mt-2">
          Social Science Group Forms
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {isPSASSGLoading ? (
          <FormsLoadingSkeleton />
        ) : psassgForms.length !== 0 ? (
          <Grid container spacing={3}>
            {psassgForms.map((form, index) =>
              form.name !== "" && form.deployment__active ? (
                <Grid item xs={12} md={2} key={`psassg-${index}`}>
                  <Card variant="outlined">
                    <CardContent className={classes.cardContent}>
                      <Typography variant="body1">{form.name}</Typography>
                      <Typography variant="body2">
                        Total Submission Count:{" "}
                        {form.deployment__submission_count}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        disabled={form.deployment__submission_count === 0}
                        size="small"
                        variant="text"
                        onClick={() => {
                          setOpenAsset({ ...form, userType: "psassg" });
                          handleClickOpen(true);
                        }}
                      >
                        View
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ) : (
                ""
              )
            )}
          </Grid>
        ) : (
          ""
        )}
      </Grid>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={dialogMaxWidth}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title" onClose={handleClose}>
          Form Submissions
        </DialogTitle>
        <DialogContent id="alert-dialog-slide-description">
          <FormData {...props} assetMeta={openAsset} assetId={openAsset.uid} />
        </DialogContent>
      </Dialog>
    </Grid>
  ) : (
    <BannedRoleMessage title="Forms Page" />
  );
};

export default Forms;
