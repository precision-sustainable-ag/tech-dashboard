import {
    CardContent,
    Divider,
    Typography,
    TextField,
    Chip,
    Grid,
  } from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useEffect, useContext, useState } from "react";
// import { onfarmAPI } from "../utils/api_secret";
import { Context } from "../Store/Store";

// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
//   }; 

const TaskTrackerCard1 = (props) => {
    let title = props.title;
    let table = props.table;
    let year = props.year;
    let affiliation = props.affiliation;
    let code = props.code;
    // let list_code = props.list_code;
    let time = props.time;

    if (affiliation=="all") {
        affiliation="";
    }
    let complete_col = props.complete_col;
    if(code=="all") {
      code="";
    }

    const [state] = useContext(Context);
    const [codes, setCodes] = useState([]);
    
    // const [total, setTotal] = useState([]);
    // const [complete, setComplete] = useState([]);
    // const [missing, setMissing] = useState([]);
    // const [unavailable, setUnavailable] = useState([]);
    // // const [res, responsetext] = useState([]);
    // const [open, setOpen] = React.useState(false);
    // const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);

    // const totalvalue=()=>{
    //     return total;
    // };
    // const completevalue=()=>{
    //     return complete.length;
    // };
    // const missingvalue=()=>{
    //     return missing.length;
    // };
    // const unavailablevalue=()=>{
    //     return unavailable.length;
    // };
    // const resvalue=()=>{
    //     return res;
    // };
    // const completetext=()=>{
    //     return complete;
    // };
    // const [fetching, setFetching] = useState(true);
    useEffect(() => {      
      const fetchData = async (apiKey) => {
        // console.log('http://localhost:1000/onfarm/raw?table='+table+'&complete_count='+complete_col+'&affiliation='+affiliation+'&year='+year+'&code='+code);
          const response = await fetch(`http://localhost:1000/onfarm/raw?table=${table}&complete_count=${complete_col}&affiliation=${affiliation}&year=${year}&code=${code}&time=${time}`, {
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
            const map = new Map();
              for(let i=0;i<response.length;i++){
                
                if(map.has(response[i].code)){
                  
                  response[i].bgcolor='yellow';
                  response[i].col='black';
                  response.splice(map.get(response[i].code),1);
                  i--;
                }
                else{
                  if(response[i].flag=='1'){
                    response[i].bgcolor='green';
                    response[i].col='white';
                  }
                  else if(response[i].flag=='0'){
                    response[i].bgcolor='gray';
                    response[i].col='black';
                  }
                  else if(response[i].flag=='-1'){
                    response.splice(i,1);
                  }
                  map.set(response[i].code, i);
                }
              }
              map.clear();
              setCodes(response);
          })
          .catch((e) => {
            console.error(e);
          });
      }
  }, [state.userInfo.apikey, year, affiliation, code]);

    // useEffect(() => {
    //     const fetchData = async (apiKey) => {
    //         const response = await fetch(`http://localhost:1000/onfarm/raw?table=${table}&complete_count=${complete_col}&affiliation=${affiliation}&year=${year}`, {
    //             headers: {
    //           "x-api-key": apiKey,
    //         },
    //       });
    //       const data = await response.json();
    //       return data;
    //     };
    //     if (state.userInfo.apikey) {
    //     //   setFetching(true);
    //       fetchData(state.userInfo.apikey)
    //         .then((response) => {
    //         //   responsetext(response);
    //         //   let complete=[];
    //         //   let missing=[];
    //         //   let unavailable=[];
    //         //   setTotal(response.length);
    //         // for(let i=0;i<response.length;i++) {
    //         //     if(response[i].flag==1){
    //         //         complete.push(response[i].code+"="+response[i].count+" ");
    //         //     }
    //         //     else if(response[i].flag==0){
    //         //         missing.push(response[i].code+" = "+response[i].count);
    //         //     }
    //         //     else if(response[i].flag==-1){
    //         //         unavailable.push(response[i].code+" = "+response[i].count);
    //         //     }
    //         // }
    //         // setComplete(complete);
    //         // setMissing(missing);
    //         // setUnavailable(unavailable);
    //         })
    //         .catch((e) => {
    //           console.error(e);
    //         });
    //     }
    //   }, [state.userInfo.apikey, year, affiliation]);

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
          <Grid item xs={12}>
            <Grid container spacing={1}>
            {codes &&
                codes.length > 0
                ? codes.map((siteinfo, index) => (
                <Grid item spacing={3} key={`newSites-${index}`}>
                    <Chip
                        label={siteinfo.code} color="primary" size="small" style={{backgroundColor:siteinfo.bgcolor, color:siteinfo.col}}
                        >
                        <Typography variant="body2">{siteinfo.code}</Typography>
                    </Chip>
                </Grid>
                ))
                : ""}
            </Grid>
          </Grid>
        </CardContent>

        </>
    );
  };

  
TaskTrackerCard1.propTypes = {
title: PropTypes.string,
table: PropTypes.string,
year: PropTypes.number.isRequired,
affiliation: PropTypes.string,
code: PropTypes.string,
list_code: PropTypes.array,
complete_col: PropTypes.string,
time: PropTypes.string,
};
  
  export default TaskTrackerCard1;
  