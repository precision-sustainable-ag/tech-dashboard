import * as React from "react";
import { Grid, Button } from "@material-ui/core";
import { Context } from "../Store/Store";
import NewSiteEnrollmentModal from "./NewSiteEnrollmentModal";

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const SiteEnrollment = (props) => {
  const [state, dispatch] = React.useContext(Context);
  const [modalOpen, setModalOpen] = React.useState(true);
  const [defaultYear, setDefaultYear] = React.useState(2020);

  const handleEnrollNewSiteClick = () => {
    setModalOpen(!modalOpen);
  };

  React.useEffect(() => {
    // console.log(getCurrentYear());
    setDefaultYear(getCurrentYear());
  }, []);

  return (
    <div>
      <Grid container>
        <Grid item md={4}>
          <Button onClick={handleEnrollNewSiteClick} variant="contained">
            Enroll New Site
          </Button>
        </Grid>
      </Grid>
      <Grid container>
        <h4>Under Construction</h4>
        {/* <NewSiteEnrollmentModal
          open={modalOpen}
          handleClose={handleEnrollNewSiteClick}
          defaultYear={defaultYear}
        /> */}
      </Grid>
    </div>
  );
};

export default SiteEnrollment;
