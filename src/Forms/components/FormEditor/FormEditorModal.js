import React, { useState, useEffect} from "react";
import { Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";
// import { Edit } from "@material-ui/icons";
import { PropTypes } from 'prop-types';
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light"
import { useAuth0 } from "../../../Auth/react-auth0-spa";
import dark from "react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark";
import { callAzureFunction } from "../../../utils/SharedFunctions" 

import EditableField from "./EditableField";

const FormEditorModal = ( props ) => {
    let { isDarkTheme, modalOpen, toggleModalOpen, slimRecord } = props

    const [editableList, setEditableList] = useState("")
    const [loading, setLoading] = useState(true)
    const { getTokenSilently } = useAuth0();
    // console.log(modalOpen)

    const fetchEditableList = async () => {
        const data = { version: slimRecord.__version__};
        const res = await callAzureFunction(data, "EditableList", getTokenSilently);
        console.log(res.jsonResponse);
        setEditableList(JSON.parse(res.jsonResponse));
        setLoading(false)
        console.log(editableList);
    }

    useEffect(() => {
        fetchEditableList()
    }, [])
    

    console.log(props);
    
    // console.log(editableList)
    // let jsonList = JSON.parse(editableList.jsonResponse)
    // let jsonList = []

    

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
                                {!loading && editableList.map((entry, index) => {
                                    // console.log(entry);
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
    slimRecord: PropTypes.object
}

export default FormEditorModal