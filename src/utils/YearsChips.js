import { Chip, Grid } from "@material-ui/core";
import PropTypes from "prop-types";

const YearsChips = (props) => {
  const { years, handleActiveYear } = props;
  return (
    years.length > 0 &&
    years.map((yearInfo, index) => {
      return (
        <Grid item key={`yearChip-${index}`}>
          <Chip
            label={yearInfo.year}
            color={yearInfo.active ? "primary" : "default"}
            onClick={() => {
              handleActiveYear(yearInfo.year);
            }}
          />
        </Grid>
      );
    })
  );
};

YearsChips.propTypes = {
  years: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired,
    })
  ),
  handleActiveYear: PropTypes.func,
};

export default YearsChips;
