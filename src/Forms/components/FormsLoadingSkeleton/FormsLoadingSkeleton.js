// Dependency Imports
import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

// Local Imports
// import './FormsSkeletonWrapper.scss';
import { SkeletonWrapper } from './FormsLoadingSkeletonStyledComponents';

// Default function
const FormsLoadingSkeleton = () => {
  return (
    <SkeletonWrapper>
      <Skeleton variant="rect" height="200px" width="200px" />
      <Skeleton variant="rect" height="200px" width="200px" />
      <Skeleton variant="rect" height="200px" width="200px" />
      <Skeleton variant="rect" height="200px" width="200px" />
      <Skeleton variant="rect" height="200px" width="200px" />
      <Skeleton variant="rect" height="200px" width="200px" />
      <Skeleton variant="rect" height="200px" width="200px" />
    </SkeletonWrapper>
  );
};

export default FormsLoadingSkeleton;
