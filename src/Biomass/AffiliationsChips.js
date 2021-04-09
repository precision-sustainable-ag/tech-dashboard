import { Chip, Grid } from "@material-ui/core";
import PropTypes from "prop-types";

const AffiliationsChips = (props) => {
  const { affiliations, handleActiveAffiliation } = props;
  return (
    affiliations.length > 0 &&
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
    ))
  );
};

AffiliationsChips.propTypes = {
  affiliations: PropTypes.arrayOf(
    PropTypes.shape({
      affiliation: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired,
    })
  ),
  handleActiveAffiliation: PropTypes.func,
};
export default AffiliationsChips;
