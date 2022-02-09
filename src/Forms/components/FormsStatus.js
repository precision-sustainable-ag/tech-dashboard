import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import { Storage } from '@material-ui/icons';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

const FormsStatus = ({ form }) => {
  const history = useHistory();
  // const loadRoute = useCallback(() => history.push(`/kobo-forms/${form.uid}`), [
  //   history,
  //   form.uid,
  // ]);

  const loadRoute = useCallback(
    () =>
      history.push({
        pathname: `/kobo-forms/${form.uid}`,
        state: { name: form.name },
      }),
    [form.name, form.uid, history],
  );

  return (
    <ListItem
      button
      disabled={form.deployment__submission_count === 0}
      onClick={loadRoute}
      component="li"
    >
      <ListItemAvatar>
        <Avatar>
          <Storage />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={form.name}
        secondary={form.deployment__submission_count === 0 && 'No Submissions'}
      />
    </ListItem>
  );
};
export default FormsStatus;

FormsStatus.propTypes = {
  form: PropTypes.object,
};
