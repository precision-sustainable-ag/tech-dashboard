import { Grid } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { onfarmAPI } from '../../../../utils/api_secret';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { enUS } from 'date-fns/locale';
import { blue, green, yellow } from '@material-ui/core/colors';
import { addDays, format, parse, startOfWeek, getDay } from 'date-fns';
import { useSelector } from 'react-redux';
const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const FarmDatesCalendar = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const [data, setData] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    const setRecords = async (apikey) => {
      try {
        const response = await fetch(`${onfarmAPI}/dates`, {
          headers: {
            'cache-control': 'no-cache',
            'x-api-key': apikey,
          },
        });

        const records = await response.json();

        setData(records);
      } catch (e) {
        console.error(e);
      }
    };

    if (userInfo.apikey) {
      setRecords(userInfo.apikey);
    }
  }, [userInfo.apikey]);

  useEffect(() => {
    if (data.length > 0) {
      const biomassHarvestDates = data.map((record) => {
        return {
          title: `${record.code} - Biomass Harvest`,
          allDay: true,
          start: new Date(record.biomass_harvest),
          end: new Date(record.biomass_harvest),
          type: 'biomassHarvest',
        };
      });

      const coverPlantingDates = data.map((record) => {
        return {
          title: `${record.code} - Cover Planting`,
          allDay: true,
          start: new Date(record.cover_planting),
          end: new Date(record.cover_planting),
          type: 'coverPlanting',
        };
      });

      const coverTerminationDates = data.map((record) => {
        return {
          title: `${record.code} - Cover Termination`,
          allDay: true,
          start: new Date(record.cover_termination),
          end: new Date(record.cover_termination),
          type: 'coverTermination',
        };
      });

      const cashPlantingDates = data.map((record) => {
        return {
          title: `${record.code} - Cash Planting`,
          allDay: true,
          start: new Date(record.cash_planting),
          end: new Date(record.cash_planting),
          type: 'cashPlanting',
        };
      });

      const t1TargetDate = data.map((record) => {
        return record.protocols.decomp_biomass == 1
          ? {
              title: `${record.code} - T1 Target`,
              allDay: true,
              start: addDays(new Date(record.biomass_harvest), 14),
              end: addDays(new Date(record.biomass_harvest), 14),
              type: 'target',
            }
          : '';
      });
      const t2TargetDate = data.map((record) => {
        return record.protocols.decomp_biomass == 1
          ? {
              title: `${record.code} - T2 Target`,
              allDay: true,
              start: addDays(new Date(record.biomass_harvest), 30),
              end: addDays(new Date(record.biomass_harvest), 30),
              type: 'target',
            }
          : '';
      });
      const t3TargetDate = data.map((record) => {
        return record.protocols.decomp_biomass == 1
          ? {
              title: `${record.code} - T3 Target`,
              allDay: true,
              start: addDays(new Date(record.biomass_harvest), 60),
              end: addDays(new Date(record.biomass_harvest), 60),
              type: 'target',
            }
          : '';
      });
      const t4TargetDate = data.map((record) => {
        return record.protocols.decomp_biomass == 1
          ? {
              title: `${record.code} - T4 Target`,
              allDay: true,
              start: addDays(new Date(record.biomass_harvest), 90),
              end: addDays(new Date(record.biomass_harvest), 90),
              type: 'target',
            }
          : '';
      });

      // check if actual dates are available
      const t1actual = data.filter((rec) => rec.t1_actual);
      const t2actual = data.filter((rec) => rec.t2_actual);
      const t3actual = data.filter((rec) => rec.t3_actual);
      const t4actual = data.filter((rec) => rec.t4_actual);

      let t1ActualDate = [],
        t2ActualDate = [],
        t3ActualDate = [],
        t4ActualDate = [];

      if (t1actual.length > 0) {
        t1ActualDate = data.map((record) => {
          return {
            title: `${record.code} - T1 Actual`,
            allDay: true,
            start: new Date(record.t1_actual),
            end: new Date(record.t1_actual),
            type: 'actual',
          };
        });
      }

      if (t2actual.length > 0) {
        t2ActualDate = data.map((record) => {
          return {
            title: `${record.code} - T2 Actual`,
            allDay: true,
            start: new Date(record.t2_actual),
            end: new Date(record.t2_actual),
            type: 'actual',
          };
        });
      }

      if (t3actual.length > 0) {
        t3ActualDate = data.map((record) => {
          return {
            title: `${record.code} - T3 Actual`,
            allDay: true,
            start: new Date(record.t3_actual),
            end: new Date(record.t3_actual),
            type: 'actual',
          };
        });
      }

      if (t4actual.length > 0) {
        t4ActualDate = data.map((record) => {
          return {
            title: `${record.code} - T4 Actual`,
            allDay: true,
            start: new Date(record.t4_actual),
            end: new Date(record.t4_actual),
            type: 'actual',
          };
        });
      }

      setAllEvents([
        ...cashPlantingDates,
        ...coverPlantingDates,
        ...coverTerminationDates,
        ...biomassHarvestDates,
        ...t1TargetDate,
        ...t2TargetDate,
        ...t3TargetDate,
        ...t4TargetDate,
        ...t1ActualDate,
        ...t2ActualDate,
        ...t3ActualDate,
        ...t4ActualDate,
      ]);
    }
  }, [data]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Calendar
          localizer={localizer}
          selectable
          style={{ height: '80vh' }}
          startAccessor="start"
          showMultiDayTimes
          endAccessor="end"
          events={allEvents}
          views={['month', 'week', 'day', 'agenda']}
          onSelectEvent={(event) => alert(event.title)}
          culture="en-US"
          eventPropGetter={(event) => {
            let newStyle = {
              backgroundColor: 'lightgrey',
              color: 'black',
              borderRadius: '0px',
            };
            if (event.type === 'biomassHarvest') {
              newStyle.backgroundColor = blue[300];
            }
            if (event.type === 'cashPlanting') {
              newStyle.backgroundColor = green[300];
            }
            if (event.type === 'coverTermination') {
              newStyle.backgroundColor = yellow[400];
            }
            if (event.type === 'target') {
              newStyle.border = `1px solid ${blue[300]}`;
              newStyle.backgroundColor = 'white';
            }
            if (event.type === 'actual') {
              newStyle.backgroundColor = green[600];
            }

            return {
              className: '',
              style: newStyle,
            };
          }}
        />
      </Grid>
    </Grid>
  );
};

export default FarmDatesCalendar;
