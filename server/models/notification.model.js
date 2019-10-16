import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const NotificationSchema = Schema({
  createdAt: Date,
  read: { type: Boolean, required: true },
  recipient: { type: String, required: true },
  postId: { type: String, required: true },
  sender: { type: String, required: true },
  type: { type: String, required: true },
  typeId: { type: String, required: true }
});

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;
