import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  withStyles,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useMemo, useEffect } from 'react';
import { parseISO, format } from 'date-fns';
import { Comment } from '@material-ui/icons';
import { useAuth0 } from '../../../../Auth/react-auth0-spa';
import React, { useState } from 'react';
import IssueDialogue from '../../../../Comments/components/IssueDialogue/IssueDialogue';

const colHeaders = (unitType = 'kg/ha') => [
  {
    name: 'Code',
    size: '60px',
  },
  {
    name: 'Rep',
    size: '55px',
  },
  {
    name: 'Termination Date',
    size: '135px',
  },
  {
    name: 'Cover Crop Species',
    size: '',
  },
  {
    name: `Uncorrected Dry Weight (${unitType})`,
    size: '',
  },
  {
    name: `Ash-Free Dry Weight (${unitType})`,
    size: '',
  },
  {
    name: '%N by NIR',
    size: '',
  },
  {
    name: 'C:N',
    size: '',
  },
  {
    name: 'Carbohydrates %',
    size: '',
  },
  {
    name: 'Cellulose %',
    size: '',
  },
  {
    name: 'Lignin %',
    size: '',
  },
];

const FarmValuesTable = ({
  data = [],
  year,
  affiliation = 'all',
  setSnackbarData,
  units = 'kg/ha',
}) => {
  // let height = window.innerHeight;

  // if (height < 900 && height > 600) {
  //   height -= 130;
  // } else if (height < 600) {
  //   height -= 200;
  // }

  // console.log(height);

  const record = useMemo(() => {
    return data
      .filter((rec) => {
        if (affiliation !== 'all') {
          return parseInt(rec.year) === year && rec.affiliation === affiliation;
        } else return parseInt(rec.year) === year;
      })
      .map((rec) => ({
        ...rec,
        uncorrected_cc_dry_biomass_kg_ha: Math.round(rec.uncorrected_cc_dry_biomass_kg_ha) || 'N/A',
        uncorrected_cc_dry_biomass_lb_ac:
          Math.round(rec.uncorrected_cc_dry_biomass_kg_ha * 0.8922) || 'N/A',
        ash_corrected_cc_dry_biomass_kg_ha:
          Math.round(rec.ash_corrected_cc_dry_biomass_kg_ha) || 'N/A',
        ash_corrected_cc_dry_biomass_lb_ac:
          Math.round(rec.ash_corrected_cc_dry_biomass_kg_ha * 0.8922) || 'N/A',
        percent_n_nir: rec.percent_n_nir || 'N/A',
        c_n_ratio: rec.CN_ratio ? parseFloat(rec.CN_ratio).toFixed(2) : 'N/A',
        percent_carbohydrates: rec.percent_carbohydrates || 'N/A',
        percent_cellulose: rec.percent_cellulose || 'N/A',
        percent_lignin: rec.percent_lignin || 'N/A',
      }))
      .filter((data) => {
        if (data.protocols_enrolled === '-999') {
          return false;
        } else return true;
      })
      .sort((a, b) => {
        return b.cc_termination_date && a.cc_termination_date
          ? new Date(b.cc_termination_date) - new Date(a.cc_termination_date)
          : 0;
      });
  }, [year, data, affiliation]);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const { user } = useAuth0();

  const { getTokenSilently } = useAuth0();

  const [height, setHeight] = useState(window.innerHeight);

  const handleResize = () => {
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize, false);
  }, []);

  const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: height - 150,
    },
  });

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
                <CustomTableRow>
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
                  <TableCell align="left">{record.code}</TableCell>
                  <TableCell align="right">{record.subplot}</TableCell>
                  <TableCell align="center">
                    {record.cc_termination_date
                      ? format(parseISO(record.cc_termination_date), 'PP')
                      : 'N/A'}
                  </TableCell>
                  <TableCell align="center">{record.cc_species || 'No Data'}</TableCell>
                  <TableCell
                    align="center"
                    title={`Uncorrected cover crop dry biomass in ${units}`}
                  >
                    {units === 'kg/ha'
                      ? record.uncorrected_cc_dry_biomass_kg_ha
                      : record.uncorrected_cc_dry_biomass_lb_ac}
                  </TableCell>
                  <TableCell
                    align="center"
                    title={`Ash corrected cover crop dry biomass in ${units}`}
                  >
                    {units === 'kg/ha'
                      ? record.ash_corrected_cc_dry_biomass_kg_ha
                      : record.ash_corrected_cc_dry_biomass_lb_ac}
                  </TableCell>
                  <TableCell align="center">{record.percent_n_nir}</TableCell>
                  <TableCell align="center">{record.c_n_ratio}</TableCell>
                  <TableCell align="center">{record.percent_carbohydrates}</TableCell>
                  <TableCell align="center">{record.percent_cellulose}</TableCell>
                  <TableCell align="center">{record.percent_lignin}</TableCell>
                </CustomTableRow>

                {index === currentIndex && open && (
                  <CustomTableRow key={`issue${index}`}>
                    <TableCell colSpan="12" style={{ textAlign: 'center' }}>
                      <IssueDialogue
                        nickname={user.nickname}
                        rowData={record}
                        dataType="table"
                        setSnackbarData={setSnackbarData}
                        labels={[
                          'farm-values',
                          record.code,
                          'Subplot ' + record.subplot.toString(),
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

const RenderTableHeader = ({ units = 'kg/ha' }) => (
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
  <TableContainer component={Paper} aria-label="Empty Biomass farm values">
    <Table size="medium">
      <caption>No data available from API</caption>
      <RenderTableHeader units={'kg/ha'} />
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
    transition: 'all 0.2s linear',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

RenderTableHeader.defaultProps = {
  units: 'kg/ha',
};
RenderTableHeader.propTypes = {
  units: PropTypes.oneOf(['kg/ha', 'lbs/ac']),
};

FarmValuesTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  year: PropTypes.number.isRequired,
  affiliation: PropTypes.string,
  setSnackbarData: PropTypes.func,
  units: PropTypes.oneOf(['kg/ha', 'lbs/ac']),
};

export default FarmValuesTable;
