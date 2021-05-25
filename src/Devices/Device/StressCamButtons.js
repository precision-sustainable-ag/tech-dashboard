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
  } from "@material-ui/core";
import {sendCommandToHologram} from "../../utils/SharedFunctions"
import {getDeviceMessages} from "../../utils/SharedFunctions"
import MuiAlert from "@material-ui/lab/Alert";

// Helper function
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const StressCamButtons = (props) => {
    const [farmCode, setFarmCode] = useState("");
    const [rep, setRep] = useState("");
    const[open, setOpen] = useState(false);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [snackbarData, setSnackbarData] = useState({ open: false, text: "", severity: "success" });

    const handleClose = () => {
        setOpen(false);
    };

    const sendShutdownMessage = () => {
        setOpen(false);
        sendCommandToHologram(props.deviceId, null, null, "open", null);
    }
    
    const sendMessage = (command) => {
        setButtonsDisabled(true)
        if(command === "startCorn")
            sendCommandToHologram(props.deviceId, farmCode.toUpperCase(), rep, "start", "corn");
        else if(command === "startSoy")
            sendCommandToHologram(props.deviceId, farmCode.toUpperCase(), rep, "start", "soybean");
        else if(command === "stop")
            sendCommandToHologram(props.deviceId, null, null, "stop", null);
        else if(command === "shutdown")
            setOpen(true);

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
                    setSnackbarData({open: true, text: "Could not send message", severity: "error"});
                }
                count++;
                return messages;
            });
        }, 1000);
    }

    return(
    <>
        <Snackbar
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            open={snackbarData.open}
            autoHideDuration={2500}
            onClose={() =>
                setSnackbarData({ ...snackbarData, open: !snackbarData.open })
            }
            >
            <Alert severity={snackbarData.severity}>{snackbarData.text}</Alert>
        </Snackbar>
        <Grid item xs={12} md = {12}>
            <Grid container spacing = {1}>
                <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    placeholder="Enter the 3 uppercase letter farm code"
                    variant="filled"
                    label="Farm Code"
                    value={farmCode}
                    onChange={(e) => setFarmCode(e.target.value)}
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
                    <Button disabled={buttonsDisabled} fullWidth variant="contained" color={props.isDarkTheme ? "primary" : "default"} onClick={() => sendMessage("startCorn")}>Start in Corn</Button>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Button disabled={buttonsDisabled} fullWidth variant="contained" color={props.isDarkTheme ? "primary" : "default"} onClick={() => sendMessage("startSoy")}>Start in Soybean</Button>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Button disabled={buttonsDisabled} fullWidth variant="contained" color={props.isDarkTheme ? "primary" : "default"} onClick={() => sendMessage("stop")}>Stop</Button>
                </Grid>
                <Grid item xs={12} md={3}>
                {/* <Button fullWidth variant="contained" color={props.isDarkTheme ? "primary" : "default"} onClick={() => sendCommandToHologram(props.deviceId, null, null, "open", null)}>Shutdown</Button> */}
                    <Button disabled={buttonsDisabled} fullWidth variant="contained" color={props.isDarkTheme ? "primary" : "default"} onClick={() => sendMessage("shutdown")}>Shutdown</Button>
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
                Shutting down will prevent you from sending future messages to your device
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