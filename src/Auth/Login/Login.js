import React, { useState } from "react";
import {Paper, Grid, Button, Checkbox, TextField, FormControlLabel, makeStyles, Box} from "@material-ui/core";
import FlareComponent from "flare-react";
import { Face, Fingerprint } from "@material-ui/icons";
import "./Login.scss";
const Login = () => {
//   const classes = useStyles();
const [animationName, setAnimationName] = useState("idle");
const setUsernameFocus = () => {

    animationName === 'idle' ? setAnimationName('test') : setAnimationName('idle')
};
const setTypingFocus = () => {
    setAnimationName(animationName === 'idle' ? setAnimationName('test') : setAnimationName('idle'))
}
  return (
  <div className="container">
      <div className="center">
      <div className="animationWrapper"><FlareComponent transparent={true} width={640} height={480} animationName={animationName} file="login-bear.flr"/></div>
      <div className="formWrapper">
      <TextField
      onFocus={setUsernameFocus}
      onfocusout={setTypingFocus}
      
    type="text"
    label="Username"
    variant="outlined"
    color="secondary"
    style={{width: '100%'}}
  />
   <Box pb={2.5} />
        <TextField
        type="password"
    label="Password"
    variant="outlined"
    color="secondary"
    style={{width: '100%'}}
  />
      </div>
      </div>
    
  </div>
  );
};

export default Login;
