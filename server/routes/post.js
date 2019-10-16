import express from 'express';
const router = express.Router();
import { getPostList, createPost, getPost, deletePost } from '../handlers/post';
import { commentOnPost, deleteComment } from '../handlers/comment';
import { likePost, unlikePost } from '../handlers/like';
import { authUser } from '../util/auth';
import {
  createNotification,
  deleteNotification
} from '../handlers/notification';

router.get('/', getPostList);
router.post('/', authUser, createPost);
router.get('/:postId', getPost);
router.delete('/:postId', authUser, deletePost);
router.get('/:postId/like', authUser, likePost, createNotification);
router.get('/:postId/unlike', authUser, unlikePost, deleteNotification);
router.post('/:postId/comment', authUser, commentOnPost, createNotification);
router.delete(
  '/:postId/uncomment',
  authUser,
  deleteComment,
  deleteNotification
);

export default router;
