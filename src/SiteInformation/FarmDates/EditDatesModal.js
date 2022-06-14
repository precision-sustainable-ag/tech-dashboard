import {useSelector} from 'react-redux';
import React, { useState, useEffect } from 'react';
import {Dialog, DialogContent, DialogTitle, DialogContentText, TextField, Button, Grid} from '@material-ui/core';
import { callAzureFunction } from '../../utils/SharedFunctions';
import { useAuth0 } from '../../Auth/react-auth0-spa';
import PropTypes from 'prop-types';

//dictionary to hold the dates
let datesDict = {
    coverCropPlanting : null,
    coverCropTermination : null,
    cashPlanting : null,
};

//the modal itself
const EditDatesModal = (props) => {
    const editDatesModalData = useSelector((state) => state.farmDatesData.editDatesModalData); //redux to hold data
    const [farmCode, setFarmCode] = useState();
    const [coverCropPlantingDisabled, setCoverCropPlantingDisabled] = useState(false);
    const [coverCropTerminationDisabled, setCoverCropTerminationDisabled] = useState(false);
    const [cashPlantingDisabled, setCashPlantingDisabled] = useState(false);
    const { getTokenSilently } = useAuth0();

    //set all values when first loaded
    useEffect(() => {
        //set farm code and dates values 
        setFarmCode(editDatesModalData.producer_id);
        datesDict.coverCropPlanting = editDatesModalData.cover_planting;
        datesDict.coverCropTermination = editDatesModalData.cover_termination;
        datesDict.cashPlanting = editDatesModalData.cash_planting;
        //checks if any imported value is null/undefined and sets the state of the corresponding constant 
        if (datesDict.coverCropPlanting == null || datesDict.coverCropPlanting === 'undefined'){
            setCoverCropPlantingDisabled(true);
        }
        if (datesDict.coverCropTermination == null || datesDict.coverCropTermination === 'undefined'){
            setCoverCropTerminationDisabled(true);
        }
        if (datesDict.cashPlanting == null || datesDict.cashPlanting === 'undefined'){
            setCashPlantingDisabled(true);
        }
        // console.log("Cover Crop Planting Date Updated to: " + datesDict.coverCropPlanting);
        // console.log("Cover Crop Termination Updated to: " + datesDict.coverCropTermination);
        // console.log("Cash Planting Date Updated to: " + datesDict.cashPlanting);
    }, []);

    //handles closing of the modal
    const handleEditDatesModalClose = () => {
        props.setShowEditDatesModal(false);
    };

    //handles submit
    const handleEditDatesModalSubmit = () => {
        //set data to what is in the dates dict
        const data = {
            "values": {
                "cc_planting_date": datesDict.coverCropPlanting,
                "cc_termination_date": datesDict.coverCropTermination,
                "cash_crop_planting_date": datesDict.cashPlanting,
            },
            "conditions": {
                "code": farmCode,
            }
        };
        //call azure funciton and pass data along to api
        callAzureFunction( data, 'crowndb/farm_history', 'POST', getTokenSilently);
        //close modal
        handleEditDatesModalClose();
    };

    //updates the dictionary with the passed data based on which column is selected
    //0=coverCropPlanting, 1=coverCropTermination, 2=cashPlanting
    const updateDate = (col, data) => {
        if (col == 0) {
            datesDict.coverCropPlanting = data;
        } else if (col == 1){
            datesDict.coverCropTermination = data;
        } else if (col == 2){
            datesDict.cashPlanting = data;
        } else {
            console.log("Invalid column selected");
        }
    };

    return (
       <Dialog 
        open = {props.showEditDatesModal} 
        onClose={handleEditDatesModalClose}
        >
        <DialogTitle>Edit Dates</DialogTitle>
        <DialogContent>
            <Grid container spacing = {2}>
                <Grid item xs={12}> 
                    <DialogContentText>
                        Please enter the new dates for Cover Crop Planting, Cover Crop Termination, and Cash Planting in the text fields below. 
                    </DialogContentText>
                </Grid>
                <Grid item xs={4}> 
                    <TextField 
                        color = 'primary' 
                        value={datesDict.coverCropPlanting}
                        disabled = {coverCropPlantingDisabled}
                        onChange={data => updateDate(0, data.target.value)} 
                        type = 'date' 
                        id = 'Cover Crop Planting' 
                        label= 'Cover Crop Planting'
                        variant = 'outlined'
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={4}> 
                    <TextField 
                        color = 'primary' 
                        value={datesDict.coverCropTermination}
                        disabled = {coverCropTerminationDisabled}
                        onChange={data => updateDate(1, data.target.value)} 
                        type = 'date' 
                        id = 'Cover Crop Termination' 
                        label= 'Cover Crop Temination'
                        variant = 'outlined'
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={4}> 
                    <TextField 
                        color = 'primary'
                        value={datesDict.cashPlanting}
                        disabled = {cashPlantingDisabled} 
                        onChange={data => updateDate(2, data.target.value)} 
                        type = 'date' 
                        id = 'Cash Planting' 
                        label= 'Cash Planting'
                        variant = 'outlined'
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={6}> 
                    <Button onClick = {handleEditDatesModalClose} color = 'primary' variant = 'contained' fullWidth = {true}>Cancel</Button>
                </Grid>
                <Grid item xs={6}> 
                    <Button onClick = {handleEditDatesModalSubmit} color = 'primary' variant = 'contained' fullWidth = {true}>Update</Button>
                </Grid>
            </Grid>
        </DialogContent>
       </Dialog>
    );
};

//set the proptypes
EditDatesModal.propTypes = {
    showEditDatesModal: PropTypes.bool,
    setShowEditDatesModal: PropTypes.func,
};

export default EditDatesModal;
