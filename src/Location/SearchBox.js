/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// Dependency Imports
import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";

//Global Vars
const autocompleteService = { current: null };
const placeService = { current: null };
const geocodeService = { current: null };

// Styles
const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

// Default function
const SearchBox = ({
  mapInstance,
  mapsApi,
  latLng,
  setLatLng,
  searchLabel = "Add a location",
  setAddress,
  setCounty,
  selectedToEditSite,
  setSelectedToEditSite,
}) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [locationDetails, setLocationDetails] = React.useState({
    lat: 0,
    lng: 0,
  });
  //   const loaded = React.useRef(false);

  useEffect(() => {
    // console.log(inputValue);
  }, [inputValue]);

  //   if (typeof window !== "undefined" && !loaded.current) {
  //     if (!document.querySelector("#google-maps")) {
  //       loadScript(
  //         `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`,
  //         document.querySelector("head"),
  //         "google-maps"
  //       );
  //     }

  //     loaded.current = true;
  //   }

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    []
  );

  const fetchLocalData = {
    load: (place_id, main_text) => {
      fetchLocalData.fetchPlaces(place_id).then((res) => {
        fetchLocalData.setData(res, main_text);
      });
    },
    fetchPlaces: async (place_id) => {
      placeService.current = new window.google.maps.Geocoder();
      const placeRequest = {
        placeId: place_id,
        region: "en-US",
      };
      return await new Promise((resolve) =>
        placeService.current.geocode(placeRequest, (results, status) => {
          resolve({ results, status });
        })
      );
    },
    setData: ({ results, status }, main_text) => {
      if (status === "OK") {
        // setAddress(results.formatted_address);
        const county = results[0].address_components.find(
          (e) => e.types[0] === "administrative_area_level_2"
        );

        if (county.length !== 0) {
          // If google is able to find the county, pick the first preference!
          fetchLocalData.fetchGeocode(results, county, main_text);
        } else {
          fetchLocalData.fetchGeocode(results, "", main_text);
        }
      } else {
        console.error("Google PlaceService Status", status);
      }
    },
    fetchGeocode: (results, county, main_text) => {
      const stateDetails = results[0].address_components.find((a) => a.types[0] === "administrative_area_level_1");

      setSelectedToEditSite({
        ...selectedToEditSite,
        latitude: results[0]?.geometry.location.lat(),
        longitude: results[0]?.geometry.location.lng(),
        county: county?.long_name,
        address: main_text,
        state: stateDetails?.short_name || "",
      });
    },
  };

  const fetchLocationDetails = ({ place_id, structured_formatting }) => {
    if (place_id) {
      const placeRequest = {
        placeId: place_id,
        fields: ["name", "geometry", "types", "formatted_address", "icon"],
        region: "en-US",
      };
      const geoRequest = {
        placeId: place_id,
        region: "en-US",
      };

      fetchLocalData.load(place_id, structured_formatting.main_text);
    }
  };

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      if (window.google.maps) {
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();
      }
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      id="google-map-demo"
      fullWidth
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        // fetch location details
        if (newValue) {
          fetchLocationDetails(newValue);
        }
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => {
        params.inputProps.autoComplete = "new-password";
        return (
          <TextField
            {...params}
            label={searchLabel}
            variant="standard"
            fullWidth
          />
        );
      }}
      renderOption={(option) => {
        const matches =
          option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length])
        );

        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={classes.icon} />
            </Grid>
            <Grid item xs>
              {parts.map((part, index) => (
                <span
                  key={index}
                  style={{ fontWeight: part.highlight ? 700 : 400 }}
                >
                  {part.text}
                </span>
              ))}

              <Typography variant="body2" color="textSecondary">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
};

export default SearchBox;
