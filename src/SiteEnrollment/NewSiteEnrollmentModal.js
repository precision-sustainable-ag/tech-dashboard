import React, { useState, Fragment, useEffect, useContext } from "react";
import {
  makeStyles,
  Button,
  Dialog,
  AppBar,
  Box,
  IconButton,
  Typography,
  Divider,
  Toolbar,
  Slide,
  Grid,
  Select,
  MenuItem,
  Switch,
  Input,
  TextField,
  InputAdornment,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  CardActions,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  MobileStepper,
  Slider,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { Close, Save, Check, GpsFixed } from "@material-ui/icons";
import { Alert, Skeleton } from "@material-ui/lab";
import Axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Local Imports
import { CustomLoader } from "../utils/CustomComponents";
import { Context } from "../Store/Store";
import {
  apiURL,
  apiUsername,
  apiPassword,
  googleApiKey,
} from "../utils/api_secret";
import { fetchGrowerByLastName, ucFirst } from "../utils/constants";
import NewSiteEnrollmentYears from "./NewSiteEnrollmentYears";
import NewSiteEnrollmentAffiliations from "./NewSiteEnrollmentAffiliations";

//Globals
const qs = require("qs");
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
// import { AntSwitch } from "../utils/CustomComponents";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Styles
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
  instructions: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
  },
  button: {
    marginRight: theme.spacing(1),
  },
  belowHeader: {
    marginBottom: theme.spacing(3),
  },
}));

// Helper function
const getSteps = () => {
  return [
    "Basic Information",
    "Grower Information",
    "Site Information",
    "Confirmation",
  ];
};

