import React from "react";
import { Chip, Grid } from "@material-ui/core";
import PropTypes from "prop-types";

const AffiliationsChips = (props) => {
  const { affiliations, handleActiveAffiliation, activeAffiliation } = props;
  return (
    <>
      <Grid item>
        <Chip
          label={"All"}
          color={activeAffiliation === "all" ? "primary" : "default"}
          onClick={() => {
            handleActiveAffiliation("all");
          }}
        />
      </Grid>
      {affiliations.length > 0 &&
        affiliations.map((affiliation, index) => (
          <Grid item key={`affiliationChip-${index}`}>
            <Chip
              label={affiliation.affiliation}
              color={affiliation.active ? "primary" : "default"}
              onClick={() => {
                handleActiveAffiliation(affiliation.affiliation);
              }}
            />
          </Grid>
        ))}
    </>
  );
};

AffiliationsChips.defaultProps = {
  activeAffiliation: "all",
  affiliations: [{ affiliation: "all", active: true }],
};

AffiliationsChips.propTypes = {
  activeAffiliation: PropTypes.string,
  affiliations: PropTypes.arrayOf(
    PropTypes.shape({
      affiliation: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired,
    })
  ),
  handleActiveAffiliation: PropTypes.func,
};
export default AffiliationsChips;
