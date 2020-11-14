import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  Icon,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { CancelOutlined, Check, Save } from "@material-ui/icons";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import { apiPassword, apiURL, apiUsername } from "../utils/api_secret";
import { fetchGrowerByLastName, ucFirst } from "../utils/constants";
import { NewSiteInfo } from "./NewSiteInfo";
// import Input from "react-phone-number-input/input";
import InputMask from "react-input-mask";
import CustomPhoneInput from "./components/PhoneInput";
// import "react-phone-number-input/style.css";
const qs = require("qs");

const GrowerInformation = ({ enrollmentData, setEnrollmentData }) => {
  const [growerType, setGrowerType] = useState("existing");
  const [growerLastNameSearch, setGrowerLastNameSearch] = useState("");
  const [allGrowers, setAllGrowers] = useState([]);
  const [siteCodes, setSiteCodes] = useState([]);
  const [showSitesInfo, setShowSitesInfo] = useState(false);
  const [savingProducerId, setSavingProducerId] = useState(false);

  const handleNewGrowerInfo = () => {
    if (window.confirm("Are you sure you want to save this grower?")) {
      if (
        Object.keys(enrollmentData.growerInfo).length === 0 ||
        enrollmentData.growerInfo.lastName === ""
      ) {
        alert("Please enter grower information: Last Name");
      } else {
        setSavingProducerId(true);
        let newGrowerPromise = saveNewGrowerAndFetchProducerId(enrollmentData);
        newGrowerPromise.then((resp) => {
          let newProducerId = resp.data.producerId;
          setEnrollmentData({
            ...enrollmentData,
            growerInfo: {
              ...enrollmentData.growerInfo,
              producerId: newProducerId,
            },
          });
          setSavingProducerId(false);
        });
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    // async function waitForSiteCodes(producerId) {
    //   let siteCodesPromise = await fetchSiteCodesForProducer(producerId);

    //   const sites = siteCodesPromise.data.data.map((data) => data.code);

    //   return { producerId: producerId, siteCodes: sites };
    // }

    if (growerType === "existing" && growerLastNameSearch !== "") {
      let lastNamePromise = fetchGrowerByLastName(growerLastNameSearch);
      lastNamePromise
        .then((resp) => {
          let data = resp.data.data;
          if (data.length > 0) {
            setAllGrowers(data);
          } else {
            setAllGrowers([]);
            setSiteCodes([]);
          }
        })
        .then(() => {
          //   console.log(allGrowers.length);
          //   let allSiteData = [];
          //   allGrowers.forEach((grower) => {
          //     let sitesData = waitForSiteCodes(grower.producer_id);
          //     sitesData.then((resp) => {
          //       allSiteData.push(resp);
          //     });
          //   });
          //   console.log(allSiteData);
        });
    }
    setEnrollmentData({
      ...enrollmentData,
      growerInfo: {
        collaborationStatus: "University",
        producerId: "",
        phone: "",
        producerId: "",
        lastName: "",
        email: "",
      },
    });
  }, [growerLastNameSearch, growerType]);
  const [maskedTel, setMaskedTel] = useState("");
  return (
    <>
      <Grid item sm={12}>
        <Typography variant="h4">Grower Information</Typography>
      </Grid>

      <Grid item sm={12}>
        <Grid container alignContent="center" justify="center" spacing={2}>
          <Grid item>
            <FormControlLabel
              value="existing"
              checked={growerType === "existing" ? true : false}
              onChange={() => setGrowerType("existing")}
              control={<Radio color="primary" />}
              label="Use Existing Grower"
              labelPlacement="top"
            />
            {/* <Button variant="contained">Use Existing Grower</Button> */}
          </Grid>
          <Grid item>
            <FormControlLabel
              value="new"
              onChange={() => setGrowerType("new")}
              checked={growerType === "new" ? true : false}
              control={<Radio color="primary" />}
              label="Add New Grower"
              labelPlacement="top"
            />
            {/* <Button variant="contained">Add New Grower</Button> */}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {growerType === "existing" ? (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h5">Existing Grower</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                value={growerLastNameSearch}
                onChange={(e) => setGrowerLastNameSearch(e.target.value)}
                fullWidth
                label="Search Growers By Last Name"
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <ExistingGrowersGrid
                  allGrowers={allGrowers}
                  growerLastName={growerLastNameSearch}
                  enrollmentData={enrollmentData}
                  setEnrollmentData={setEnrollmentData}
                />
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h5">New Grower</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Name"
                value={enrollmentData.growerInfo.lastName}
                onChange={(e) =>
                  setEnrollmentData({
                    ...enrollmentData,
                    growerInfo: {
                      ...enrollmentData.growerInfo,
                      lastName: e.target.value,
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={enrollmentData.growerInfo.email}
                onChange={(e) =>
                  setEnrollmentData({
                    ...enrollmentData,
                    growerInfo: {
                      ...enrollmentData.growerInfo,
                      email: e.target.value,
                    },
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              {/* <TextField
                fullWidth
                label="Phone"
                value={enrollmentData.growerInfo.phone}
                onChange={(e) =>
                  setEnrollmentData({
                    ...enrollmentData,
                    growerInfo: {
                      ...enrollmentData.growerInfo,
                      phone: e.target.value,
                    },
                  })
                }
              /> */}
              {/* a.split("(").join("").split(")").join("").split(" ").join("").split("-").join("") */}
              <InputMask
                mask="(999) 999-9999"
                value={enrollmentData.growerInfo.phone}
                disabled={false}
                onChange={(e) =>
                  setEnrollmentData({
                    ...enrollmentData,
                    growerInfo: {
                      ...enrollmentData.growerInfo,
                      phone: e.target.value,
                    },
                  })
                }
              >
                {() => <TextField fullWidth label="Phone number" />}
              </InputMask>
              {/* <CustomPhoneInput
                placeholder="Enter phone number"
                value={enrollmentData.growerInfo.phone}
                onChange={(e) => {
                  setEnrollmentData({
                    ...enrollmentData,
                    growerInfo: {
                      ...enrollmentData.growerInfo,
                      phone: e.target.value,
                    },
                  });
                }}
              /> */}
              {/* <Input
                country="US"
                international={false}
                inputComponent={CustomPhoneInput}
                placeholder="Enter phone number"
              /> */}
            </Grid>
            <Grid item xs={12}>
              <Select
                fullWidth
                value={
                  Object.keys(enrollmentData.growerInfo).length === 0 ||
                  enrollmentData.growerInfo.collaborationStatus === ""
                    ? "University"
                    : enrollmentData.growerInfo.collaborationStatus
                }
                onChange={(e) =>
                  setEnrollmentData({
                    ...enrollmentData,
                    growerInfo: {
                      ...enrollmentData.growerInfo,
                      collaborationStatus: e.target.value,
                    },
                  })
                }
                inputProps={{
                  name: "collab-status",
                  id: "enroll-collab-status",
                }}
              >
                <MenuItem value="University">University</MenuItem>
                <MenuItem value="Partner">Partner</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Button
                size="small"
                variant="outlined"
                onClick={handleNewGrowerInfo}
              >
                <Save fontSize="small" />
                &nbsp;Save
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        {/* <SiteSelection /> */}
        <Grid container justify="center" alignItems="center">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setShowSitesInfo(true);
                window.scrollTo(0, document.body.scrollHeight);
              }}
              disabled={
                enrollmentData.growerInfo.producerId === "" ||
                Object.keys(enrollmentData.growerInfo).length === 0 ||
                showSitesInfo
                  ? true
                  : false
              }
            >
              {savingProducerId ? "Saving New Grower" : "Next Step"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {showSitesInfo && enrollmentData.growerInfo.producerId ? (
        <Grid item xs={12}>
          <NewSiteInfo
            enrollmentData={enrollmentData}
            setEnrollmentData={setEnrollmentData}
          />
        </Grid>
      ) : (
        ""
      )}
    </>
  );
};

export default GrowerInformation;

const ExistingGrowersGrid = ({
  allGrowers = [],
  growerLastName = "",
  enrollmentData = {},
  setEnrollmentData = () => {},
}) => {
  const [siteCodesForAProducer, setSiteCodesForAProducer] = useState({});
  const fetchSiteCodesFor = (producerId) => {
    let siteCodesPromise = fetchSiteCodesForProducer(producerId);

    siteCodesPromise.then((resp) => {
      let data = resp.data.data;
      //   console.log(data);
      let codes = data.map((sites) => {
        return sites.code;
      });
      setSiteCodesForAProducer({ producerId: producerId, sites: codes });
    });
  };

  return allGrowers.length > 0 ? (
    allGrowers.map((grower, index) => (
      <Grid item key={`existing-grower-${index}`} sm={6} md={3}>
        <Card>
          <CardHeader
            avatar={<Avatar>{grower.last_name.charAt(0).toUpperCase()}</Avatar>}
            title={ucFirst(grower.last_name)}
          />

          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">Producer ID</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{grower.producer_id}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Email</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{grower.email}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Phone</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{grower.phone}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => fetchSiteCodesFor(grower.producer_id)}
                >
                  Show Sites
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" noWrap>
                  {siteCodesForAProducer.producerId === grower.producer_id
                    ? siteCodesForAProducer.sites.length > 0
                      ? siteCodesForAProducer.sites.toString()
                      : "No Sites"
                    : ""}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color={
                enrollmentData.growerInfo.producerId === grower.producer_id
                  ? "primary"
                  : "default"
              }
              variant="contained"
              onClick={() => {
                setEnrollmentData({
                  ...enrollmentData,
                  growerInfo: {
                    producerId: grower.producer_id,
                    collaborationStatus: grower.collaboration_status
                      ? grower.collaboration_status
                      : "University",
                    phone: grower.phone,
                    lastName: grower.last_name,
                    email: grower.email,
                  },
                });
              }}
              startIcon={
                enrollmentData.growerInfo.producerId === grower.producer_id ? (
                  <Check />
                ) : (
                  <Save />
                )
              }
            >
              {enrollmentData.growerInfo.producerId === grower.producer_id
                ? "Selected"
                : "Select"}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ))
  ) : growerLastName.length === 0 ? (
    ""
  ) : (
    <Typography variant="body1">Grower Not Found</Typography>
  );
};

const SiteSelection = ({ growerInfo, setGrowerInfo }) => {
  return (
    <>
      <Grid container></Grid>
    </>
  );
};

const getSiteCodesForProducer = async (producerId) => {
  let fetchSitesPromise = await fetchSiteCodesForProducer(producerId);
  let codes = [];
  let data = fetchSitesPromise.data.data;
  codes = data.map((r, i) => {
    return r.code;
  });

  let strId = `siteCodesFor-${producerId}`;

  if (codes.length === 0) {
    document.getElementById(strId).textContent = "No Sites";
  } else {
    document.getElementById(strId).textContent = [codes.toString()];
  }
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

const saveNewGrowerAndFetchProducerId = async (enrollmentData = {}) => {
  let dataObject = {
    lastName: enrollmentData.growerInfo.lastName,
    email: enrollmentData.growerInfo.email,
    phone: enrollmentData.growerInfo.phone
      .split("(")
      .join("")
      .split(")")
      .join("")
      .split(" ")
      .join("")
      .split("-")
      .join(""),
    year: enrollmentData.year,
    affiliation: enrollmentData.affiliation,
    collaborationStatus: enrollmentData.growerInfo.collaborationStatus,
  };
  let dataString = qs.stringify(dataObject);
  return await Axios.post(`${apiURL}/api/growers/add`, dataString, {
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });
};
