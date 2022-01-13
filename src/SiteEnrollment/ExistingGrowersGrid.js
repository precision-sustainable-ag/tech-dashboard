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
} from "@material-ui/core";
import { Check, Save } from "@material-ui/icons";
// import Axios from "axios";
import React from "react";
import PropTypes from "prop-types";

// Local Imports
// import { apiPassword, apiURL, apiUsername } from "../utils/api_secret";
import { ucFirst } from "../utils/constants";

// Helper functions
const ExistingGrowersGrid = ({
  allGrowers = [],
  growerLastName = "",
  enrollmentData = {},
  setEnrollmentData = {},
}) => {
  console.log(allGrowers);

  if (allGrowers[0]) {
    // return (
    return allGrowers.map((grower) => (
      <Grid item key={grower.codes} sm={6} md={3}>
        <Card>
          <CardHeader
            avatar={<Avatar>{grower.last_name.charAt(0).toUpperCase()}</Avatar>}
            title={ucFirst(grower.last_name)}
          />
          <CardContent>
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
                <Typography variant="body2">
                  {grower.codes && grower.codes.length > 0
                    ? grower.codes.toString()
                    : "No Sites"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color={
                enrollmentData.growerInfo.producerId === grower.producer_id
                  ? "primary"
                  : "default"
              }
              variant="contained"
              onClick={() => {
                setEnrollmentData({
                  ...enrollmentData,
                  growerInfo: {
                    producerId: grower.producer_id,
                    collaborationStatus: grower.collaboration_status
                      ? grower.collaboration_status
                      : "University",
                    phone: grower.phone,
                    lastName: grower.last_name,
                    email: grower.email,
                  },
                });
              }}
              startIcon={
                enrollmentData.growerInfo.producerId === grower.producer_id ? (
                  <Check />
                ) : (
                  <Save />
                )
              }
            >
              {enrollmentData.growerInfo.producerId === grower.producer_id
                ? "Selected"
                : "Select"}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ));
  } else if (growerLastName.length === 0) {
    return "";
  } else {
    return <Typography variant="body1">Grower Not Found</Typography>;
  }
};

// const fetchSiteCodesForProducer = async (producerId) => {
//   return await Axios({
//     url: `${apiURL}/api/retrieve/site/codes/by/producer/${producerId}`,
//     method: "get",
//     auth: {
//       username: apiUsername,
//       password: apiPassword,
//     },
//   });
// };

ExistingGrowersGrid.propTypes = {
  allGrowers: PropTypes.array,
  growerLastName: PropTypes.string,
  enrollmentData: PropTypes.object,
  setEnrollmentData: PropTypes.func,
  allSiteCodes: PropTypes.object,
};

export default ExistingGrowersGrid;
