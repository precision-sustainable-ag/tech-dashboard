import { Grid, TextField } from "@material-ui/core";
import React, { useState, useEffect, useRef, useCallback } from "react";
import GoogleMapsReact from "google-map-react";
import { googleApiKey } from "../utils/api_secret";
import PropTypes from "prop-types";
import SearchBox from "./SearchBox";
import { LocationOn, PinDrop } from "@material-ui/icons";
import "./marker.scss";

const Location = ({
  center = { lat: 35.763197, lng: -78.700187 },
  mapHeight = 500,
  defaultZoom = 11,
  searchLabel = "Add an Address",

  markerLatLng = { lat: null, lng: null },
  setMarkerLatLng,
  setCounty,
  setAddress,
  setSelectedToEditSite,
}) => {
  const [apiStates, setApiStates] = useState({
    mapsApiLoaded: false,
    mapInstance: null,
    mapsApi: null,
  });
  const [addressString, setAddressString] = useState("");
  const [zoom, setZoom] = useState(defaultZoom);

  const apiLoaded = (map, mapsApi) => {
    setApiStates({
      mapsApiLoaded: true,
      mapInstance: map,
      mapsApi: mapsApi,
    });
  };
  //   const [markerLatLng, setMarkerLatLng] = useState({ lat: null, lng: null });

  //   useEffect(() => {
  //     if (markerLatLng.lat && markerLatLng.lng) {
  //       //   setZoom(15);
  //     }
  //     console.log(markerLatLng);
  //   }, [markerLatLng]);

  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        {apiStates.mapsApiLoaded && (
          <SearchBox
            mapInstance={apiStates.mapInstance}
            mapsApi={apiStates.mapsApi}
            latLng={markerLatLng}
            setLatLng={setMarkerLatLng}
            searchLabel={searchLabel}
            setCounty={setCounty}
            setAddress={setAddress}
            setSelectedToEditSite={setSelectedToEditSite}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <div style={{ height: mapHeight, width: "100%" }}>
          <GoogleMapsReact
            bootstrapURLKeys={{
              key: googleApiKey,
              libraries: ["places", "geometry"],
              language: "EN",
              region: "US",
            }}
            defaultCenter={center}
            center={
              markerLatLng.lat && markerLatLng.lng ? markerLatLng : center
            }
            zoom={markerLatLng.lat && markerLatLng.lng ? 15 : 11}
            defaultZoom={zoom}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => {
              apiLoaded(map, maps);
            }}
          >
            {markerLatLng.lat && markerLatLng.lng ? (
              <Marker lat={markerLatLng.lat} lng={markerLatLng.lng} />
            ) : null}
          </GoogleMapsReact>
        </div>
      </Grid>
    </Grid>
  );
};

const Marker = (props) => {
  return (
    <>
      <div className="pin"></div>
      <div className="pulse"></div>
    </>
  );
};

export default Location;

//   <TextField
//     label="Search for address"
//     value={addressString}
//     fullWidth
//     variant="filled"
//     onChange={(e) => setAddressString(e.target.value)}
//   />
