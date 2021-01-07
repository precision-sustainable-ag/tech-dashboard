//Dependency Imports
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  TextField,
  Grid,
  TextareaAutosize,
  InputLabel,
} from "@material-ui/core";

// import { Map, TileLayer, Marker, Popup } from "react-leaflet";
// // import Loading from "react-loading";
// // import Skeleton from "@material-ui/lab/Skeleton";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//   iconUrl: require("leaflet/dist/images/marker-icon.png"),
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
// });

const EditSiteDataModal = (props) => {
  let grower = props.growerSpecificInfo;

  //   const saveValues = () => {
  //       props.setGrowerSpecificInfo({
  // ...grower,
  // email: grower.email,

  //       });
  //   }
  return (
    <Dialog
      fullWidth={true}
      maxWidth={"sm"}
      open={props.editModalOpen}
      onClose={props.handleEditModalClose}
      aria-labelledby="map-dialog-title"
    >
      <DialogTitle id="map-dialog-title">
        Edit Data for {grower.last_name} ({grower.code})
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item sm={6}>
            <FormControl>
              <TextField
                value={grower.code}
                label="Site Code"
                disabled={true}
              />
              <br />
              <TextField
                value={grower.affiliation}
                label="Affiliation"
                disabled={true}
              />
              <br />
              <TextField
                value={grower.producer_id}
                label="Producer ID"
                disabled={true}
              />
              <br />
              <TextField
                value={grower.last_name}
                label="Last Name"
                disabled={true}
              />
              <br />
              <TextField
                value={grower.email || ""}
                label="Email"
                disabled={false}
              />
            </FormControl>
          </Grid>
          <Grid item sm={6}>
            <TextField value={grower.phone || ""} label="Phone" />
            <br />
            <InputLabel>Address</InputLabel>
            <TextareaAutosize
              value={grower.address || ""}
              aria-label="Grower Address"
              placeholder="Grower Address"
              rowsMin={3}
            />
            {/* <TextField value={grower.address} label="Address" /> */}
            <br />
            <TextField value={grower.county || ""} label="County" />
            <br />
            <TextField value={grower.notes || ""} label="Notes" />
            <br />
            <TextField
              value={grower.additional_contact || ""}
              label="Additional Contact"
            />
          </Grid>
        </Grid>

        {/* <Map
          center={[
            parseFloat(props.growerInfo.lat),
            parseFloat(props.growerInfo.lng),
          ]}
          style={{ height: "300px" }}
          zoom={15}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[
              parseFloat(props.growerInfo.lat),
              parseFloat(props.growerInfo.lng),
            ]}
          >
            <Popup>Grower Location</Popup>
          </Marker>
        </Map> */}
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={props.handleEditModalClose}>
          Close
        </Button>
        <Button
          color="primary"
          onClick={() => props.setGrowerSpecificInfo(grower)}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSiteDataModal;
