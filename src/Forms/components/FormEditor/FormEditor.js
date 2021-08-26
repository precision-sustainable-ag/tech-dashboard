import React from "react";
import { Button } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import FormEditorModal from "./FormEditorModal";
import { PropTypes } from 'prop-types';
// import { useAuth0 } from "../../../Auth/react-auth0-spa";


// import { callAzureFunction } from "../../../utils/SharedFunctions" 
// import { json } from 'react-syntax-highlighter/dist/esm/languages/hljs/json';

const FormEditor = ( props ) => {
    let { isDarkTheme, slimRecord, modalOpen, toggleModalOpen } = props
    
    // const [editableList, setEditableList] = useState("")
    // const { getTokenSilently } = useAuth0();
    // // console.log(modalOpen)

    // const fetchEditableList = async () => {
    //     const data = { version: slimRecord.__version__};
    //     const res = await callAzureFunction(data, "EditableList", getTokenSilently);
    //     console.log(res.jsonResponse);
    //     setEditableList("hi");
    //     console.log(editableList);
    // }

    const handleEdit = async () => {
        console.log("handling edit");
        // await fetchEditableList()
        // console.log(editableList);
        toggleModalOpen()
        // setModalOpen(true)
        
    }

    // console.log(modalOpen);

    return (
        modalOpen ? 
            <FormEditorModal 
                isDarkTheme={isDarkTheme} 
                modalOpen={modalOpen} 
                toggleModalOpen={toggleModalOpen} 
                // editableList={editableList} 
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
    slimRecord: PropTypes.any,
    modalOpen: PropTypes.bool,
    toggleModalOpen: PropTypes.function,
}

// export default React.memo(FormEditor)
export default FormEditor
