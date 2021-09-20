import React, { useState } from "react";
import { Button, Dialog, DialogContent, Grid, Typography } from "@material-ui/core";
import { PropTypes } from 'prop-types';
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light";
import dark from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark";
import { useAuth0 } from "../../../Auth/react-auth0-spa";

import EditableField from "./EditableField";
import { callAzureFunction } from './../../../utils/SharedFunctions';

const FormEditorModal = ( props ) => {
    let { 
        isDarkTheme, 
        modalOpen, 
        toggleModalOpen, 
        slimRecord, 
        editableList,
        setButtonText,
        error,
        formName
    } = props;

    const { getTokenSilently } = useAuth0();

    const handleCancel = () => {
        setButtonText("Edit Form");
        toggleModalOpen();
    };

    const handleSubmit = () => {
        setButtonText("Edit Form");
        let data = {
            "data": JSON.stringify(editedForm),
            "asset_name": formName.split("_").join(" "),
            "id": editedForm._id
        };
        callAzureFunction(data, "SubmitNewEntry", getTokenSilently);
        console.log(editedForm);
        toggleModalOpen();
    };

    const [editedForm, setEditedForm] = useState(slimRecord);
    
    return (
        typeof(modalOpen) === "boolean" && modalOpen ? 
            <Dialog 
                open={modalOpen}
                aria-labelledby="form-dialog-title"
                fullWidth={true}
                maxWidth="xl"
            >
                <DialogContent>
                    <Grid container direction="row" spacing={2}>
                        <Grid item container direction="column" lg={6}>
                            <Grid item>
                                <Typography variant="h5">Original Form</Typography>
                            </Grid>
                            <Grid item>
                                <SyntaxHighlighter language="json" style={isDarkTheme ? dark : docco}>
                                    {JSON.stringify(slimRecord, undefined, 2)}
                                </SyntaxHighlighter>
                            </Grid>
                        </Grid>
                        <Grid item container direction="column" lg={6} spacing={2}>
                            <Grid item>
                                <Typography variant="h5">Editable Entries</Typography>
                            </Grid>
                            <Grid item>
                                {editableList.map((entry, index) => {
                                    return <EditableField entry={entry} editedForm={editedForm} setEditedForm={setEditedForm} key={index} />;
                                })}
                            </Grid>     
                            <Grid item>
                                <Typography>Error Code: {error}</Typography>
                            </Grid>                       
                        </Grid>
                        <Grid item container spacing={2}>
                            <Grid item>
                                <Button 
                                    variant="contained"
                                    color={isDarkTheme ? "primary" : "default"}
                                    aria-label={`All Forms`}
                                    tooltip="All Forms"
                                    size="small"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button 
                                    variant="contained"
                                    color={isDarkTheme ? "primary" : "default"}
                                    aria-label={`All Forms`}
                                    tooltip="All Forms"
                                    size="small"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog> :
            ""
    );
};

FormEditorModal.propTypes = {
    isDarkTheme: PropTypes.bool, 
    modalOpen: PropTypes.bool, 
    toggleModalOpen: PropTypes.func,
    editableList: PropTypes.array,
    slimRecord: PropTypes.object,
    setButtonText: PropTypes.func,
    error: PropTypes.string,
    formName: PropTypes.string,
};

export default FormEditorModal;