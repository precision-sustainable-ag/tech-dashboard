import React, { useState, useEffect, useContext } from "react";
import { Grid, Chip, } from "@material-ui/core";
import PropTypes from "prop-types";
import { apiPassword, apiURL, apiUsername } from "../../utils/api_secret";
import Axios from "axios";
import { Context } from "../../Store/Store";

export const RenderAllowedStatesTab = ({
  assignedStates = [],
  setActiveState,
  activeState,
}) => {
  const [loading, setLoading] = useState();
  const [allAffiliations, setAllAffiliations] = useState([]);
  const [state, dispatch] = useContext(Context);

  useEffect(() => {
    setLoading(true);
    // get remote data
    let siteAffResponse = fetchSiteAffiliations();

    siteAffResponse
      .then((res) => {
        let affiliations = res.data.data;
        let permittedAffiliations = [];
        if (state.userInfo.state === "all") {
          affiliations.unshift({affiliation: "all"});
          setAllAffiliations(affiliations);
        } else {
          const dbPermittedAffiliations = state.userInfo.state.split(",");
          dbPermittedAffiliations.forEach((element) => {
            let a = affiliations.filter((data) => data.affiliation === element);
            permittedAffiliations.push(a);
          });
          setAllAffiliations(permittedAffiliations.flat());
        }
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  console.log(assignedStates)
  return assignedStates[0] !== "all" ? (
    <Grid item container spacing={3}>
        <Grid container item xs={12} spacing={3}>
          {assignedStates.map((state, index) => (
            <Grid item key={`koboAccount${index}`} >
              <Chip
                label={state}
                color={activeState === state ? "primary" : "default"}
                onClick={() => setActiveState(state)}
              />
            </Grid>
          ))}
        </Grid>
    </Grid> 
  ) : ( 
    <Grid item container spacing={3}>
          <Grid container item xs={12} spacing={3}>
          {allAffiliations.map((state, index) => (
            <Grid item key={`koboAccount${index}`} >
              <Chip
                label={state.affiliation === "all" ? "All" : state.affiliation}
                color={activeState === state.affiliation ? "primary" : "default"}
                onClick={() => setActiveState(state.affiliation)}
              />
            </Grid>
          ))}
        </Grid>
    </Grid>    
  );
};

const fetchSiteAffiliations = async () => {
  return await Axios.get(`${apiURL}/api/retrieve/grower/affiliation/all`, {
    auth: {
      username: apiUsername,
      password: apiPassword,
    },
  });
};



RenderAllowedStatesTab.propTypes = {
  assignedStates: PropTypes.array.isRequired,
  activeState: PropTypes.string.isRequired,
  setActiveState: PropTypes.func.isRequired,
};
