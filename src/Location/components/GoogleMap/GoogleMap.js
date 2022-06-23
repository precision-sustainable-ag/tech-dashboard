/*
File meant to serve as a plain static map with a pin,
no extra features are intended
For extra features, import Location.js
*/

import React from 'react';
import GoogleMapsReact from 'google-map-react';
import PropTypes from 'prop-types';

import { googleApiKey } from '../../../utils/api_secret';

const GoogleMap = ({ lat = 35.763197, lng = -78.700187, from = '' }) => {
  const getMapOptions = (maps) => {
    if (from === 'device' || from === 'mapModal') {
      return {
        streetViewControl: true,

        panControl: false,

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
        mapTypeControl: true,
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
      };
    } else
      return {
        panControl: true,
        mapTypeControl: true,
        scrollwheel: true,
        fullscreenControl: false,
      };
  };
  const center = { lat: lat, lng: lng };
  return (
    <GoogleMapsReact
      bootstrapURLKeys={{
        key: googleApiKey,
        language: 'EN',
        region: 'US',
      }}
      defaultCenter={center}
      center={center}
      defaultZoom={15}
      zoom={16}
      options={getMapOptions}
    >
      <Marker text="Your Field" lat={center.lat} lng={center.lng} />
    </GoogleMapsReact>
  );
};

const Marker = () => {
  return (
    <>
      <div className="pin"></div>
      <div className="pulse"></div>
    </>
  );
};

export default GoogleMap;

GoogleMap.propTypes = {
  lat: PropTypes.number,
  lng: PropTypes.number,
  from: PropTypes.string,
};
