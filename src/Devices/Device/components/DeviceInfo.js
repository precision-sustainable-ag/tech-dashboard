import React from 'react';
import {
  ListItem,
  ListItemIcon,
  List,
  ListItemText,
  Grid,
  Typography,
  useTheme,
} from '@material-ui/core';
import { NetworkCell, Router, CalendarToday } from '@material-ui/icons';
import moment from 'moment-timezone';
import { string } from 'prop-types';
import { DateProvider } from './DateProvider';
import { useSelector } from 'react-redux';

export const DeviceInfo = ({ deviceName }) => {
  const { palette } = useTheme();
  const deviceData = useSelector((state) => state.devicesData.deviceData);
  const userTimezone = useSelector((state) => state.devicesData.userTimezone);
  // const userTimezone = useSelector((state) => state.devicesData.userTimezone);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" color={palette.type === 'dark' ? 'primary' : 'secondary'}>
            Showing data for {deviceName}
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <List>
            <ListItem alignItems="center" key="last-date">
              <ListItemIcon>
                <CalendarToday />
              </ListItemIcon>
              <ListItemText primary={<DateProvider />} />
            </ListItem>
          </List>
        </Grid>

        {deviceData.links && deviceData.links.cellular && (
          <Grid item xs={12} md={4}>
            <List>
              <ListItem alignItems="center" key="lastconnect">
                <ListItemIcon>
                  <Router />
                </ListItemIcon>
                <ListItemText
                  primary={'Last Connection'}
                  secondary={moment
                    .tz(deviceData.links.cellular[0].last_connect_time, 'UTC')
                    .tz(userTimezone)
                    .format('MM/DD/YYYY hh:mm A')
                    .toString()}
                />
              </ListItem>
            </List>
          </Grid>
        )}

        {deviceData.links && deviceData.links.cellular && (
          <Grid item xs={12} md={4}>
            <List>
              <ListItem alignItems="center" key="network">
                <ListItemIcon>
                  <NetworkCell />
                </ListItemIcon>
                <ListItemText
                  primary={'Network'}
                  secondary={deviceData.links.cellular[0].last_network_used}
                />
              </ListItem>
            </List>
          </Grid>
        )}
      </Grid>
    </>
  );
};

DeviceInfo.propTypes = {
  // timeEnd: number,
  // setTimeEnd: any,
  deviceName: string,
  // userTimezone: string,
  // deviceData: any,
};
