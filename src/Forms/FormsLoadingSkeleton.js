//Dependency Imports
import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton';

//Local Imports
import "./FormsSkeletonWrapper.scss";

const FormsLoadingSkeleton = () => {

    return(
        <div className="skeletonWrapper">
        <Skeleton variant="rect" height="200px" width="200px" />
        <Skeleton variant="rect" height="200px" width="200px" />
        <Skeleton variant="rect" height="200px" width="200px" />
        <Skeleton variant="rect" height="200px" width="200px" />
        <Skeleton variant="rect" height="200px" width="200px" />
        <Skeleton variant="rect" height="200px" width="200px" />
        <Skeleton variant="rect" height="200px" width="200px" />
        </div>
    );

};

export default FormsLoadingSkeleton;