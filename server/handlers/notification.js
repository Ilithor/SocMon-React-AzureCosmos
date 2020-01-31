import _ from 'lodash';
import Notification from '../models/notification.model';
import { create, getNotificationList } from '../services/notification.service';

import mongoConnection from '../util/mongo';
import { findNotificationAndUpdateRead } from './find';
mongoConnection();

/** Retrieves all notifications
 * @type {RouteHandler}
 */
export const getNotification = async (req, res) => {
  await getNotificationList()
    .then(data => {
      if (data.notification) {
        return res.status(404).json({ error: data.notification });
      }
      const notification = _.map(data, doc => ({
        notificationId: doc._id,
        createdAt: doc.createdAt,
        postId: doc.postId,
        sender: doc.sender,
        recipient: doc.recipient,
        type: doc.type,
        typeId: doc.typeId,
        read: doc.read,
      }));
      if (notification.length <= 0) {
        return res.json({ message: 'No notifications found' });
      } else {
        return res.json(notification);
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

/** Creates notification upon successful creation
 *  of a like or comment
 * @type {RouteHandler}
 */
export const createNotification = async (
  recipient,
  postId,
  sender,
  type,
  typeId
) => {
  if (sender === recipient) {
    return;
  }
  await create(recipient, postId, sender, type, typeId);
};

/** Marks notification as read by user
 * @type {RouteHandler}
 */
export const markNotificationRead = async (req, res) => {
  await findNotificationAndUpdateRead(req.body.notificationId)
    .then(() => {
      return res.status(200).json({ message: 'Notifications marked read' });
    })
    .catch(err => console.log);
};

/** Deletes notification upon successful deletion
 *  of a like or comment
 * @type {RouteHandler}
 */
export const deleteNotification = async (req, res) => {
  await Notification.findOneAndDelete({
    type: req.notification.type,
    typeId: req.notification.typeId,
  });
  return res
    .status(200)
    .json({ message: `${req.notification.type} successfully removed` });
};

/** Deletes all notifications that matches given postId
 * @type {RouterHandler}
 */
export const deleteAllNotification = async (req, res) => {
  await Notification.deleteMany({
    postId: req.params.postId,
  });
  return res.status(200).json({ message: 'Post successfully deleted' });
};