// Default function 
const NewSiteEnrollmentModal = (props) => {
  const classes = useStyles();

  const theme = useTheme();
  const mdMatch = useMediaQuery(theme.breakpoints.up("md"));

  const [siteAffilitaion, setSiteAffiliation] = useState([]);
  const [allAffs, setAllAffs] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchSiteAffiliations = async () => {
    return await Axios({
      url: `${apiURL}/api/retrieve/grower/affiliation/all`,
      method: "GET",
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
    });
  };

  useEffect(() => {
    setLoading(true);
    let siteAffResponse = fetchSiteAffiliations();

    siteAffResponse
      .then((resp) => {
        let data = resp.data.data;
        let affs = [];
        // console.log(data);
        affs = data.map((aff) => {
          return aff.affiliation;
        });
        setAllAffs(data);
        setSiteAffiliation(affs);
      })
      .then(() => {
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });

    return () => {
      setSiteAffiliation([]);
      setLoading(false);
      // setAjaxProgress(0);
    };
  }, []);

  //   useEffect(() => {}, [growerState]);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const steps = getSteps();
  const isStepOptional = (step) => {
    // return step === 1;
    return false;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const siteValidationCheck = () => {
    // TODO:
    return true;
  };
  const handleNext = () => {
    if (activeStep === 1) {
      if (
        window.confirm(
          "Are you sure you want to proceed? You can not revert back to this screen"
        )
      ) {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
          newSkipped = new Set(newSkipped.values());
          newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
      } else {
      }
    } else if (activeStep === 2) {
      if (completeEnrollmentInfo.sites.length === 0) {
        window.alert("Please add sites!");
      } else if (!siteValidationCheck(completeEnrollmentInfo.sites)) {
        window.alert(
          "Please make sure complete site information has been added"
        );
      } else {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
          newSkipped = new Set(newSkipped.values());
          newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
      }
    } else {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
      if (activeStep === steps.length - 1) {
        // reset and close
        handleReset();
        setCompleteEnrollmentInfo({
          selectedYear: props.defaultYear,
          selectedAffiliation: siteAffilitaion[0] || "NC",
          sites: [],
        });

        props.handleClose();
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BasicInfo
            currentYear={props.defaultYear}
            allAffiliations={siteAffilitaion}
            completeEnrollmentInfo={completeEnrollmentInfo}
            setCompleteEnrollmentInfo={setCompleteEnrollmentInfo}
            nextBtnDisabled={nextBtnDisabled}
            setNextBtnDisabled={setNextBtnDisabled}
            user={props.userInfo}
            allAffs={allAffs}
          />
        );
      case 1:
        return (
          <GrowerInfo
            completeEnrollmentInfo={completeEnrollmentInfo}
            setCompleteEnrollmentInfo={setCompleteEnrollmentInfo}
            nextBtnDisabled={nextBtnDisabled}
            setNextBtnDisabled={setNextBtnDisabled}
            allAffs={allAffs}
          />
        );
      case 2:
        return (
          <SiteInfo
            completeEnrollmentInfo={completeEnrollmentInfo}
            setCompleteEnrollmentInfo={setCompleteEnrollmentInfo}
            nextBtnDisabled={nextBtnDisabled}
            setNextBtnDisabled={setNextBtnDisabled}
            allAffs={allAffs}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            completeEnrollmentInfo={completeEnrollmentInfo}
            setCompleteEnrollmentInfo={setCompleteEnrollmentInfo}
            nextBtnDisabled={nextBtnDisabled}
            setNextBtnDisabled={setNextBtnDisabled}
            allAffs={allAffs}
          />
        );
      default:
        return "Unknown step";
    }
  };

  const [completeEnrollmentInfo, setCompleteEnrollmentInfo] = useState({
    selectedYear: props.defaultYear,
    selectedAffiliation: siteAffilitaion[0] || "NC",
    sites: [],
  });
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);
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
            {/* <Button autoFocus color="inherit" onClick={handleFinalSave}>
              save
            </Button> */}
          </Toolbar>
        </AppBar>

        {loading ? (
          <Grid
            container
            className={classes.grid}
            alignItems="center"
            justify="center"
          >
            <Grid item sm={12}>
              <Box position="relative" display="inline-flex">
                <CircularProgress variant="static" />
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            className={classes.grid}
            alignItems="center"
            justify="center"
          >
            <Grid item lg={12}>
              {mdMatch ? (
                <Stepper
                  activeStep={activeStep}
                  steps={steps.length}
                  variant="elevation"
                  // variant="progress"
                >
                  {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepOptional(index)) {
                      labelProps.optional = (
                        <Typography variant="caption">Optional</Typography>
                      );
                    }
                    if (isStepSkipped(index)) {
                      stepProps.completed = false;
                    }
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              ) : (
                <MobileStepper
                  activeStep={activeStep}
                  steps={steps.length}
                  // variant="elevation"
                  variant="text"
                >
                  {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepOptional(index)) {
                      labelProps.optional = (
                        <Typography variant="caption">Optional</Typography>
                      );
                    }
                    if (isStepSkipped(index)) {
                      stepProps.completed = false;
                    }
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </MobileStepper>
              )}
            </Grid>

            <Grid item lg={12}>
              {activeStep === steps.length ? (
                <div>
                  <Typography className={classes.instructions}>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Button onClick={handleReset} className={classes.button}>
                    Reset
                  </Button>
                </div>
              ) : (
                <Grid container justify="center">
                  <Grid item className={classes.instructions} lg={12}>
                    <Grid container justify="center" alignItems="center">
                      {getStepContent(activeStep)}
                    </Grid>
                  </Grid>
                  <Grid item lg={12} style={{ paddingBottom: "2em" }}>
                    {/* <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "3rem",
                      }}
                    > */}
                    <Button
                      disabled={activeStep === 0 || activeStep === 2}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>

                    {isStepOptional(activeStep) && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSkip}
                        className={classes.button}
                      >
                        Skip
                      </Button>
                    )}

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                      disabled={nextBtnDisabled}
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                    {/* </div> */}
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
      </Dialog>
    </div>
  );
};

const GrowerInfo = (props) => {
  const classes = useStyles();
  const [currentBtn, setCurrentBtn] = useState(1);
  const [producerCodes, setProducerCodes] = useState([]);
  const [growerBasicInfo, setGrowerBasicInfo] = useState({
    collaborationStatus:
      props.completeEnrollmentInfo.collaborationStatus || "University",
    phone: props.completeEnrollmentInfo.phone || null,
    producerId: props.completeEnrollmentInfo.producerId || "",
    lastName: props.completeEnrollmentInfo.lastName || "",
    email: props.completeEnrollmentInfo.email || "",
  });
  const [alert, setAlert] = useState({
    show: false,
    text: "",
  });
  const [growerLastNameSearch, setGrowerLastNameSearch] = useState("");
  const [
    growerLastNameSearchLoading,
    setGrowerLastNameSearchLoading,
  ] = useState(false);
  const [growerInfoFetch, setGrowerInfoFetch] = useState([
    new ExistingGrower("", "", "", "", ""),
  ]);

  const emailIsNotValid = (email) => {
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    if (growerLastNameSearch.length >= 3) {
      // start searching
      setGrowerLastNameSearchLoading(true);

      let lastNamePromise = fetchGrowerByLastName(growerLastNameSearch);
      lastNamePromise
        .then((resp) => {
          let data = resp.data.data;
          let growerArray = [];
          if (data.length > 0) {
            data.map((val) => {
              // console.log(val);
              growerArray.push(
                new ExistingGrower(
                  val.collaboration_status,
                  val.producer_id,
                  val.last_name,
                  val.email,
                  val.phone
                )
              );
            });
            return growerArray;
          } else return [new ExistingGrower("", "", "", "", "")];
          // setGrowerInfoFetch(data);
        })
        .then((growerArray) => {
          // console.log(growerArray);
          setGrowerInfoFetch(growerArray);
          setGrowerLastNameSearchLoading(false);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [growerLastNameSearch]);

  useEffect(() => {
    // reset growerBasicInfo

    setGrowerBasicInfo({
      collaborationStatus: "University",
      phone: null,
      producerId: "",
    });
    if (currentBtn === 0) {
      if (Reflect.ownKeys(growerBasicInfo).length === 4) {
        if (
          growerBasicInfo.lastName.length === 0 ||
          emailIsNotValid(growerBasicInfo.email) ||
          growerBasicInfo.phone.length === 0 ||
          growerBasicInfo.phone.length > 10
        ) {
          props.setNextBtnDisabled(true);
        } else {
          props.setNextBtnDisabled(false);
          // console.log("complete", {
          //             ...props.completeEnrollmentInfo,
          //             ...growerBasicInfo,
          //           });
          props.setCompleteEnrollmentInfo({
            ...props.completeEnrollmentInfo,
            ...growerBasicInfo,
          });
        }
      } else {
        props.setNextBtnDisabled(true);
      }
    } else {
      props.setNextBtnDisabled(true);
    }
  }, [currentBtn]);
  // disable next btn on component load
  useEffect(() => {
    props.setNextBtnDisabled(true);
  }, []);

  useEffect(() => {
    // check if growerbasicinfo is complete, setNextBtnDisabled(false) if true

    if (Reflect.ownKeys(growerBasicInfo).length >= 4) {
      if (growerBasicInfo.lastName) {
        if (growerBasicInfo.lastName.length === 0) {
          props.setNextBtnDisabled(true);
          setAlert({
            show: true,
            text: "Last Name cannont be empty",
          });
        } else {
          props.setNextBtnDisabled(false);
          // console.log("complete", {
          //   ...props.completeEnrollmentInfo,
          //   ...growerBasicInfo,
          // });
          props.setCompleteEnrollmentInfo({
            ...props.completeEnrollmentInfo,
            ...growerBasicInfo,
          });

          // setProducerCodes(getSiteCodesForProducer(growerBasicInfo.producerId))
        }
      } else {
        props.setNextBtnDisabled(true);
        // setAlert({
        //   show: true,
        //   text: 'Last Name cannont be empty'
        // })
      }
    }
  }, [growerBasicInfo]);

  const getSiteCodesForProducer = async (producerId) => {
    // let producerId = props.producerId;
    let fetchSitesPromise = await fetchSiteCodesForProducer(producerId);
    let codes = [];
    let data = fetchSitesPromise.data.data;
    codes = data.map((r, i) => {
      return r.code;
    });

    let str = `siteCodesFor${producerId}`;
    setProducerCodes([codes.toString()]);

    if (codes.length === 0) {
      document.getElementById(str).textContent = "No Sites";
    } else {
      document.getElementById(str).textContent = [codes.toString()];
    }
  };
  return (
    <Fragment>
      <Grid item lg={12} className={classes.belowHeader}>
        <Typography variant="h4">Grower Information</Typography>
      </Grid>
      <Grid item lg={12} className={classes.belowHeader}>
        <Grid container spacing={4}>
          <Grid item>
            <Button
              variant="contained"
              color={currentBtn === 0 ? "primary" : "secondary"}
              onClick={() => {
                setCurrentBtn(0);
              }}
            >
              Add New Grower
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color={currentBtn === 0 ? "secondary" : "primary"}
              onClick={() => {
                setCurrentBtn(1);
              }}
            >
              Use Existing Grower
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={12}>
        {currentBtn === 0 ? (
          <Grid container spacing={3}>
            <Grid item lg={6} sm={12}>
              <Grid container spacing={4}>
                <Grid item lg={12}>
                  <TextField
                    fullWidth
                    id="grower-last-name"
                    label="Last Name"
                    value={growerBasicInfo.lastName || ""}
                    onChange={(event) => {
                      setGrowerBasicInfo({
                        ...growerBasicInfo,
                        lastName: event.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item lg={12}>
                  <TextField
                    fullWidth
                    id="grower-email"
                    label="Email"
                    type="email"
                    value={growerBasicInfo.email || ""}
                    onChange={(event) => {
                      setGrowerBasicInfo({
                        ...growerBasicInfo,
                        email: event.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item lg={12}>
                  <TextField
                    fullWidth
                    id="grower-phone"
                    label="Phone"
                    value={growerBasicInfo.phone || ""}
                    onChange={(event) => {
                      setGrowerBasicInfo({
                        ...growerBasicInfo,
                        phone: event.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item lg={12}>
                  <Select
                    fullWidth
                    label="Collaboration Status"
                    labelId="collab-status-select-label"
                    id="collab-simple-select"
                    value={growerBasicInfo.collaborationStatus || "University"}
                    onChange={(event) => {
                      setGrowerBasicInfo({
                        ...growerBasicInfo,
                        collaborationStatus: event.target.value,
                      });
                    }}
                  >
                    <MenuItem value="University">University</MenuItem>
                    <MenuItem value="Partner">Partner</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={12}>
              <Grid container>
                <Grid item lg={6} sm={12}>
                  {alert.show ? (
                    <Alert severity="error">{alert.text}</Alert>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item sm={12}>
              <TextField
                fullWidth
                label="Search Growers By Last Name"
                onChange={(event) => {
                  setGrowerLastNameSearch(event.target.value);
                }}
              />
            </Grid>
            <Grid item sm={12}>
              <Grid container spacing={4}>
                {growerLastNameSearchLoading ? (
                  <Skeleton variant="rect" height="300px" width="300px" />
                ) : growerInfoFetch[0].collaborationStatus !== "" ? (
                  growerInfoFetch.map((grower, index) => (
                    <Grid item key={index} lg={4}>
                      <Card style={{ minWidth: "275" }}>
                        <CardHeader
                          avatar={
                            <Avatar>
                              {grower.lastName.charAt(0).toUpperCase()}
                            </Avatar>
                          }
                          title={ucFirst(grower.lastName)}
                        />

                        <CardContent>
                          <Grid container spacing={2}>
                            {/* <Grid item sm={6}>
                              <Typography
                                variant="body2"
                                style={{ fontWeight: "bold" }}
                              >
                                Collaboration
                              </Typography>
                            </Grid>
                            <Grid item sm={6}>
                              <Typography variant="body2">
                                {ucFirst(grower.collaborationStatus)}
                              </Typography>
                            </Grid> */}
                            <Grid item sm={6}>
                              <Typography
                                variant="body2"
                                style={{ fontWeight: "bold" }}
                              >
                                Producer ID
                              </Typography>
                            </Grid>
                            <Grid item sm={6}>
                              <Typography variant="body2">
                                {ucFirst(grower.producerId)}
                              </Typography>
                            </Grid>
                            <Grid item sm={6}>
                              <Typography
                                variant="body2"
                                style={{ fontWeight: "bold" }}
                              >
                                Email
                              </Typography>
                            </Grid>
                            <Grid item sm={6}>
                              <Typography variant="body2">
                                {ucFirst(grower.email)}
                              </Typography>
                            </Grid>
                            <Grid item sm={6}>
                              <Typography
                                variant="body2"
                                style={{ fontWeight: "bold" }}
                              >
                                Phone
                              </Typography>
                            </Grid>
                            <Grid item sm={6}>
                              <Typography variant="body2">
                                {ucFirst(grower.phone)}
                              </Typography>
                            </Grid>
                            <Grid item sm={6}>
                              <Button
                                size="small"
                                onClick={() => {
                                  getSiteCodesForProducer(grower.producerId);
                                }}
                              >
                                Show Sites{" "}
                              </Button>
                            </Grid>
                            <Grid item sm={6}>
                              <code
                                style={{ overflowWrap: "break-word" }}
                                id={`siteCodesFor${grower.producerId}`}
                              ></code>
                              {/* {getSiteCodesForProducer(grower.producerId)} */}
                              {/* <SiteCodesForProducer
                                producerId={grower.producerId}
                              /> */}
                            </Grid>
                          </Grid>
                        </CardContent>
                        <CardActions>
                          <Button
                            startIcon={
                              growerBasicInfo.producerId ===
                              grower.producerId ? (
                                <Check />
                              ) : (
                                <Save />
                              )
                            }
                            size="small"
                            color="primary"
                            variant="contained"
                            onClick={() => {
                              setGrowerBasicInfo({
                                collaborationStatus: grower.collaborationStatus,
                                phone: grower.phone,
                                email: grower.email,
                                producerId: grower.producerId,
                                lastName: grower.lastName,
                              });
                            }}
                          >
                            {growerBasicInfo.producerId === grower.producerId
                              ? "Selected"
                              : "Select"}
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
      {/* <Grid item lg={12} sm={12} style={{ marginTop: "2em" }}>
        <Grid container>
          <Grid item lg={6}>
            <Alert variant="outlined" severity="info">
              Make sure that you have completed your selection uptill here. You
              cannot revert back after clicking "Next"
            </Alert>
          </Grid>
        </Grid>
      </Grid> */}
    </Fragment>
  );
};

// Helper functions
const BasicInfo = (props) => {
  const classes = useStyles();
  const [state, dispatch] = useContext(Context);
  const [selectedYear, setSelectedYear] = useState(props.currentYear);
  // const defaultAffiliation = props.user.state.split(",").join("");
  const [selectedAffiliation, setSelectedAffiliation] = useState("NC");
  useEffect(() => {
    props.setNextBtnDisabled(false);
  }, []);

  useEffect(() => {
    setSelectedAffiliation(state.userInfo.state.split(",")[0]);
  }, [state.userInfo]);
  return (
    <Fragment>
      <Grid item lg={12} className={classes.belowHeader}>
        <Typography variant="h4">Basic Information</Typography>
      </Grid>
      <Grid item lg={6}>
        <NewSiteEnrollmentYears
          currentYear={props.currentYear}
          completeEnrollmentInfo={props.completeEnrollmentInfo}
          setCompleteEnrollmentInfo={props.setCompleteEnrollmentInfo}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
      </Grid>
      <Grid item lg={6}>
        <NewSiteEnrollmentAffiliations
          allAffiliations={props.allAffiliations}
          selectedAffiliation={selectedAffiliation}
          setSelectedAffiliation={setSelectedAffiliation}
          completeEnrollmentInfo={props.completeEnrollmentInfo}
          setCompleteEnrollmentInfo={props.setCompleteEnrollmentInfo}
          allAffs={props.allAffs}
        />
      </Grid>
    </Fragment>
  );
};

const SiteInfo = (props) => {
  const completeEnrollmentInfo = props.completeEnrollmentInfo;
  const producerLastName = props.completeEnrollmentInfo.lastName;
  const [producerId, setProducerId] = useState(
    props.completeEnrollmentInfo.producerId
  );
  const classes = useStyles();
  const [numberOfSites, setNumberOfSites] = useState(1);
  const [sites, setSites] = useState([new SiteInformation({})]);
  const marks = [
    {
      value: 0,
      label: "None",
    },
    {
      value: 1,
      label: "One",
    },
    {
      value: 2,
      label: "Two",
    },
    {
      value: 3,
      label: "Three",
    },
    {
      value: 4,
      label: "Four",
    },
    {
      value: 5,
      label: "Five",
    },
    {
      value: 6,
      label: "Six",
    },
    {
      value: 7,
      label: "Seven",
    },
    {
      value: 8,
      label: "Eight",
    },
    {
      value: 9,
      label: "Nine",
    },
    {
      value: 10,
      label: "Ten",
    },
  ];

  const fetchProducerId = async () => {
    let dataObject = {
      lastName: props.completeEnrollmentInfo.lastName,
      email: props.completeEnrollmentInfo.email,
      phone: props.completeEnrollmentInfo.phone,
      year: props.completeEnrollmentInfo.selectedYear,
      affiliation: props.completeEnrollmentInfo.selectedAffiliation,
      collaborationStatus: props.completeEnrollmentInfo.collaborationStatus,
    };
    let dataString = qs.stringify(dataObject);
    return await Axios({
      method: "POST",
      url: `${apiURL}/api/growers/add`,
      data: dataString,
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
  };

  useEffect(() => {
    function initialize() {
      if (producerId === "") {
        let producerIdsPromise = fetchProducerId();

        producerIdsPromise
          .then((resp) => {
            if (resp.data.status === "success") {
              let producerId = resp.data.producerId;
              return producerId;
            }
          })
          .then((producerId) => {
            // set states
            setProducerId(producerId);
            props.setCompleteEnrollmentInfo({
              ...completeEnrollmentInfo,
              producerId: producerId,
            });
          })
          .catch((e) => {
            console.error(e);
          });
      }

      if (completeEnrollmentInfo.sites.length === 0) {
        let sitesArr = [];
        let siteCodesPromise = fetchSiteCodes(
          numberOfSites,
          props.completeEnrollmentInfo.selectedAffiliation
        );

        siteCodesPromise
          .then((resp) => {
            let codes = resp.data.data;
            for (let i = 0; i < numberOfSites; i++) {
              sitesArr.push(
                new SiteInformation({
                  code: codes[i],
                  year: props.completeEnrollmentInfo.selectedYear || "",
                  affiliation:
                    props.completeEnrollmentInfo.selectedAffiliation || "",
                  county: "",
                  latitude: null,
                  longitude: null,
                  address: "",
                  notes: "",
                  producer_id: producerId || "",
                  additional_contact: "",
                  irrigation: false,
                })
              );
            }
            setSites(sitesArr);
            props.setCompleteEnrollmentInfo({
              ...completeEnrollmentInfo,
              sites: sitesArr,
            });
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        console.log("site length", completeEnrollmentInfo.sites.length);
      }
    }

    initialize();
  }, []);

  useEffect(() => {
    let sitesArr = [];
    let siteCodesPromise = fetchSiteCodes(
      numberOfSites,
      props.completeEnrollmentInfo.selectedAffiliation
    );

    siteCodesPromise
      .then((resp) => {
        let codes = resp.data.data;
        for (let i = 0; i < numberOfSites; i++) {
          sitesArr.push(
            new SiteInformation({
              code: codes[i],
              year: props.completeEnrollmentInfo.selectedYear || "",
              affiliation:
                props.completeEnrollmentInfo.selectedAffiliation || "",
              county: "",
              latitude: null,
              longitude: null,
              address: "",
              notes: "",
              producer_id: producerId || "",
              additional_contact: "",
              irrigation: false,
            })
          );
        }
        setSites(sitesArr);
        props.setCompleteEnrollmentInfo({
          ...completeEnrollmentInfo,
          sites: sitesArr,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, [numberOfSites]);

  // useEffect(() => {

  // }, [sites]);

  return (
    <Fragment>
      <Grid
        item
        lg={12}
        lg={12}
        sm={12}
        xs={12}
        className={classes.belowHeader}
      >
        <Typography variant="h4">
          Site Information for {producerLastName}[{producerId}]
        </Typography>
      </Grid>
      <Grid item lg={12} sm={12} xs={12}>
        <Typography gutterBottom>Number of sites</Typography>
        <Slider
          min={1}
          max={10}
          marks={marks}
          valueLabelDisplay="auto"
          defaultValue={1}
          value={numberOfSites}
          onChange={(event, newVal) => {
            setNumberOfSites(newVal);
          }}
        />
      </Grid>
      <Grid container spacing={6} style={{ paddingTop: "50px" }}>
        {sites.length > 0 && sites[0].code !== ""
          ? sites.map((site, index) => (
              <Grid item lg={4} xs={12} md={6} key={`siteGrid-${index}`}>
                <div
                  style={{
                    padding: "1em",
                    // boxShadow:
                    // "1px 1px 0px #999,2px 2px 0px #999,3px 3px 0px #999,4px 4px 0px #999,5px 5px 0px #999,6px 6px 0px #999",
                    borderRadius: "10px",
                    boxShadow:
                      "inset 0 3px 6px rgba(0,0,0,0.16), 0 4px 6px rgba(0,0,0,0.45)",
                  }}
                >
                  <Typography
                    variant="h3"
                    gutterBottom
                    align="left"
                    style={{ fontWeight: "bold" }}
                  >
                    {site.code}
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item sm={4}>
                      <Typography
                        variant="body1"
                        style={{ fontWeight: "bold" }}
                      >
                        Year
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <Typography variant="body2">{site.year}</Typography>
                    </Grid>
                    <Grid item sm={4}>
                      <Typography
                        variant="body1"
                        style={{ fontWeight: "bold" }}
                      >
                        Affiliation
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <Typography variant="body2">
                        {site.affiliation}
                      </Typography>
                    </Grid>
                    <Grid item sm={12}>
                      <Divider />
                    </Grid>

                    {/* Dynamic Variables */}
                    <Grid item sm={4}>
                      <Typography
                        variant="body1"
                        style={{ fontWeight: "bold" }}
                      >
                        Irrigation
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <Switch
                        color="primary"
                        checked={site.irrigation}
                        onChange={(event) => {
                          const newObj = sites.map((obj) =>
                            obj.code === site.code
                              ? { ...obj, irrigation: event.target.checked }
                              : obj
                          );
                          const newGlobalObj = props.completeEnrollmentInfo.sites.map(
                            (obj) =>
                              obj.code === site.code
                                ? { ...obj, irrigation: event.target.checked }
                                : obj
                          );
                          props.setCompleteEnrollmentInfo({
                            ...completeEnrollmentInfo,
                            sites: newGlobalObj,
                          });
                          setSites(newObj);
                        }}
                      />
                    </Grid>
                    <Grid item sm={4}>
                      <Typography
                        variant="body1"
                        style={{ fontWeight: "bold" }}
                      >
                        Address
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <TextField
                        fullWidth
                        value={site.address}
                        onChange={(event) => {
                          fetchSuggestedAddresses(event.target.value);
                          const newObj = sites.map((obj) =>
                            obj.code === site.code
                              ? { ...obj, address: event.target.value }
                              : obj
                          );
                          const newGlobalObj = props.completeEnrollmentInfo.sites.map(
                            (obj) =>
                              obj.code === site.code
                                ? { ...obj, address: event.target.value }
                                : obj
                          );
                          props.setCompleteEnrollmentInfo({
                            ...completeEnrollmentInfo,
                            sites: newGlobalObj,
                          });
                          setSites(newObj);
                        }}
                      />
                    </Grid>

                    <Grid item sm={4}>
                      <Typography
                        variant="body1"
                        style={{ fontWeight: "bold" }}
                      >
                        County
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <TextField
                        fullWidth
                        value={site.county}
                        onChange={(event) => {
                          const newObj = sites.map((obj) =>
                            obj.code === site.code
                              ? { ...obj, county: event.target.value }
                              : obj
                          );
                          const newGlobalObj = props.completeEnrollmentInfo.sites.map(
                            (obj) =>
                              obj.code === site.code
                                ? { ...obj, county: event.target.value }
                                : obj
                          );
                          props.setCompleteEnrollmentInfo({
                            ...completeEnrollmentInfo,
                            sites: newGlobalObj,
                          });
                          setSites(newObj);
                        }}
                      />
                    </Grid>
                    <Grid item sm={4}>
                      <Typography
                        variant="body1"
                        style={{ fontWeight: "bold" }}
                      >
                        Latitude
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <Input
                        fullWidth
                        startAdornment={
                          <InputAdornment>
                            <IconButton
                              onClick={() => {
                                // window.navigator.geolocation.getCurrentPosition()
                              }}
                            >
                              <GpsFixed />
                            </IconButton>
                          </InputAdornment>
                        }
                        value={site.latitide}
                        onChange={(event) => {
                          const newObj = sites.map((obj) =>
                            obj.code === site.code
                              ? { ...obj, latitide: event.target.value }
                              : obj
                          );
                          const newGlobalObj = props.completeEnrollmentInfo.sites.map(
                            (obj) =>
                              obj.code === site.code
                                ? { ...obj, latitide: event.target.value }
                                : obj
                          );
                          props.setCompleteEnrollmentInfo({
                            ...completeEnrollmentInfo,
                            sites: newGlobalObj,
                          });
                          setSites(newObj);
                        }}
                      />
                    </Grid>
                    <Grid item sm={4}>
                      <Typography
                        variant="body1"
                        style={{ fontWeight: "bold" }}
                      >
                        Longitude
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <Input
                        fullWidth
                        startAdornment={
                          <InputAdornment>
                            <IconButton>
                              <GpsFixed />
                            </IconButton>
                          </InputAdornment>
                        }
                        value={site.longitude}
                        onChange={(event) => {
                          const newObj = sites.map((obj) =>
                            obj.code === site.code
                              ? { ...obj, longitude: event.target.value }
                              : obj
                          );
                          const newGlobalObj = props.completeEnrollmentInfo.sites.map(
                            (obj) =>
                              obj.code === site.code
                                ? { ...obj, longitude: event.target.value }
                                : obj
                          );
                          props.setCompleteEnrollmentInfo({
                            ...completeEnrollmentInfo,
                            sites: newGlobalObj,
                          });
                          setSites(newObj);
                        }}
                      />
                    </Grid>
                    <Grid item sm={4}>
                      <Typography
                        variant="body1"
                        style={{ fontWeight: "bold" }}
                      >
                        Additional Contact
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <TextField
                        fullWidth
                        multiline={true}
                        value={site.additionalContact}
                        onChange={(event) => {
                          const newObj = sites.map((obj) =>
                            obj.code === site.code
                              ? {
                                  ...obj,
                                  additionalContact: event.target.value,
                                }
                              : obj
                          );
                          const newGlobalObj = props.completeEnrollmentInfo.sites.map(
                            (obj) =>
                              obj.code === site.code
                                ? {
                                    ...obj,
                                    additionalContact: event.target.value,
                                  }
                                : obj
                          );
                          props.setCompleteEnrollmentInfo({
                            ...completeEnrollmentInfo,
                            sites: newGlobalObj,
                          });
                          setSites(newObj);
                        }}
                      />
                    </Grid>
                    <Grid item sm={4}>
                      <Typography
                        variant="body1"
                        style={{ fontWeight: "bold" }}
                      >
                        Notes
                      </Typography>
                    </Grid>
                    <Grid item sm={8}>
                      <TextField
                        fullWidth
                        multiline={true}
                        value={site.notes}
                        onChange={(event) => {
                          const newObj = sites.map((obj) =>
                            obj.code === site.code
                              ? { ...obj, notes: event.target.value }
                              : obj
                          );
                          const newGlobalObj = props.completeEnrollmentInfo.sites.map(
                            (obj) =>
                              obj.code === site.code
                                ? { ...obj, notes: event.target.value }
                                : obj
                          );
                          props.setCompleteEnrollmentInfo({
                            ...completeEnrollmentInfo,
                            sites: newGlobalObj,
                          });
                          setSites(newObj);
                        }}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            ))
          : ""}
      </Grid>
    </Fragment>
  );
};

const ConfirmationStep = (props) => {
  const classes = useStyles();
  const [saving, setSaving] = useState(false);
  const [confirmation, setConfirmation] = useState(true);
  const completeEnrollmentInfo = props.completeEnrollmentInfo;
  const [times, setTimes] = useState(0);
  useEffect(() => {
    props.setNextBtnDisabled(true);
    renderTableFromJSON(completeEnrollmentInfo.sites);
  }, []);

  const finalConfirm = () => {
    // save sites
    /* /api/sites/add */
    setSaving(true);
    setConfirmation(false);

    completeEnrollmentInfo.sites.forEach((site, index) => {
      let dataObject = {
        producerId: props.completeEnrollmentInfo.producerId,
        year: props.completeEnrollmentInfo.selectedYear,
        code: site.code,
        affiliation: props.completeEnrollmentInfo.selectedAffiliation,
        irrigation: site.irrigation,
        county: site.county,
        address: site.address,
        additionalContact: site.additionalContact,
        notes: site.notes,
        latitude: site.latitide,
        longitude: site.longitude,
      };
      let dataString = qs.stringify(dataObject);
      Axios({
        method: "POST",
        url: `${apiURL}/api/sites/add`,
        data: dataString,
        auth: {
          username: apiUsername,
          password: apiPassword,
        },
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      })
        .then(() => {
          setTimes(index);
          if (index === 0) {
            setSaving(false);
            setConfirmation(false);
            props.setNextBtnDisabled(false);
          }
        })
        .catch((e) => {
          setTimes(0);
          console.error(e);
        });
    });

    // set saving as true
    // done
    // set confirmation as false
    // reset completeEnrollmentInfo object
    // enable nextBtn
  };

  useEffect(() => {
    console.log("times", times);
    if (times !== 0) {
      if (times === completeEnrollmentInfo.sites.length - 1) {
        // all ajax completed
        setSaving(false);
        setConfirmation(false);
        props.setNextBtnDisabled(false);
      }
    } else {
    }
  }, [times]);

  const renderTableFromJSON = (sites) => {
    var col = [];
    for (var i = 0; i < sites.length; i++) {
      for (var key in sites[i]) {
        if (col.indexOf(key) === -1) {
          col.push(key);
        }
      }
    }

    var table = document.createElement("table");
    table.style.width = "100%";
    table.border = "1";
    var tr = table.insertRow(-1);

    for (var i = 0; i < col.length; i++) {
      var th = document.createElement("th"); // TABLE HEADER.
      th.innerHTML = col[i];
      tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < sites.length; i++) {
      tr = table.insertRow(-1);

      for (var j = 0; j < col.length; j++) {
        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = sites[i][col[j]];
      }
    }

    var divContainer = document.getElementById("showTableData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
  };

  return (
    <Fragment>
      <Grid item lg={12} xs={12}>
        <Typography variant="h4" gutterBottom>
          Confirmation
        </Typography>
      </Grid>
      {saving ? (
        <Grid container style={{ paddingTop: "2em" }} spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body1">
              Please wait while site Information is being saved..
            </Typography>
            <CustomLoader width="100px" height="100px" />
          </Grid>
          <Grid item xs={6}></Grid>
        </Grid>
      ) : confirmation ? (
        <Grid
          container
          spacing={3}
          style={{ paddingTop: "2em" }}
          justify="center"
        >
          <Grid item lg={12}>
            <Typography variant="body1">
              Grower information has already been saved into the database.
              Please confirm site information.
            </Typography>
          </Grid>
          <Grid item lg={12}>
            <Typography variant="body2">
              You can go still go back and modify or add any site
            </Typography>
          </Grid>
          <Grid container spacing={3}>
            <Grid item lg={4}>
              <Typography variant="h6" gutterBottom>
                Grower
              </Typography>
              <Grid container spacing={3}>
                <Grid item lg={6} style={{ fontWeight: "bold" }}>
                  Producer ID
                </Grid>
                <Grid item lg={6}>
                  {completeEnrollmentInfo.producerId}
                </Grid>
                <Grid item lg={6} style={{ fontWeight: "bold" }}>
                  Year
                </Grid>
                <Grid item lg={6}>
                  {completeEnrollmentInfo.selectedYear}
                </Grid>
                <Grid item lg={6} style={{ fontWeight: "bold" }}>
                  Affiliation
                </Grid>
                <Grid item lg={6}>
                  {completeEnrollmentInfo.selectedAffiliation}
                </Grid>
                <Grid item lg={6} style={{ fontWeight: "bold" }}>
                  Last Name
                </Grid>
                <Grid item lg={6}>
                  {completeEnrollmentInfo.lastName}
                </Grid>

                <Grid item lg={6} style={{ fontWeight: "bold" }}>
                  Collaboration Status
                </Grid>
                <Grid item lg={6}>
                  {completeEnrollmentInfo.collaborationStatus}
                </Grid>
                <Grid item lg={6} style={{ fontWeight: "bold" }}>
                  Email
                </Grid>
                <Grid item lg={6}>
                  {completeEnrollmentInfo.email || "No Email"}
                </Grid>
                <Grid item lg={6} style={{ fontWeight: "bold" }}>
                  Phone
                </Grid>
                <Grid item lg={6}>
                  {completeEnrollmentInfo.phone || "No Phone"}
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={8}>
              <Typography variant="h6">
                Site{completeEnrollmentInfo.sites.length > 1 ? "s" : ""}
              </Typography>
              <Grid container spacing={3}>
                <Grid item lg={12}>
                  <div id="showTableData"></div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item lg={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={finalConfirm}
              >
                Confirm
              </Button>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          spacing={3}
          style={{ paddingTop: "2em" }}
          justify="center"
        >
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              All information has been successfully saved!
            </Typography>
            <Typography variant="subtitle2">
              You may now exit or go back to add more sites for the producer
            </Typography>
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      )}
    </Fragment>
  );
};

class ExistingGrower {
  collaborationStatus = "";
  producerId = "";
  lastName = "";
  email = "";
  phone = "";

  constructor(collaborationStatus, producerId, lastName, email, phone) {
    this.collaborationStatus = collaborationStatus;
    this.producerId = producerId;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
  }
}

class SiteInformation {
  code = "";
  year = "";
  affiliation = "";
  county = "";
  longitude = -79.2777;
  latitide = 34.5356;
  notes = "";
  additionalContact = "";
  producerId = "";
  address = "";
  irrigation = false;

  constructor(obj) {
    this.code = obj.code || "";
    this.year = obj.year || "";
    this.affiliation = obj.affiliation || "";
    this.county = obj.county || "";
    this.latitide = obj.latitude || "";
    this.longitude = obj.longitude || "";
    this.notes = obj.notes || "";
    this.additionalContact = obj.additional_contact || "";
    this.producerId = obj.producer_id || "";
    this.address = obj.address || "";
    this.irrigation = obj.irrigation || false;
  }
}

const fetchSiteCodes = async (size, affiliation) => {
  // TODO: check university or partner
  return await Axios({
    url: `${apiURL}/api/sites/codes/unused/${affiliation}/${size}`,
    method: "GET",
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  });
};
const fetchSiteCodesForProducer = async (producerId) => {
  return await Axios({
    url: `${apiURL}/api/retrieve/site/codes/by/producer/${producerId}`,
    method: "get",
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  });
};

const fetchSuggestedAddresses = async (query) => {
  // This is a not a client side code. This would need to go to the backend or find alternative!
  // https://material-ui.com/components/autocomplete/#google-maps-place
  if (query.length > 3) {
    const key = googleApiKey;
    let params = `key=${key}&input=${query}`;
    let res = await Axios.get(
      `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?${params}`
    );
    console.log(res.data);
  }
};

export default NewSiteEnrollmentModal;
