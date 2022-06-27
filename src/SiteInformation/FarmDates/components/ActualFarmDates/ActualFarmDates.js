/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Typography,
  TableRow,
  TableCell,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from '@material-ui/core';
import { onfarmAPI } from '../../../../utils/api_secret';
import { useSelector } from 'react-redux';
import { fetchFromApi } from '../../../Shared/functions';

const dryBiomass_url = onfarmAPI + `/raw?table=decomp_biomass_dry`;

const ActualFarmDates = ({ rowData }) => {
  const userInfo = useSelector((state) => state.userInfo);
  const [datesObject, setDatesObject] = useState({});

  const [oldRowData, setOldRowData] = useState({});

  const parseDates = async (rowData) => {
    fetchFromApi(`${dryBiomass_url}&code=${rowData.code}`, userInfo.apikey).then((res) => {
      let dates = { hasData: false, s1sa: [], s1sb: [], s2sa: [], s2sb: [] };
      res.sort((a, b) => a.subplot - b.subplot || a.subsample - b.subsample || a.time - b.time);

      for (const r of res) {
        // verify if there is date data
        if (r.recovery_date) dates.hasData = true;

        // make hash map with each combination of subplot, subsample
        if (r.subplot === 1 && r.subsample === 'A') dates.s1sa.push(r);
        else if (r.subplot === 1 && r.subsample === 'B') dates.s1sb.push(r);
        else if (r.subplot === 2 && r.subsample === 'A') dates.s2sa.push(r);
        else if (r.subplot === 2 && r.subsample === 'B') dates.s2sb.push(r);
      }

      setOldRowData(rowData);
      setDatesObject(dates);
    });
  };

  const getEmptyTableCells = (number) => {
    let tableCells = [];
    for (let i = 0; i < number; i++) {
      tableCells.push(<TableCell key={i}></TableCell>);
    }
    return tableCells;
  };

  const generateRow = (data, subplot, subsample) => {
    return (
      <TableRow>
        {getEmptyTableCells(3)}
        <TableCell>{subplot}</TableCell>
        <TableCell>{subsample}</TableCell>
        {getEmptyTableCells(5)}
        {data.map((date, index) => {
          return (
            <TableCell key={index}>
              <Typography variant="subtitle2">
                {date.recovery_date
                  ? new Date(date.recovery_date).toLocaleDateString('en-US', {
                      timeZone: 'UTC',
                    })
                  : ''}
              </Typography>
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  if (JSON.stringify(rowData) !== JSON.stringify(oldRowData)) {
    parseDates(rowData);
  }

  return datesObject.hasData ? (
    <TableContainer aria-label="Biomass farm values">
      <Table size="medium" stickyHeader>
        <TableHead>
          <TableRow>
            {getEmptyTableCells(3)}
            <TableCell>
              <Typography variant="subtitle1">Subplot</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">Subsample</Typography>
            </TableCell>
            {getEmptyTableCells(5)}
            <TableCell>
              <Typography variant="subtitle1">T0 Actual</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">T1 Actual</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">T2 Actual</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">T3 Actual</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">T4 Actual</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1">T5 Actual</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {generateRow(datesObject.s1sa, 1, 'A')}
          {generateRow(datesObject.s1sb, 1, 'B')}
          {generateRow(datesObject.s2sa, 2, 'A')}
          {generateRow(datesObject.s2sb, 2, 'B')}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Typography variant="body1">No data available</Typography>
  );
};

export default ActualFarmDates;
