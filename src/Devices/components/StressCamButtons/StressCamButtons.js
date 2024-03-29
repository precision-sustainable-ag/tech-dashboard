import React, { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  Grid,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Tooltip,
  withStyles,
} from '@material-ui/core';
import { sendCommandToHologram } from '../../../utils/SharedFunctions';
import { getDeviceMessages } from '../../../utils/SharedFunctions';
import PropTypes from 'prop-types';
// import { Context } from '../../../Store/Store';
import { useSelector, useDispatch } from 'react-redux';
import { setSnackbarData } from '../../../Store/actions';

const StyledButton = withStyles({
  root: {
    '&.Mui-disabled': {
      pointerEvents: 'auto',
    },
  },
})(Button);

const StressCamButtons = (props) => {
  const [farmCode, setFarmCode] = useState('');
  const [rep, setRep] = useState('');
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  // const [state] = useContext(Context);
  const isDarkTheme = useSelector((state) => state.userInfo.isDarkTheme);

  const handleClose = () => {
    setOpen(false);
    setButtonsDisabled(false);
  };
  const { deviceId } = props;
  const sendShutdownMessage = () => {
    setOpen(false);
    sendCommandToHologram(deviceId, null, null, 'shutdown', null);
    queryHologram();
  };

  const queryHologram = () => {
    let count = 0;
    let interval = setInterval(() => {
      getDeviceMessages(deviceId).then((res) => {
        let snackbarText =
          'Attempting to send message to your device ' +
          (60 - count).toString() +
          ' attempts remaining';
        dispatch(setSnackbarData({ open: true, text: snackbarText, severity: 'info' }));
        const messages = JSON.parse(res.data.data);

        if (messages.data[0].tags.includes('_SMS_DT_DELIVERED_')) {
          console.log('contains');
          setButtonsDisabled(false);
          clearInterval(interval);
          dispatch(
            setSnackbarData({
              open: true,
              text: 'Successfully sent message',
              severity: 'success',
            }),
          );
        } else if (count >= 60) {
          console.log('does not contain');
          setButtonsDisabled(false);
          clearInterval(interval);
          dispatch(
            setSnackbarData({
              open: true,
              text: 'Could not send message. Your device is not connected to 3G/4G',
              severity: 'error',
            }),
          );
        }
        count++;
        return messages;
      });
    }, 1000);
  };

  const sendMessage = (command) => {
    console.log('sending message');
    setButtonsDisabled(true);
    if (command === 'startCorn')
      sendCommandToHologram(deviceId, farmCode.toUpperCase(), rep, 'start', 'corn');
    else if (command === 'startSoy')
      sendCommandToHologram(deviceId, farmCode.toUpperCase(), rep, 'start', 'soybean');
    else if (command === 'stop') sendCommandToHologram(deviceId, null, null, 'stop', null);
    else if (command === 'shutdown') {
      setOpen(true);
      return;
    }

    queryHologram();
  };

  const ButtonWithTooltip = ({ tooltipText, disabled, onClick, ...other }) => {
    const adjustedButtonProps = {
      disabled: disabled,
      component: disabled ? 'div' : undefined,
      onClick: disabled ? undefined : onClick,
    };
    return (
      <Tooltip title={tooltipText}>
        <StyledButton {...other} {...adjustedButtonProps} />
      </Tooltip>
    );
  };

  ButtonWithTooltip.propTypes = {
    tooltipText: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.any,
  };
  return (
    <>
      <Grid item>
        <Typography variant="h5">
          Make sure your camera is connected to 2G/3G before sending commands
        </Typography>
        <Typography variant="h5">
          Enter 3 letter farm code and rep (1 or 2) before sending start commands
        </Typography>
      </Grid>

      <Grid item xs={12} md={12}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Enter the 3 letter farm code"
              variant="filled"
              label="Farm Code"
              value={farmCode}
              onChange={(e) => setFarmCode(e.target.value.toUpperCase())}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Enter the single digit rep number (1 or 2)"
              variant="filled"
              label="Rep Number"
              value={rep}
              onChange={(e) => setRep(e.target.value)}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={6} display="flex" align="center">
        <Grid container spacing={1} display="flex" justifyContent="center" align="center">
          <Grid item xs={12} md={3}>
            <ButtonWithTooltip
              tooltipText={
                buttonsDisabled || farmCode.length !== 3 || (rep !== '1' && rep !== '2')
                  ? 'Make sure farm code is 3 letters and rep number is 1 or 2'
                  : 'Start your device in corn'
              }
              disabled={buttonsDisabled || farmCode.length !== 3 || (rep !== '1' && rep !== '2')}
              onClick={() => sendMessage('startCorn')}
              fullWidth
              variant="contained"
              color={isDarkTheme ? 'primary' : 'default'}
            >
              Start in Corn
            </ButtonWithTooltip>
          </Grid>
          <Grid item xs={12} md={3}>
            <ButtonWithTooltip
              tooltipText={
                buttonsDisabled || farmCode.length !== 3 || (rep !== '1' && rep !== '2')
                  ? 'Make sure farm code is 3 letters and rep number is 1 or 2'
                  : 'Start your device in soy'
              }
              disabled={buttonsDisabled || farmCode.length !== 3 || (rep !== '1' && rep !== '2')}
              onClick={() => sendMessage('startSoy')}
              fullWidth
              variant="contained"
              color={isDarkTheme ? 'primary' : 'default'}
            >
              Start in Soybean
            </ButtonWithTooltip>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              disabled={buttonsDisabled}
              fullWidth
              variant="contained"
              color={isDarkTheme ? 'primary' : 'default'}
              onClick={() => sendMessage('stop')}
            >
              Stop
            </Button>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              disabled={buttonsDisabled}
              fullWidth
              variant="contained"
              color={isDarkTheme ? 'primary' : 'default'}
              onClick={() => sendMessage('shutdown')}
            >
              Shutdown
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Shutdown your device?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Shutting down will require a manual restart of your device
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={sendShutdownMessage} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StressCamButtons;

StressCamButtons.propTypes = {
  deviceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
