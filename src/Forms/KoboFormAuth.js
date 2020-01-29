

const getAllKoboAssets = (who) => {

    const KoboApiEndpoint = "https://kf.kobotoolbox.org";
    const urlEnd = "?format=json";
    let finalURL = "";
    const assetURL = `${KoboApiEndpoint}/assets/`;
    finalURL = assetURL + urlEnd; 

console.log('headers',{headers: getKoboHeader('psa')});

    // if(who === 'PSA') {
    //     return await fetch(finalURL, {headers: getKoboHeader('psa')});
    // } else if(who === 'PSASSG') {
    //     return await fetch(finalURL, {headers: getKoboHeader('psasg')});
    // } else {
    //     return false;
    // }
   
    
};

const getKoboHeader =  (who) => {
    const psaSocialScienceToken = "730aaeb5958fd9fbe6be472b1c6a85a6cefce745";
    const psaRegularToken = "07c51777e5301aa6a6600470a88ab92742ebbe4a";
    const headers = new Headers();

    if(who === 'psasg') {
        headers.append('Authorization', `Token ${psaSocialScienceToken}`)
        // headers.append()
    } else if(who === 'psa') {
        headers.append('Authorization', `Token ${psaRegularToken}`)
    } else { headers.append('Authorization', 'failedauth')}


    return headers;

};

export {getAllKoboAssets};