import React from 'react';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { any } from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment-timezone';

export const DateProvider = ({ timeEnd, setTimeEnd }) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        disableFuture
        autoOk
        label="Show records from"
        format="MM/dd/yyyy"
        value={moment.unix(timeEnd)}
        onChange={(date) => {
          setTimeEnd(moment(date).unix());
        }}
        animateYearScrolling
      />
    </MuiPickersUtilsProvider>
  );
};

DateProvider.propTypes = {
  timeEnd: any,
  setTimeEnd: any,
};
