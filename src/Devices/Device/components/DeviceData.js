import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light';
import dark from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark';
import {
  makeStyles,
  Chip,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  withStyles,
  Typography,
  Tooltip,
} from '@material-ui/core';
import moment from 'moment-timezone';
import { any, boolean } from 'prop-types';
import { isValidJson, isBase64 } from '../../../utils/SharedFunctions';
// import { Context } from '../../../Store/Store';
import { useSelector } from 'react-redux';

SyntaxHighlighter.registerLanguage('json', json);

// Styles
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    height: 300,
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },

  paper: {
    // padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const RenderTags = ({ chipsArray }) => {
  let chips = chipsArray;

  return chips.map((chip, index) => (
    <Chip key={`chip${index}`} style={{ marginRight: '1em', marginBottom: '1em' }} label={chip} />
  ));
};

export const DeviceData = ({ location, isFetching }) => {
  const classes = useStyles();
  // const [state] = useContext(Context);
  const isDarkTheme = useSelector((state) => state.userInfo.isDarkTheme);
  const mostRecentData = useSelector((state) => state.devicesData.mostRecentData);
  const userTimezone = useSelector((state) => state.devicesData.userTimezone);
  const getDataFromJSON = (jsonData, type, sensorType) => {
    jsonData = JSON.parse(jsonData);

    let dataStringParsed =
      sensorType === 'watersensors' && isBase64(jsonData.data)
        ? atob(jsonData.data)
        : isValidJson(jsonData.data)
        ? JSON.stringify(JSON.parse(jsonData.data), null, 2)
        : jsonData.data;
    switch (type) {
      case 'dataString':
        return dataStringParsed;
      case 'tags':
        return <RenderTags chipsArray={jsonData.tags} />;
      case 'timestamp':
        return moment
          .tz(jsonData.received, 'UTC')
          .tz(userTimezone)
          .format('dddd, MMMM Do YYYY, h:mm:ss A');
      default:
        return '';
    }
  };

  return (
    <TableContainer component={Paper} className={classes.paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>SNo</StyledTableCell>
            <StyledTableCell>Data</StyledTableCell>
            {/* <StyledTableCell>Tags</StyledTableCell> */}
            <StyledTableCell>Time Stamp</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mostRecentData.length > 0 ? (
            mostRecentData.map((data, index) => (
              <StyledTableRow key={`row-${index}`}>
                <TableCell>{index + 1}</TableCell>
                {location ? (
                  <TableCell>
                    {location.for !== 'watersensors' ? (
                      isBase64(getDataFromJSON(data.data, 'dataString', location.for)) ? (
                        <Tooltip
                          title={
                            <code style={{ minHeight: '50px', width: '300px' }}>
                              {atob(getDataFromJSON(data.data, 'dataString', location.for))}
                            </code>
                          }
                        >
                          <code>{getDataFromJSON(data.data, 'dataString', location.for)}</code>
                        </Tooltip>
                      ) : (
                        <SyntaxHighlighter language="json" style={isDarkTheme ? dark : docco}>
                          {getDataFromJSON(data.data, 'dataString', location.for)}
                        </SyntaxHighlighter>
                      )
                    ) : (
                      <code>{getDataFromJSON(data.data, 'dataString', location.for)}</code>
                    )}
                  </TableCell>
                ) : (
                  <TableCell>
                    <code>{getDataFromJSON(data.data, 'dataString', 'watersensors')}</code>
                  </TableCell>
                )}

                <TableCell datatype="">
                  {getDataFromJSON(
                    data.data,
                    'timestamp',
                    location ? location.for : 'watersensors',
                  )}
                </TableCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <TableCell colSpan={3} align="center">
                <Typography variant="body1">{isFetching ? `Fetching Data` : `No Data`}</Typography>
              </TableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

DeviceData.propTypes = {
  location: any,
  // mostRecentData: any,
  // userTimezone: any,
  isFetching: boolean,
};
