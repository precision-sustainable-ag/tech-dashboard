import {
  Box,
  Collapse,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";

// fetch height from useWindowDimensions hook
let height = window.innerHeight;

// scale height
if (height < 900 && height > 600) {
  height -= 130;
} else if (height < 600) {
  height -= 200;
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: height * 0.7,
  },
});

const SiteInformationTable = (props) => {
  const classes = useStyles();
  const { data = [], headers = [], year, affiliation } = props;
  const record = useMemo(() => {
    return data.filter((rec) => {
      if (affiliation !== "all") {
        return parseInt(rec.year) === year && rec.affiliation === affiliation;
      } else return parseInt(rec.year) === year;
    });
    //   .sort(
    //     (a, b) =>
    //       new Date(b.cc_termination_date) - new Date(a.cc_termination_date)
    //   );
  }, [year, data, affiliation]);
  return (
    <Paper className={classes.root}>
      <TableContainer>
        <Table
          aria-label="Site Information Table"
          stickyHeader
          className={classes.container}
        >
          <TableHead>
            <TableRow>
              <TableCell />
              {headers.map((header, index) => (
                <TableCell align="right" key={index}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {record.length > 0 ? (
              record.map((rec) => <Row row={rec} />)
            ) : (
              <Row nodata={true} headerLength={headers.length} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

const Row = (props) => {
  const { row, nodata = false, headerLength } = props;
  const [open, setOpen] = React.useState(false);
  //   const classes = useRowStyles();

  return (
    <>
      {!nodata ? (
        <React.Fragment>
          <TableRow>
            <TableCell>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </TableCell>

            <TableCell align="right">{row.code}</TableCell>
            <TableCell align="right">{row.last_name}</TableCell>
            <TableCell align="right">{row.affiliation}</TableCell>
            <TableCell align="right">{row.county}</TableCell>
            <TableCell align="right">{row.year}</TableCell>
            <TableCell align="right">{row.address}</TableCell>
            <TableCell align="right">
              {row.notes === "-999" ? "" : row.notes}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box margin={1}>inner values</Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      ) : (
        <TableRow>
          <TableCell align="center" colSpan={headerLength}>
            No Data
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

SiteInformationTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string),
};

export default SiteInformationTable;
