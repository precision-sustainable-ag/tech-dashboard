import React from "react";
import { Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";
import { PropTypes } from 'prop-types';
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light"
import dark from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark";

import EditableField from "./EditableField";

const FormEditorModal = ( props ) => {
    let { isDarkTheme, modalOpen, toggleModalOpen, slimRecord, editableList } = props
    
    return (
        typeof(modalOpen) === "boolean" && modalOpen ? 
            <Dialog 
                open={modalOpen}
                aria-labelledby="form-dialog-title"
                fullWidth={true}
                maxWidth="lg"
            >
                <DialogTitle id="form-dialog-title">
                    <Typography variant="h4" align="center">Editing form</Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container direction="row" spacing={2}>
                        <Grid item container direction="column" lg={6}>
                            <Grid item>
                                <Typography variant="h6">Original Form</Typography>
                            </Grid>
                            <Grid item>
                                <SyntaxHighlighter language="json" style={isDarkTheme ? dark : docco}>
                                    {JSON.stringify(slimRecord, undefined, 2)}
                                </SyntaxHighlighter>
                            </Grid>
                        </Grid>
                        <Grid item container direction="column" lg={6} spacing={2}>
                            <Grid item>
                                <Typography variant="h6">Editable Entries</Typography>
                            </Grid>
                            <Grid item>
                                {editableList.map((entry, index) => {
                                    return <EditableField field={entry} data={slimRecord[entry]} key={index} />
                                })}
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
                                    onClick={toggleModalOpen}
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
                                    onClick={toggleModalOpen}
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
}

FormEditorModal.propTypes = {
    isDarkTheme: PropTypes.bool, 
    modalOpen: PropTypes.bool, 
    toggleModalOpen: PropTypes.function,
    editableList: PropTypes.object,
    slimRecord: PropTypes.object,
}

export default FormEditorModal