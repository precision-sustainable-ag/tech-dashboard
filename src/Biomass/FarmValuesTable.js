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
  IconButton,
  makeStyles,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { parseISO, format } from "date-fns";
import { Comment } from "@material-ui/icons";
import { useAuth0 } from "../Auth/react-auth0-spa";
import React, { useState } from "react";
import IssueDialogue from "./../Comments/IssueDialogue";

const colHeaders = (unitType = "kg/ha") => [
  {
    name: "Code",
    size: "60px",
  },
  {
    name: "Rep",
    size: "55px",
  },
  {
    name: "Termination Date",
    size: "135px",
  },
  {
    name: "Cover Crop Species",
    size: "",
  },
  {
    name: `Uncorrected Dry Weight (${unitType})`,
    size: "",
  },
  {
    name: `Ash-Free Dry Weight (${unitType})`,
    size: "",
  },
  {
    name: "%N by NIR",
    size: "",
  },
  {
    name: "Carbohydrates %",
    size: "",
  },
  {
    name: "Cellulose %",
    size: "",
  },
  {
    name: "Lignin %",
    size: "",
  },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    // maxHeight: "670px",
  },
});

const FarmValuesTable = ({
  data = [],
  year,
  affiliation = "all",
  setSnackbarData,
  units = "kg/ha",
}) => {
  const record = useMemo(() => {
    return data
      .filter((rec) => {
        if (affiliation !== "all") {
          return parseInt(rec.year) === year && rec.affiliation === affiliation;
        } else return parseInt(rec.year) === year;
      })
      .map((rec) => ({
        ...rec,
        uncorrected_cc_dry_biomass_kg_ha:
          Math.round(rec.uncorrected_cc_dry_biomass_kg_ha) || "N/A",
        uncorrected_cc_dry_biomass_lb_ac:
          Math.round(rec.uncorrected_cc_dry_biomass_kg_ha * 0.8922) || "N/A",
        ash_corrected_cc_dry_biomass_kg_ha:
          Math.round(rec.ash_corrected_cc_dry_biomass_kg_ha) || "N/A",
        ash_corrected_cc_dry_biomass_lb_ac:
          Math.round(rec.ash_corrected_cc_dry_biomass_kg_ha * 0.8922) || "N/A",
        percent_n_nir: rec.percent_n_nir || "N/A",
        percent_carbohydrates: rec.percent_carbohydrates || "N/A",
        percent_cellulose: rec.percent_cellulose || "N/A",
        percent_lignin: rec.percent_lignin || "N/A",
      }))
      .sort(
        (a, b) =>
          new Date(b.cc_termination_date) - new Date(a.cc_termination_date)
      );
  }, [year, data, affiliation]);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const { user } = useAuth0();

  const { getTokenSilently } = useAuth0();
  const classes = useStyles();

  return record.length > 0 ? (
    <>
      <TableContainer
        aria-label="Biomass farm values"
        component={Paper}
        className={classes.container}
      >
        <Table size="medium" stickyHeader>
          <colgroup>
            <col />
            {colHeaders().map((col, index) => (
              <col key={index} style={{ width: col.size }} />
            ))}
          </colgroup>
          <RenderTableHeader units={units} />

          <TableBody>
            {record.map((record, index) => (
              <React.Fragment key={index}>
                <CustomTableRow key={index}>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => {
                        !(index !== currentIndex && open) && setOpen(!open);
                        setCurrentIndex(index);
                      }}
                    >
                      {open ? <Comment /> : <Comment />}
                    </IconButton>
                  </TableCell>
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

                  <TableCell align="center">
                    {format(
                      parseISO(record.cc_termination_date) || new Date(),
                      "PP"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {record.cc_species || "No Data"}
                  </TableCell>
                  <TableCell
                    align="center"
                    title={`Uncorrected cover crop dry biomass in ${units}`}
                  >
                    {units === "kg/ha"
                      ? record.uncorrected_cc_dry_biomass_kg_ha
                      : record.uncorrected_cc_dry_biomass_lb_ac}
                  </TableCell>
                  <TableCell
                    align="center"
                    title={`Ash corrected cover crop dry biomass in ${units}`}
                  >
                    {units === "kg/ha"
                      ? record.ash_corrected_cc_dry_biomass_kg_ha
                      : record.ash_corrected_cc_dry_biomass_lb_ac}
                  </TableCell>
                  <TableCell align="center">{record.percent_n_nir}</TableCell>
                  <TableCell align="center">
                    {record.percent_carbohydrates}
                  </TableCell>
                  <TableCell align="center">
                    {record.percent_cellulose}
                  </TableCell>
                  <TableCell align="center">{record.percent_lignin}</TableCell>
                </CustomTableRow>

                {index === currentIndex && open && (
                  <CustomTableRow key={`issue${index}`}>
                    <TableCell colSpan="12" style={{ textAlign: "center" }}>
                      <IssueDialogue
                        nickname={user.nickname}
                        rowData={record}
                        dataType="table"
                        setSnackbarData={setSnackbarData}
                        labels={[
                          "farm-values",
                          record.code,
                          "Subplot " + record.subplot.toString(),
                          record.affiliation,
                        ]}
                        getTokenSilently={getTokenSilently}
                      />
                    </TableCell>
                  </CustomTableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  ) : (
    <RenderEmptyTable />
  );
};

/**
 *
 * @returns Table Header
 * @param String units
 */

const RenderTableHeader = ({ units = "kg/ha" }) => (
  <TableHead>
    <TableRow>
      <TableCell align="right"></TableCell>
      {colHeaders(units).map((col, index) => (
        <TableCell key={index} align="center">
          {col.name}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

/**
 *
 * @returns Empty table
 */
const RenderEmptyTable = () => (
  <TableContainer component={Paper} aria-label="Biomass farm values">
    <Table size="medium">
      <RenderTableHeader units={"kg/ha"} />
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

RenderTableHeader.defaultProps = {
  units: "kg/ha",
};
RenderTableHeader.propTypes = {
  units: PropTypes.oneOf(["kg/ha", "lbs/ac"]),
};

FarmValuesTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  year: PropTypes.number.isRequired,
  affiliation: PropTypes.string,
};

export default FarmValuesTable;
