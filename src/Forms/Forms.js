import React, { useEffect, useState, useContext } from "react";
import getAllKoboAssets from "./KoboFormAuth";
import Skeleton from "@material-ui/lab/Skeleton";
import FormsLoadingSkeleton from "./FormsLoadingSkeleton";
import { Context } from "../Store/Store";
import {
  Typography,
  makeStyles,
  Card,
  CardContent,
  Paper,
  Box
} from "@material-ui/core";
import "./Forms.scss";
import { bannedRoles } from "../utils/constants";
const useStyles = makeStyles({
  card: {
    maxWidth: 400,
    width: 300
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

const Forms = () => {
  const classes = useStyles();

  const [isPSALoading, setIsPSALoading] = useState(true);
  const [isPSASSGLoading, setIsPSASSGLoading] = useState(true);
  const [showForms, setShowForms] = useState(false);
  const [state, dispatch] = useContext(Context);

  useEffect(() => {
    if (bannedRoles.includes(state.userRole)) {
      setShowForms(false);
    } else {
      console.log("hello from forms");

      getAllKoboAssets("psa")
        .then(response => {
          setIsPSALoading(false);
          // console.log(data);

          dispatch({
            type: "SET_PSA_FORMS",
            data: response.data.results
          });
        })
        .then(async () => {
          await getAllKoboAssets("psassg").then(response => {
            setIsPSASSGLoading(false);
            dispatch({
              type: "SET_PSASSG_FORMS",
              data: response.data.results
            });
          });
        });
      setShowForms(true);
    }
  }, [state.userRole]);

  return showForms ? (
    <Paper elevation={0}>
      <Box className="koboFormsWrapper">
        <Typography variant="h5" className="mb-2">
          PSA Forms
        </Typography>
        {isPSALoading ? (
          <FormsLoadingSkeleton />
        ) : state.psaForms.length !== 0 ? (
          <div className="koboForms">
            {state.psaForms.map((form, index) =>
              form.name !== "" && form.deployment__active ? (
                <Card className={classes.card} variant="outlined" key={index}>
                  <CardContent>
                    <Typography variant="body1">{form.name}</Typography>
                    <Typography variant="body2">
                      Total Submission Count:{" "}
                      {form.deployment__submission_count}
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                ""
              )
            )}
          </div>
        ) : (
          ""
        )}
        <Typography variant="h5" className="mt-2">
          Social Science Group Forms
        </Typography>
        {isPSASSGLoading ? (
          <FormsLoadingSkeleton />
        ) : state.psassgForms.length !== 0 ? (
          <div className="koboForms">
            {state.psassgForms.map((form, index) =>
              form.name !== "" && form.deployment__active ? (
                <Card className={classes.card} variant="outlined" key={index}>
                  <CardContent>
                    <Typography variant="body1">{form.name}</Typography>
                    <Typography variant="body2">
                      Total Submission Count:{" "}
                      {form.deployment__submission_count}
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                ""
              )
            )}
          </div>
        ) : (
          ""
        )}
      </Box>
    </Paper>
  ) : (
    <Box component={Paper} elevation={0}>
      <Typography variant={"h6"} align="center">
        Your access level does not permit this action.
      </Typography>
    </Box>
  );
};

export default Forms;
