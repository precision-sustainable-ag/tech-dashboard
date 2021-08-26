import React from "react";
import {
  Grid,
  Typography,
} from "@material-ui/core";
import FormEntry from "../FormEntry";
import PropTypes from "prop-types";

const RenderFormsData = (props) => {
    let { 
        data, 
        fetching, 
        isDarkTheme, 
        timezoneOffset, 
        modalOpen, 
        toggleModalOpen, 
        originalData, 
        allowedAccounts, 
        user, 
        affiliationLookup, 
        setSnackbarData, 
        formName 
    } = props

    console.log(affiliationLookup)

    if (fetching)
        return (
            <Grid item xs={12}>
            <Typography variant="h5">Fetching Data...</Typography>
            </Grid>
        ) 
    else if (data.length === 0 && originalData.length === 0) 
        return (
            <Grid item xs={12}>
            <Typography variant="h5">
                {" "}
                {allowedAccounts.length !== 0
                ? `No submissions on this form via account${
                    allowedAccounts.length > 1 ? `s` : ""
                    } ${allowedAccounts.join(", ")}`
                : "No Data"}
            </Typography>
            </Grid>
        ) 
    else
        return (
            <>
                <Grid item xs={12}>
                    <Typography variant="body1">{data.length} submissions</Typography>
                </Grid>
                {data.map((record = {}, index) => {
                    return (
                    <FormEntry
                        record={record}
                        index={index}
                        key={`record${index}`}
                        isDarkTheme={isDarkTheme}
                        timezoneOffset={timezoneOffset}
                        modalOpen={modalOpen} 
                        toggleModalOpen={toggleModalOpen}
                        user={user}
                        affiliationLookup={affiliationLookup} 
                        setSnackbarData={setSnackbarData} 
                        formName={formName}
                    />
                    );
                })}
            </>
        );
};

RenderFormsData.propTypes = {
    data: PropTypes.object, 
    fetching: PropTypes.bool,
    isDarkTheme: PropTypes.bool,
    timezoneOffset: PropTypes.number,
    modalOpen: PropTypes.bool,
    toggleModalOpen: PropTypes.function,
    originalData: PropTypes.object,
    allowedAccounts: PropTypes.array,
    // assetId: PropTypes.object,
};

export default React.memo(RenderFormsData);