import express from 'express';
import {
  getUserList,
  registerUser,
  loginUser,
  imageUpload,
  addUserDetail,
  getAuthenticatedUser,
  getUserDetail,
  fetchLikeList,
  saltExistingPassword,
  deleteUser,
} from '../handlers/user';
import { isAdmin, authUser } from '../util/auth';
import {
  getNotification,
  markNotificationRead,
  deleteNotification,
} from '../handlers/notification';
import { multerUploads } from '../util/multer';

const router = express.Router();

router.get('/', authUser, getAuthenticatedUser);
router.post('/', authUser, addUserDetail);
router.get('/list', getUserList);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/image', authUser, multerUploads, imageUpload);
router.get('/like', fetchLikeList);
router.get('/notification', authUser, getNotification);
router.post('/notification', authUser, markNotificationRead);
router.delete('/notification/:notificationId', authUser, deleteNotification);
router.get('/:userHandle', getUserDetail);
router.delete('/:userHandle', authUser, deleteUser);

export default router;
