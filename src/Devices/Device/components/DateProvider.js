import React from 'react';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment-timezone';
import { useSelector, useDispatch } from 'react-redux';
import { setTimeEnd } from '../../../Store/actions';

export const DateProvider = () => {
  const timeEnd = useSelector((state) => state.devicesData.timeEnd);
  const dispatch = useDispatch();
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        disableFuture
        autoOk
        label="Show records from"
        format="MM/dd/yyyy"
        value={moment.unix(timeEnd)}
        onChange={(date) => {
          dispatch(setTimeEnd(moment(date).unix()));
        }}
        animateYearScrolling
      />
    </MuiPickersUtilsProvider>
  );
};

