import React, { useContext } from 'react'
import { Context } from '../Store/Store';


const LandingComponent = () => {

    const [state, dispatch] = useContext(Context);

    return(
        <div>
            <div><h4>Landing</h4></div>
        </div>
    );

};


export default LandingComponent;