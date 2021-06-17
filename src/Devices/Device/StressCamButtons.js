import React, { useState } from "react";
import {
    Button,
    TextField,
    Dialog,
    Snackbar,
    Grid,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Typography,
    Tooltip,
    withStyles,
  } from "@material-ui/core";
import {sendCommandToHologram} from "../../utils/SharedFunctions"
import {getDeviceMessages} from "../../utils/SharedFunctions"
import MuiAlert from "@material-ui/lab/Alert";

// Helper function
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const StyledButton = withStyles({
    root: {
      "&.Mui-disabled": {
        pointerEvents: "auto"
      }
    }
  })(Button);

const StressCamButtons = (props) => {
    const [farmCode, setFarmCode] = useState("");
    const [rep, setRep] = useState("");
    const[open, setOpen] = useState(false);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [snackbarData, setSnackbarData] = useState({ open: false, text: "", severity: "success" });

    const handleClose = () => {
        setOpen(false);
        setButtonsDisabled(false);
    };

    const sendShutdownMessage = () => {
        setOpen(false);
        sendCommandToHologram(props.deviceId, null, null, "shutdown", null);
        queryHologram();
    }

    const queryHologram = () => {
        let count = 0;
        let interval = setInterval(() => {
            getDeviceMessages(1030442).then((res) => {    
                let snackbarText = "Attempting to send message to your device " + (60 - count).toString() + " attempts remaining";
                setSnackbarData({open: true, text: snackbarText, severity: "info"});    
                const messages = JSON.parse(res.data.data);
    
                if(messages.data[0].tags.includes("_SMS_DT_DELIVERED_")){
                    console.log("contains");
                    setButtonsDisabled(false);
                    clearInterval(interval);
                    setSnackbarData({open: true, text: "Successfully sent message", severity: "success"});
                }
                else if(count >= 60){
                    console.log("does not contain");
                    setButtonsDisabled(false);
                    clearInterval(interval);
                    setSnackbarData({open: true, text: "Could not send message. Your device is not connected to 3G/4G", severity: "error"});
                }
                count++;
                return messages;
            });
        }, 1000);
    }
    
    const sendMessage = (command) => {
        setButtonsDisabled(true)
        if(command === "startCorn")
            sendCommandToHologram(props.deviceId, farmCode.toUpperCase(), rep, "start", "corn");
        else if(command === "startSoy")
            sendCommandToHologram(props.deviceId, farmCode.toUpperCase(), rep, "start", "soybean");
        else if(command === "stop")
            sendCommandToHologram(props.deviceId, null, null, "stop", null);
        else if(command === "shutdown"){
            setOpen(true);
            return;
        }
            
        queryHologram();
    }

    const ButtonWithTooltip = ({ tooltipText, disabled, onClick, ...other }) => {
        const adjustedButtonProps = {
          disabled: disabled,
          component: disabled ? "div" : undefined,
          onClick: disabled ? undefined : onClick,
        };
        return (
          <Tooltip title={tooltipText}>
            <StyledButton {...other} {...adjustedButtonProps}/>
          </Tooltip>
        );
      };

    return(
    <>
        <Snackbar
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            open={snackbarData.open}
            autoHideDuration={3000}
            onClose={() =>
                setSnackbarData({ ...snackbarData, open: !snackbarData.open })
            }
        >
            <Alert severity={snackbarData.severity}>{snackbarData.text}</Alert>
        </Snackbar>
        <Grid item>
            <Typography variant="h5">Make sure your camera is connected to 2G/3G before sending commands</Typography>
            <Typography variant="h5">Enter farm code and rep before sending start commands</Typography>
        </Grid>
        
        <Grid item xs={12} md = {12}>
            <Grid container spacing = {1}>
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
                    placeholder="Enter the single digit rep number"
                    variant="filled"
                    label="Rep Number"
                    value={rep}
                    onChange={(e) => setRep(e.target.value)}
                />
                </Grid>
            </Grid>
        </Grid>

        <Grid item xs={12} md = {6} display="flex" align="center">
            <Grid container spacing = {1} display="flex" justify="center" align="center">
                <Grid item xs={12} md={3}>
                    <ButtonWithTooltip 
                        tooltipText={buttonsDisabled || (farmCode.length !== 3) || (rep !== "1" && rep !== "2") ? "Check farm code and rep" : "Start your device in corn"} 
                        disabled={buttonsDisabled || (farmCode.length !== 3) || (rep !== "1" && rep !== "2")} 
                        onClick={() => sendMessage("startCorn")}
                        fullWidth 
                        variant="contained" 
                        color={props.isDarkTheme ? "primary" : "default"} 
                    >
                        Start in Corn
                    </ButtonWithTooltip>
                </Grid>
                <Grid item xs={12} md={3}>
                    <ButtonWithTooltip 
                        tooltipText={buttonsDisabled || (farmCode.length !== 3) || (rep !== "1" && rep !== "2") ? "Check farm code and rep" : "Start your device in soy"} 
                        disabled={buttonsDisabled || (farmCode.length !== 3) || (rep !== "1" && rep !== "2")} 
                        onClick={() => sendMessage("startSoy")}
                        fullWidth 
                        variant="contained" 
                        color={props.isDarkTheme ? "primary" : "default"} 
                    >
                        Start in Soybean
                    </ButtonWithTooltip>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Button 
                        disabled={buttonsDisabled} 
                        fullWidth 
                        variant="contained" 
                        color={props.isDarkTheme ? "primary" : "default"} 
                        onClick={() => sendMessage("stop")}
                    >
                        Stop
                    </Button>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Button 
                        disabled={buttonsDisabled} 
                        fullWidth 
                        variant="contained" 
                        color={props.isDarkTheme ? "primary" : "default"} 
                        onClick={() => sendMessage("shutdown")}
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
        <DialogTitle id="alert-dialog-title">{"Shutdown your device?"}</DialogTitle>
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
    )
    
}

export default StressCamButtons;