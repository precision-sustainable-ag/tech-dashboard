import { Grid, Typography } from "@material-ui/core";
import React from "react";
import GoogleMapsReact from "google-map-react";
import { googleApiKey } from "./api_secret";
import PropTypes from "prop-types";
import styled from "styled-components";

// import NodeCharts from "./NodeCharts";

// import NodeVoltage from "./NodeVoltage";
// import VolumetricWater from "./VolumetricWater";
// import SoilTemp from "./SoilTemp";
// import TempByLbs from "./TempByLbs";

const StyledMarker = styled.div.attrs((/* props */) => ({ tabIndex: 0 }))`
  & {
    width: 100px;
    height: auto;
    padding: 2px;
    background-color: rgba(248, 208, 93, 0.5);
    margin: 0 auto;
    position: relative;
    transition: all 0.3s linear;
    box-shadow: 0 0 2px transparent;
    border-radius: 5px;
  }
  &:hover {
    background-color: rgba(248, 208, 93, 1);
    box-shadow: 0 0 2px black;

    z-index: 999;
  }
  &:after {
    border-right: solid 15px transparent;
    border-left: solid 15px transparent;
    border-top: solid 15px #f8d05d;
    transform: translateX(-50%);
    position: absolute;
    z-index: -1;
    content: "";
    top: 100%;
    left: 50%;
    height: 0;
    width: 0;
  }
`;

const getMapOptions = (maps) => ({
  streetViewControl: true,

  panControl: false,
  mapTypeControl: false,
  scrollwheel: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: "poi.business",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ],
  // mapTypeControl: true,
  mapTypeId: maps.MapTypeId.SATELLITE,
  mapTypeControlOptions: {
    style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
    position: maps.ControlPosition.TOP_RIGHT,
    mapTypeIds: [
      maps.MapTypeId.ROADMAP,
      maps.MapTypeId.SATELLITE,
      maps.MapTypeId.HYBRID,
      maps.MapTypeId.TERRAIN,
    ],
  },
});

const SensorMap = (props) => {
  const { mapData } = props;

  return (
    <Grid item xs={12} style={{ height: "400px" }}>
      <GoogleMapsReact
        bootstrapURLKeys={{
          key: googleApiKey,
          language: "EN",
          region: "US",
        }}
        // defaultCenter={center}
        center={[mapData.locationData[0].lat, mapData.locationData[0].lon]}
        zoom={mapData.zoom}
        options={getMapOptions}
      >
        {mapData.locationData.map((val, index) => (
          <Marker key={index} data={val} lat={val.lat} lng={val.lon} />
        ))}
      </GoogleMapsReact>
    </Grid>
  );
};

const Marker = (props) => {
  const latLngStr = props.data.lat + "," + props.data.lon;
  return (
    <StyledMarker>
      <Typography align="center" variant="body1">
        Rep: {props.data.rep},{" "}
        {props.data.treatment.toLowerCase() === "b" ? `Bare` : `Cover`}
      </Typography>
      {/* <p>ProducerID: {props.data.producer_id}</p> */}
      <Typography align="center" variant="body1">
        <a
          href={`https://www.google.com/maps?saddr=My+Location&daddr=${latLngStr}&z=19&om=0`}
          target="_blank"
          rel="noreferrer"
        >
          Directions
        </a>
      </Typography>
    </StyledMarker>
  );
};

SensorMap.propTypes = {
  mapData: PropTypes.object.isRequired,
};

Marker.propTypes = {
  data: PropTypes.object.isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
};

export default SensorMap;
