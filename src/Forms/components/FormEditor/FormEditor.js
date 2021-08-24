import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import FormEditorModal from "./FormEditorModal";
import { PropTypes } from 'prop-types';
import { useAuth0 } from "../../../Auth/react-auth0-spa";


import { callAzureFunction } from "../../../utils/SharedFunctions" 
// import { json } from 'react-syntax-highlighter/dist/esm/languages/hljs/json';

const FormEditor = ( props ) => {
    let { isDarkTheme, slimRecord } = props
    const [modalOpen, setModalOpen] = useState(false)
    const [editableList, setEditableList] = useState("")
    const { getTokenSilently } = useAuth0();
    console.log(modalOpen)

    // const toggleModalOpen = () => {
    //     console.log("toggling modal");
    //     setModalOpen(!modalOpen)
    // }

    const fetchEditableList = async () => {
        const data = { version: slimRecord.__version__};
        const res = await callAzureFunction(data, "EditableList", getTokenSilently);
        setEditableList(res);
    }

    const handleEdit = async () => {
        console.log("handling edit");
        await fetchEditableList()
        // toggleModalOpen()
        setModalOpen(true)
    }

    console.log(modalOpen);

    return (
        modalOpen ? 
            <FormEditorModal 
                isDarkTheme={isDarkTheme} 
                modalOpen={modalOpen} 
                // toggleModalOpen={toggleModalOpen} 
                editableList={editableList} 
                slimRecord={slimRecord} 
            /> :
            <Button 
                variant="contained"
                color={isDarkTheme ? "primary" : "default"}
                aria-label={`All Forms`}
                tooltip="All Forms"
                size="small"
                startIcon={<Edit />}
                onClick={handleEdit}
            >
                Edit Form
            </Button>
            
    )
}

FormEditor.propTypes = {
    isDarkTheme: PropTypes.bool, 
    slimRecord: PropTypes.any
}

export default FormEditor
