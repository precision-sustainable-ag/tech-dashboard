import React, { useState, useEffect, useContext } from "react";
import { Grid, Chip, } from "@material-ui/core";
import PropTypes from "prop-types";
import { apiPassword, apiURL, apiUsername } from "../../utils/api_secret";
import Axios from "axios";
import { Context } from "../../Store/Store";
import { YearsAndAffiliations } from "../../utils/CustomComponents";

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
          let affiliationArray = [];
          affiliations.map((affiliation) => {
            affiliationArray.push({affiliation: affiliation.affiliation, active: affiliation.affiliation === activeState});
          })
          setAllAffiliations(affiliationArray);
        } else {
          // broken for not all affiliations
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

  const handleActiveAffiliation = (affiliation = "all") => {
    const newAffiliations = allAffiliations.map((rec) => {
      return {
        active: affiliation === rec.affiliation,
        affiliation: rec.affiliation,
      };
    });
    const sortedNewAffiliations = newAffiliations.sort((a, b) =>
      b.affiliation < a.affiliation ? 1 : b.affiliation > a.affiliation ? -1 : 0
    );

    setActiveState(affiliation);
    setAllAffiliations(sortedNewAffiliations);
  };

  return (  
    allAffiliations.length > 0 ? 
      <YearsAndAffiliations
        title={"Issues"}
        years={null}
        handleActiveYear={null}
        affiliations={allAffiliations}
        handleActiveAffiliation={handleActiveAffiliation}
        showYears={false}
      />
    : ""
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
