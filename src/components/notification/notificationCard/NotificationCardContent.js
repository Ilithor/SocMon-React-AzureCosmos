import React from 'react';
import dayjs from 'dayjs';

// MUI
import { CardContent, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import style from '../../../style';

// Icons
import * as Icon from '@material-ui/icons';

/** Displays individual notification content
 * @param {object} props
 * @param {object} props.classes
 * @param {string} props.postBody
 * @param {string} props.commentBody
 */
const NotificationCardContentView = ({
  classes = {},
  notification = {},
  postBody,
  commentBody,
}) => {
  const NotificationContent = ({ type, postBody, commentBody }) => {
    if (type === 'like') {
      return <React.Fragment>"{postBody}"</React.Fragment>;
    }
    return <React.Fragment>"{commentBody}"</React.Fragment>;
  };
  const NotificationNew = ({ classes, read }) => {
    if (read === false) {
      return (
        <React.Fragment>
          <Icon.FiberNew className={classes?.cornerIcon} />
        </React.Fragment>
      );
    }
    return null;
  };
  const FromSenderType = ({ type, sender }) => {
    if (type === 'like') {
      return <Typography color='primary'>{sender} liked your post!</Typography>;
    }
    if (type === 'comment') {
      return (
        <Typography color='primary'>
          {sender} commented on your post!
        </Typography>
      );
    }
  };
  return (
    <CardContent className={classes?.content}>
      <NotificationNew classes={classes} read={notification?.read} />
      <FromSenderType type={notification?.type} sender={notification?.sender} />
      <NotificationContent
        type={notification?.type}
        postBody={postBody}
        commentBody={commentBody}
      />
      <br />
      <Typography variant='body2' color='textSecondary'>
        {dayjs(notification?.createdAt).fromNow()}
      </Typography>
    </CardContent>
  );
};

export const NotificationCardContent = withStyles(style)(
  NotificationCardContentView
);