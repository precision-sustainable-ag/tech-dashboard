// Dependency Imports
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Check, Save } from '@material-ui/icons';
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setEnrollmentData } from '../../../Store/actions';

// Local Imports
import { ucFirst } from '../../../utils/constants';

const useStyles = makeStyles(() => ({
  cardHeight: {
    height: '100%',
  },
  cardContent: {
    height: '60%',
  },
  cardHeaderFooter: {
    height: '20%',
  },
}));

// Helper functions
const ExistingGrowersGrid = ({ allGrowers = [], growerLastName = '' }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const enrollmentData = useSelector((state) => state.enrollmentData.data);

  return allGrowers.length > 0 ? (
    allGrowers.map((grower, index) => {
      return (
        <Grid item key={`existing-grower-${index}`} sm={6} md={3} className={classes.cardHeight}>
          <Card className={classes.cardHeight}>
            <CardHeader
              avatar={<Avatar>{grower.last_name.charAt(0).toUpperCase()}</Avatar>}
              title={ucFirst(grower.last_name)}
              className={classes.cardHeaderFooter}
            />

            <CardContent className={classes.cardContent}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">Producer ID</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{grower.producer_id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Email</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{grower.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Phone</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{grower.phone}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Site Code</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{grower.codes.split('.').join(', ')}</Typography>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions className={classes.cardHeaderFooter}>
              <Button
                size="small"
                color={
                  enrollmentData.growerInfo.producerId === grower.producer_id
                    ? 'primary'
                    : 'default'
                }
                variant="contained"
                onClick={() => {
                  dispatch(
                    setEnrollmentData({
                      ...enrollmentData,
                      growerInfo: {
                        producerId: grower.producer_id,
                        collaborationStatus: grower.collaboration_status
                          ? grower.collaboration_status
                          : 'University',
                        phone: grower.phone,
                        lastName: grower.last_name,
                        email: grower.email,
                      },
                    }),
                  );
                }}
                startIcon={
                  enrollmentData.growerInfo.producerId === grower.producer_id ? <Check /> : <Save />
                }
              >
                {enrollmentData.growerInfo.producerId === grower.producer_id
                  ? 'Selected'
                  : 'Select'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      );
    })
  ) : growerLastName.length === 0 ? (
    ''
  ) : (
    <Typography variant="body1">Grower Not Found</Typography>
  );
};

ExistingGrowersGrid.propTypes = {
  allGrowers: PropTypes.array,
  growerLastName: PropTypes.string,
};

export default ExistingGrowersGrid;
