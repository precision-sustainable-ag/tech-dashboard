/* eslint-disable */
import React, { useMemo, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import CPUHealthChart from './CPUHealthChart';
import SDSpaceChart from './SDSpaceChart';

const StressCamVisuals = (/* props */) => {
    const history = useHistory();
    const data = history.location.state.data;
    
    let hash = {};
    data.forEach(element => {
        hash['P_WS_0'] ? hash['P_WS_0'].push(element.probabilities?.P_WS_0) : hash['P_WS_0'] = [element.probabilities?.P_WS_0];
        hash['P_WS_1'] ? hash['P_WS_1'].push(element.probabilities?.P_WS_1) : hash['P_WS_1'] = [element.probabilities?.P_WS_1];
        hash['P_WS_2'] ? hash['P_WS_2'].push(element.probabilities?.P_WS_2) : hash['P_WS_2'] = [element.probabilities?.P_WS_2];
        hash['P_WS_3'] ? hash['P_WS_3'].push(element.probabilities?.P_WS_3) : hash['P_WS_3'] = [element.probabilities?.P_WS_3];
        hash['P_WS_4'] ? hash['P_WS_4'].push(element.probabilities?.P_WS_4) : hash['P_WS_4'] = [element.probabilities?.P_WS_4];
        hash['P_WS_5'] ? hash['P_WS_5'].push(element.probabilities?.P_WS_5) : hash['P_WS_5'] = [element.probabilities?.P_WS_5];
    });

    let seriesOptions = [],
    // seriesCounter = 0,
    names = Object.keys(hash);

    names.forEach((name) => {
        seriesOptions.push({name: name, data: hash[name]});
    });

    return (
        <div>
            <CPUHealthChart data={data} />
            <SDSpaceChart data={data}/>
        </div>
    );
};

export default StressCamVisuals;
