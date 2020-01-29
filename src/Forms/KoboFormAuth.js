import Axios from 'axios';


const getAllKoboAssets = async(who) => {

switch(who) {
    case 'psa' : return await Axios.get('http://13.72.51.225/api/kobo.php?get=assets&for=psa');
    case 'psassg' : return await Axios.get('http://13.72.51.225/api/kobo.php?get=assets&for=psassg');
}
  

   
    
};



export default getAllKoboAssets;