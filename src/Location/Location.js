// Dependency Imports
import { Grid } from "@material-ui/core";
import React, { useState } from "react";
import GoogleMapsReact from "google-map-react";

// Local Imports
import "./marker.scss";
import { googleApiKey } from "../utils/api_secret";
import SearchBox from "./SearchBox";

// Default function
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
  selectedToEditSite,
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
  const addressLookup = async (lat, lng) => {
    let placeService = new window.google.maps.Geocoder();
    const placeRequest = {
      location: { lat: lat, lng: lng },
      region: "en-US",
    };
    return await new Promise((resolve) =>
      placeService.geocode(placeRequest, (results, status) => {
        resolve({ results, status });
      })
    );
  };
  const [draggable, setDraggable] = useState(true);
  return (
    <Grid container spacing={2}>
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
            selectedToEditSite={selectedToEditSite}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <div style={{ height: mapHeight, width: "100%" }}>
          <GoogleMapsReact
            draggable={draggable}
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
            onChildMouseUp={(childKey, childProps, e) => {
              setDraggable(true);
            }}
            onChildMouseDown={(childKey, childProps, e) => {
              setDraggable(false);
            }}
            onChildMouseMove={(childKey, childProps, e) => {
              setDraggable(true);
              addressLookup(e.lat, e.lng).then((res) => {
                if (res.status === "OK") {
                  if (res.results.length > 0) {
                    let address = res.results[0].formatted_address
                      ? res.results[0].formatted_address
                      : "";
                    let county = res.results[0].address_components.filter(
                      (e) => e.types[0] === "administrative_area_level_2"
                    );
                    setSelectedToEditSite({
                      ...selectedToEditSite,
                      latitude: e.lat,
                      longitude: e.lng,
                      address: address,
                      county: county[0].long_name,
                    });
                  }
                } else {
                  setSelectedToEditSite({
                    ...selectedToEditSite,
                    latitude: e.lat,
                    longitude: e.lng,
                  });
                }
              });
            }}
            onClick={(e) => {
              // setMarkerLatLng({ lat: e.center.lat, lng: e.center.lng });
              addressLookup(e.lat, e.lng).then((res) => {
                if (res.status === "OK") {
                  if (res.results.length > 0) {
                    let address = res.results[0].formatted_address
                      ? res.results[0].formatted_address
                      : "";
                    let county = res.results[0].address_components.filter(
                      (e) => e.types[0] === "administrative_area_level_2"
                    );
                    setSelectedToEditSite({
                      ...selectedToEditSite,
                      latitude: e.lat,
                      longitude: e.lng,
                      address: address,
                      county: county[0].long_name,
                    });
                  }
                } else {
                  setSelectedToEditSite({
                    ...selectedToEditSite,
                    latitude: e.lat,
                    longitude: e.lng,
                  });
                }
              });
            }}
            zoom={markerLatLng.lat && markerLatLng.lng ? 15 : 14}
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

// Helper function
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
