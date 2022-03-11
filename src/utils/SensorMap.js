import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import GoogleMapsReact from 'google-map-react';
import { googleApiKey } from './api_secret';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const StyledMarker = styled.div.attrs((/* props */) => ({ tabIndex: 0 }))`
  & {
    width: 100px;
    height: auto;
    padding: 2px;
    background-color: ${(props) => props.background};
    margin: 0 auto;
    box-shadow: 0 0 2px transparent;
    border-radius: 5px;
    margin-top: -60px;
    margin-left: -50px;
  }
  &:hover {
    background-color: ${(props) => props.backgroundHover};
    box-shadow: 0 0 2px black;
  }
  &:after {
    border-right: solid 15px transparent;
    border-left: solid 15px transparent;
    border-top: solid 15px ${(props) => props.backgroundArrow};
    position: absolute;
    transform: translate(-50%, -50%);
    content: '';
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
      featureType: 'poi.business',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'off',
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

  mapData.locationData = mapData.locationData.filter(
    (point) => point.lat !== null && point.lon !== null,
  );

  const center = averageGeolocation(mapData.locationData);

  if (center !== null) {
    return (
      <Grid item xs={12} style={{ height: '70vh' }}>
        <GoogleMapsReact
          bootstrapURLKeys={{
            key: googleApiKey,
            language: 'EN',
            region: 'US',
          }}
          // defaultCenter={center}
          center={[center.lat, center.lon]}
          zoom={mapData.zoom - 1}
          options={getMapOptions}
        >
          {mapData.locationData.map((val, index) => (
            <Marker key={index} data={val} lat={val.lat} lng={val.lon} />
          ))}
        </GoogleMapsReact>
      </Grid>
    );
  } else {
    return <Typography>No coordinates for this farm code</Typography>;
  }
};

const Marker = (props) => {
  const latLngStr = props.data.lat + ',' + props.data.lon;
  if (props.data.type !== 'corner') {
    const background =
      props.data.type === 'address' ? 'rgba(204, 204, 255, 0.5)' : 'rgba(248, 208, 93, 0.5)';
    const backgroundHover =
      props.data.type === 'address' ? 'rgba(204, 204, 255, 1)' : 'rgba(248, 208, 93, 1)';
    const backgroundArrow = props.data.type === 'address' ? '#CCCCFF' : '#f8d05d';

    return (
      <StyledMarker
        background={background}
        backgroundHover={backgroundHover}
        backgroundArrow={backgroundArrow}
      >
        {props.data.treatment && (
          <Typography align="center" variant="body1">
            Rep: {props.data.subplot},{' '}
            {props.data.treatment.toLowerCase() === 'b' ? `Bare` : `Cover`}
          </Typography>
        )}
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
  } else {
    return <FiberManualRecordIcon></FiberManualRecordIcon>;
  }
};

const averageGeolocation = (coordsList) => {
  if (coordsList.length === 0) {
    return null;
  } else if (coordsList.length === 1) {
    return coordsList[0];
  }

  coordsList = coordsList.filter((coord) => coord.type !== 'address');
  if (coordsList.length === 1) {
    return coordsList[0];
  }

  let x = 0.0;
  let y = 0.0;
  let z = 0.0;

  for (let coord of coordsList) {
    let lat = (coord.lat * Math.PI) / 180;
    let lon = (coord.lon * Math.PI) / 180;

    x += Math.cos(lat) * Math.cos(lon);
    y += Math.cos(lat) * Math.sin(lon);
    z += Math.sin(lat);
  }

  let total = coordsList.length;

  x = x / total;
  y = y / total;
  z = z / total;

  let centralLongitude = Math.atan2(y, x);
  let centralSquareRoot = Math.sqrt(x * x + y * y);
  let centralLatitude = Math.atan2(z, centralSquareRoot);

  return {
    lat: (centralLatitude * 180) / Math.PI,
    lon: (centralLongitude * 180) / Math.PI,
  };
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
