import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  withStyles,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { parseISO, format } from "date-fns";

const FarmValuesTable = ({ data = [], year, affiliation = "all" }) => {
  const record = useMemo(() => {
    return data
      .filter((rec) => {
        if (affiliation !== "all") {
          return parseInt(rec.year) === year && rec.affiliation === affiliation;
        } else return parseInt(rec.year) === year;
      })
      .sort(
        (a, b) =>
          new Date(b.cc_termination_date) - new Date(a.cc_termination_date)
      );
  }, [year, data, affiliation]);

  return record.length > 0 ? (
    <TableContainer aria-label="Biomass farm values" component={Paper}>
      <Table size="medium" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="right">Code</TableCell>
            <TableCell align="right">Subplot</TableCell>
            <TableCell align="right">Termination Date</TableCell>
            <TableCell align="right">Species</TableCell>
            <TableCell align="right">Kg/ha Uncorrected</TableCell>
            <TableCell align="right">Kg/ha Corrected</TableCell>
            <TableCell align="right">
              NIR <sup>%</sup>
            </TableCell>
            <TableCell align="right">
              Carbohydrates <sup>%</sup>
            </TableCell>
            <TableCell align="right">
              Cellulose <sup>%</sup>
            </TableCell>
            <TableCell align="right">
              Lignin <sup>%</sup>
            </TableCell>
            <TableCell align="right">Moisture</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {record.map((record, index) => (
            <CustomTableRow key={index}>
              {(index + 1) % 2 === 0 ? (
                <>
                  <TableCell colSpan={2} align="right">
                    {record.subplot}
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell align="right">{record.code}</TableCell>
                  <TableCell align="right">{record.subplot}</TableCell>
                </>
              )}

              <TableCell align="right">
                {format(
                  parseISO(record.cc_termination_date) || new Date(),
                  "PP"
                )}
              </TableCell>
              <TableCell align="right">
                {record.cc_species || <UnavailableText />}
              </TableCell>
              <TableCell align="right">
                {record.uncorrected_cc_dry_biomass_kg_ha || (
                  <UnavailableText text="N/A" />
                )}
              </TableCell>
              <TableCell align="right">
                {record.ash_corrected_cc_dry_biomass_kg_ha || (
                  <UnavailableText text="N/A" />
                )}
              </TableCell>
              <TableCell align="right">
                {record.percent_n_nir || <UnavailableText text="N/A" />}
              </TableCell>
              <TableCell align="right">
                {record.percent_carbohydrates || <UnavailableText text="N/A" />}
              </TableCell>
              <TableCell align="right">
                {record.percent_cellulose || <UnavailableText text="N/A" />}
              </TableCell>
              <TableCell align="right">
                {record.percent_lignin || <UnavailableText text="N/A" />}
              </TableCell>
              <TableCell align="right">
                {record.moisture_content || <UnavailableText text="N/A" />}
              </TableCell>
            </CustomTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <RenderEmptyTable />
  );
};

const UnavailableText = ({ text }) => (
  <Typography variant="caption">{text || "No Data"}</Typography>
);

/**
 *
 * @returns Empty table
 */
const RenderEmptyTable = () => (
  <TableContainer component={Paper} aria-label="Biomass farm values">
    <Table size="medium">
      <TableHead>
        <TableRow>
          <TableCell align="right">Code</TableCell>
          <TableCell align="right">Subplot</TableCell>
          <TableCell align="right">Termination Date</TableCell>
          <TableCell align="right">Species</TableCell>
          <TableCell align="right">Kg/ha Uncorrected</TableCell>
          <TableCell align="right">Kg/ha Corrected</TableCell>
          <TableCell align="right">
            NIR <sup>%</sup>
          </TableCell>
          <TableCell align="right">
            Carbohydrates <sup>%</sup>
          </TableCell>
          <TableCell align="right">
            Cellulose <sup>%</sup>
          </TableCell>
          <TableCell align="right">
            Lignin <sup>%</sup>
          </TableCell>
          <TableCell align="right">Moisture</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell colSpan="11" align="center" variant="body">
            No Data
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

const CustomTableRow = withStyles((theme) => ({
  root: {
    // "&:nth-of-type(even)": {
    //   backgroundColor: theme.palette.action.hover,
    // },
    transition: "all 0.2s linear",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

UnavailableText.propTypes = {
  text: PropTypes.string,
};

FarmValuesTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  year: PropTypes.number.isRequired,
  affiliation: PropTypes.string,
};

export default FarmValuesTable;
