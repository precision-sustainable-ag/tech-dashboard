import React, {useEffect} from 'react'
import { getAllKoboAssets } from './KoboFormAuth';


const Forms = () => {

useEffect(() => {
    getAllKoboAssets('PSA')
    
    return () => {
        // cleanup
    };
}, [])
    return(
        <div>
            <div>FORMS</div>
        </div>
    );

};

export default Forms;