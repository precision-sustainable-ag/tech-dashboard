import React, {Component, useState, useContext, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, withMobileDialog, InputAdornment, Box, CircularProgress } from '@material-ui/core';
import { Lock, Fingerprint, Person } from "@material-ui/icons";
import { Context } from '../../Store/Store';
import { Redirect } from 'react-router-dom';
import Loading from 'react-loading';
const Login = () => {
 const [state, dispatch] = useContext(Context);
 const [loading, setLoading] = useState(false);
 
    const handleLogin = () => {
      console.log('hey');
      setLoading(true)
      // dispatch({
      //   type: 'CHECK_USERNAME_PASSWORD',
      //   data: {
      //     username: 'hey',
      //     password: 'hey'
      //   }
      // })
    };
    return state.loggedIn ? <Redirect to="/landing" /> : (
      loading ? (<CircularProgress size={2} style={{
        position: 'absolute',
        paddingTop: '15%',      
        width: '100%',
        height: '100%',
        zIndex: 1000,
        backgroundColor: '#000000',
        opacity: 0.5,
        textAlign: 'center',
      }} />) : (
<Dialog 
        open 
        >
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
           Welcome to Precision Sustainable Agriculture Tech Dashboard. You would require a username and password to login and access the dashboard.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            InputProps={{
              startAdornment: (<InputAdornment><Person /> </InputAdornment>)
            }}
          />
          <Box pt={2} />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="text"
            fullWidth
            InputProps={{
              startAdornment: (<InputAdornment><Lock /> </InputAdornment>)
            }}
          />

        </DialogContent>

        
        <DialogActions>
         { (<Button onClick={handleLogin} color="primary">
            Log In
          </Button>)
         } 
        </DialogActions>
      </Dialog>
      )
      
    );
  
}

export default withMobileDialog()(Login);