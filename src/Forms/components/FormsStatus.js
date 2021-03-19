import {
  Avatar,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import { Storage } from "@material-ui/icons";
import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";

const FormsStatus = ({ form }) => {
  const history = useHistory();
  const loadRoute = useCallback(() => history.push(`/kobo-forms/${form.uid}`), [
    history,
    form.uid,
  ]);

  return (
    <ListItem
      button
      disabled={form.deployment__submission_count === 0}
      onClick={loadRoute}
    >
      <ListItemAvatar>
        <Avatar>
          <Storage />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        style={{ overflowX: "scroll" }}
        primary={form.name}
        secondary={`${form.deployment__submission_count} submissions`}
      />
    </ListItem>
  );
};
export default FormsStatus;
//        <Grid item key={`psa-${index}`}>
//           <Card variant="outlined">
//             <CardHeader title={form.name} />
//             <CardContent className={classes.cardContent}>
//               {/* <Typography variant="body1">{form.name}</Typography> */}
//               <Typography variant="body2">
//                 Total Submission Count:{" "}
//                 {form.deployment__submission_count}
//               </Typography>
//             </CardContent>
//             <CardActions>
//               <Button
//                 disabled={form.deployment__submission_count === 0}
//                 size="small"
//                 variant="text"
//                 onClick={() => {
//                   setOpenAsset({ ...form, userType: "psa" });
//                   handleClickOpen(true);
//                 }}
//               >
//                 All Submissions
//               </Button>
//             </CardActions>
//           </Card>
//         </Grid>
//       ) : (
//         ""
//       )
//     )}
//   </Grid>
