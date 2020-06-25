import * as React from "react";
import {
  Grid,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Context } from "../Store/Store";
import NewSiteEnrollmentModal from "./NewSiteEnrollmentModal";
import Axios from "axios";
import { apiURL, apiUsername, apiPassword } from "../utils/api_secret";
import { Skeleton } from "@material-ui/lab";
import MapModal from "./MapModal";
import { EditAttributesSharp, Edit } from "@material-ui/icons";
import EditSiteDataModal from "./EditSiteDataModal";
import { bannedRoles } from "../utils/constants";
import { BannedRoleMessage } from "../utils/CustomComponents";

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const SiteEnrollment = (props) => {
  const [state, dispatch] = React.useContext(Context);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [defaultYear, setDefaultYear] = React.useState(2020);
  const [existingGrowerData, setExistingGrowerData] = React.useState([
    {
      producer_id: "",
      last_name: "",
      email: null,
      phone: null,
      cid: "",
      code: "",
      year: "",
      affiliation: "",
      county: null,
      longitude: null,
      latitude: null,
      notes: "",
      additional_contact: null,
      address: null,
    },
  ]);

  const [totalSitesEnrolled, setTotalSitesEnrolled] = React.useState(0);
  const [stateSitesEnrolled, setStateSitesEnrolled] = React.useState(0);
  const [showStateSpecificSites, setShowStateSpecificSites] = React.useState(
    false
  );

  const [ajaxLoading, setAjaxLoading] = React.useState(false);

  const [mapModalOpen, setMapModalOpen] = React.useState(false);

  const [editModalOpen, setEditModalOpen] = React.useState(false);

  const [mapModalGrowerData, setMapModalGrowerData] = React.useState({
    lat: 35.78598,
    lng: -78.67254,
    lastName: "",
    producerId: "",
    code: "",
    new: false,
  });

  const [bannedRolesCheckMessage, setBannedRolesCheckMessage] = React.useState(
    "Checking your permissions.."
  );
  const [growerSpecificInfo, setGrowerSpecificInfo] = React.useState([]);
  const [showContent, setShowContent] = React.useState(false);

  const handleEnrollNewSiteClick = () => {
    setModalOpen(!modalOpen);
  };

  const fetchExistingGrowers = async () => {
    return await Axios({
      url: `${apiURL}/api/retrieve/grower/all`,
      method: "get",
      auth: {
        username: apiUsername,
        password: apiPassword,
      },
    });
  };

  const setExistingGrowers = () => {
    setAjaxLoading(true);
    let existingGrowersPromise = fetchExistingGrowers();

    existingGrowersPromise
      .then((response) => {
        let data = response.data.data;
        setExistingGrowerData(data);
      })
      .then(() => {
        setAjaxLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleMapModalClose = () => {
    setMapModalOpen(!mapModalOpen);
  };
  const handleEditModalClose = () => {
    setEditModalOpen(!editModalOpen);
  };
  const renderLatLngs = (lat, lng, lastName, producerId, code) => {
    if (lat === null || lng === null)
      return (
        <Grid container>
          {/* <Grid item lg={12}>
        {lat}, {lng}
      </Grid> */}
          <Grid item lg={12}>
            <Button
              variant="contained"
              onClick={() => {
                setMapModalGrowerData({
                  lat: 35.78598,
                  lng: -78.67254,
                  lastName: lastName,
                  producerId: producerId,
                  code: code,
                  new: true,
                });
                setMapModalOpen(true);
              }}
            >
              Add Location
            </Button>
          </Grid>
        </Grid>
      );
    else
      return (
        <Grid container>
          {/* <Grid item lg={12}>
            {lat}, {lng}
          </Grid> */}
          <Grid item lg={12}>
            <Button
              variant="contained"
              onClick={() => {
                setMapModalGrowerData({
                  lat: lat,
                  lng: lng,
                  lastName: lastName,
                  producerId: producerId,
                  code: code,
                  new: false,
                });
                setMapModalOpen(true);
              }}
            >
              Show Map
            </Button>
          </Grid>
        </Grid>
      );
  };
  React.useEffect(() => {
    // console.log(getCurrentYear());
    setDefaultYear(getCurrentYear());
    // setExistingGrowers();
  }, []);

  React.useEffect(() => {
    if (state.userInfo.state) {
      if (state.userInfo.role) {
        if (bannedRoles.includes(state.userRole)) {
          setShowContent(false);
          setBannedRolesCheckMessage(
            <BannedRoleMessage title="Site Enrollment" />
          );
        } else {
          setShowContent(true);
          if (state.userInfo.state === "all") {
            setShowStateSpecificSites(false);
          } else {
            setShowStateSpecificSites(true);
          }
          getStats(state.userInfo.state).then((data) => {
            setTotalSitesEnrolled(data.total);
            setStateSitesEnrolled(data.state);
          });
        }
      }
    }
  }, [state.userInfo, modalOpen]);

  return showContent ? (
    <div>
      <Grid container spacing={4}>
        <Grid item md={12} lg={12} xs={12}>
          <Button onClick={handleEnrollNewSiteClick} variant="contained">
            Enroll New Site
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            {showStateSpecificSites
              ? `${stateSitesEnrolled} sites enrolled in your team: ${state.userInfo.state}`
              : ""}
          </Typography>
          <Typography variant="body1">
            {totalSitesEnrolled}&nbsp; sites enrolled across all teams.
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <NewSiteEnrollmentModal
          open={modalOpen}
          handleClose={handleEnrollNewSiteClick}
          defaultYear={defaultYear}
          user={state.userInfo}
        />
      </Grid>
    </div>
  ) : (
    <div>{bannedRolesCheckMessage}</div>
  );
};

export default SiteEnrollment;

const fetchStats = async (state) => {
  return Axios({
    url: `${apiURL}/api/total/sites/${state}`,
    headers: {
      "Content-Type": "application/json",
    },
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  });
};

const getStats = async (state) => {
  let records = await fetchStats(state);

  let data = records.data.data;

  return data;
};
