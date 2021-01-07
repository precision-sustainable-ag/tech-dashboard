//Dependency Imports
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
// import Loading from "react-loading";
// import Skeleton from "@material-ui/lab/Skeleton";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapModal = (props) => {
  const [latlng, setLatLng] = useState([
    parseFloat(props.growerInfo.lat),
    parseFloat(props.growerInfo.lng),
  ]);
  return (
    <Dialog
      fullWidth={true}
      maxWidth={false}
      open={props.mapModalOpen}
      onClose={props.handleMapModalClose}
      aria-labelledby="map-dialog-title"
    >
      <DialogTitle id="map-dialog-title">
        Location for {props.growerInfo.lastName} ({props.growerInfo.code})
      </DialogTitle>
      <DialogContent>
        <Map
          center={latlng}
          style={{ height: "300px" }}
          zoom={15}
          onclick={(e) => {
            if (props.growerInfo.new) {
              setLatLng([e.latlng.lat, e.latlng.lng]);
            }
          }}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={latlng}>
            <Popup>Grower Location</Popup>
          </Marker>
        </Map>
      </DialogContent>
      <DialogActions>
        <Button
          color={props.growerInfo.new ? "secondary" : "primary"}
          onClick={props.handleMapModalClose}
        >
          Close
        </Button>
        {props.growerInfo.new ? (
          <Button color="primary" onClick={props.handleMapModalClose}>
            Update
          </Button>
        ) : (
          ""
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MapModal;
