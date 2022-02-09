import {
    CardContent,
    Divider,
    Typography,
    TextField,
    Button,
    Modal,
    Box,
  } from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useState, useEffect, useContext } from "react";
// import { onfarmAPI } from "../utils/api_secret";
import { Context } from "../Store/Store";
import ProgressLine from "./ProgressLine.js";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }; 

const TaskTrackerCard = (props) => {
    let title = props.title;
    let table = props.table;
    let year = props.year;
    let affiliation = props.affiliation;

    if (affiliation=="all") {
        affiliation="";
    }
    let complete_col = props.complete_col;
    const [state] = useContext(Context);
    const [total, setTotal] = useState([]);
    const [complete, setComplete] = useState([]);
    const [missing, setMissing] = useState([]);
    const [unavailable, setUnavailable] = useState([]);
    // const [res, responsetext] = useState([]);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const totalvalue=()=>{
        return total;
    };
    const completevalue=()=>{
        return complete.length;
    };
    const missingvalue=()=>{
        return missing.length;
    };
    const unavailablevalue=()=>{
        return unavailable.length;
    };
    // const resvalue=()=>{
    //     return res;
    // };
    const completetext=()=>{
        return complete;
    };
    // const [fetching, setFetching] = useState(true);
    useEffect(() => {
        const fetchData = async (apiKey) => {
            const response = await fetch(`http://localhost:1000/onfarm/raw?table=${table}&complete_count=${complete_col}&affiliation=${affiliation}&year=${year}`, {
                headers: {
              "x-api-key": apiKey,
            },
          });
    
          const data = await response.json();
          return data;
        };

        if (state.userInfo.apikey) {

        //   setFetching(true);
          fetchData(state.userInfo.apikey)
            .then((response) => {
              console.log(response.length);
            //   responsetext(response);
              let complete=[];
              let missing=[];
              let unavailable=[];
              setTotal(response.length);
            for(let i=0;i<response.length;i++) {
                if(response[i].flag==1){
                    complete.push(response[i].code+"="+response[i].count+" ");
                }
                else if(response[i].flag==0){
                    missing.push(response[i].code+" = "+response[i].count);
                }
                else if(response[i].flag==-1){
                    unavailable.push(response[i].code+" = "+response[i].count);
                }
            }
            setComplete(complete);
            setMissing(missing);
            setUnavailable(unavailable);

            console.log(complete);
            console.log(missing);
            console.log(unavailable);

            })
            .catch((e) => {
              console.error(e);
            });
        }
      }, [state.userInfo.apikey, year, affiliation]);
      return (
        <>
        <CardContent>
            <Typography
            component="div"
            align="center"
            variant="body1"
            className="cardTitle"
            >
            <TextField
              type="text"
              placeholder="Enter device name"
              variant="standard"
              value={title}
            />
            </Typography>    
        </CardContent>
        <Divider />
        <CardContent>
            <Button fullWidth="95%" margin = "0" padding ="0px" onClick={handleOpen}>
                <ProgressLine           
                    label=""
                    backgroundColor="lightgrey"
                    visualParts={[
                    {
                        percentage: Math.round((completevalue()/totalvalue())*100)+"%",
                        color: "green"
                    },
                    {
                        percentage: Math.round((missingvalue()/totalvalue())*100)+"%",
                        color: "yellow"
                    },
                    {
                        percentage: Math.round((unavailablevalue()/totalvalue())*100)+"%",
                        color: "red"
                    }
                    ]}
                />

            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Completed
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {completetext()}
                </Typography>
                </Box>
            </Modal>
            <Typography>
                {"Complete = "+completevalue()}
                <br />
                {"Missing = "+missingvalue()}
                <br />
                {"Unavailable = "+unavailablevalue()}
            </Typography>
        </CardContent>

        </>
    );
  };

  
TaskTrackerCard.propTypes = {
title: PropTypes.string,
table: PropTypes.string,
year: PropTypes.number.isRequired,
affiliation: PropTypes.string,
complete_col: PropTypes.string,
};
  
  export default TaskTrackerCard;
  