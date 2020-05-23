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
} from "@material-ui/core";
import { Context } from "../Store/Store";
import NewSiteEnrollmentModal from "./NewSiteEnrollmentModal";
import Axios from "axios";
import { apiURL, apiUsername, apiPassword } from "../utils/api_secret";
import { Skeleton } from "@material-ui/lab";
import MapModal from "./MapModal";
import { EditAttributesSharp, Edit } from "@material-ui/icons";
import EditSiteDataModal from "./EditSiteDataModal";

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

  const [growerSpecificInfo, setGrowerSpecificInfo] = React.useState([]);

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
    setExistingGrowers();
  }, []);

  return (
    <div>
      <Grid container>
        <Grid item md={4}>
          <Button onClick={handleEnrollNewSiteClick} variant="contained">
            Enroll New Site
          </Button>
        </Grid>
      </Grid>
      <Grid container>
        <NewSiteEnrollmentModal
          open={modalOpen}
          handleClose={handleEnrollNewSiteClick}
          defaultYear={defaultYear}
        />
      </Grid>

      <Grid container style={{ marginTop: "2em" }}>
        {ajaxLoading ? (
          "Fetching Data..."
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Actions</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Affiliation</TableCell>
                  <TableCell>Producer ID</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>

                  <TableCell>Address</TableCell>
                  <TableCell style={{ minWidth: "200px" }}>Lat-Long</TableCell>
                  <TableCell>County</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Additional Contact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {existingGrowerData.map((grower, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Grid container>
                        <Grid item lg={12}>
                          <IconButton
                            onClick={() => {
                              setGrowerSpecificInfo(grower);
                              setEditModalOpen(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </TableCell>
                    <TableCell>{grower.code}</TableCell>
                    <TableCell>{grower.affiliation}</TableCell>
                    <TableCell>{grower.producer_id}</TableCell>
                    <TableCell>{grower.last_name}</TableCell>
                    <TableCell>{grower.email}</TableCell>
                    <TableCell>{grower.phone}</TableCell>

                    <TableCell>{grower.address}</TableCell>
                    <TableCell>
                      {renderLatLngs(
                        grower.latitude,
                        grower.longitude,
                        grower.last_name,
                        grower.producer_id,
                        grower.code
                      )}
                    </TableCell>
                    <TableCell>{grower.county}</TableCell>
                    <TableCell>{grower.notes}</TableCell>
                    <TableCell>{grower.additional_contact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>
      <MapModal
        mapModalOpen={mapModalOpen}
        handleMapModalClose={handleMapModalClose}
        growerInfo={mapModalGrowerData}
        setMapModalGrowerData={setMapModalGrowerData}
      />
      <EditSiteDataModal
        editModalOpen={editModalOpen}
        handleEditModalClose={handleEditModalClose}
        growerSpecificInfo={growerSpecificInfo}
        setGrowerSpecificInfo={setGrowerSpecificInfo}
      />
    </div>
  );
};

export default SiteEnrollment;
