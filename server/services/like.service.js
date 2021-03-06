import { Like } from '../models/like.model';

/** Create Like document
 *
 * @param {Request} likeParam
 * @returns {Promise<LikeData>}
 */
export const create = async likeParam => {
  // Construct needed properties for the document
  const newLike = new Like({
    userHandle: likeParam.user.userHandle,
    postId: likeParam.params.postId,
  });

  // Save the like
  await newLike.save();
  return newLike;
};

/** Deletes Like document
 *
 * @param {string} userHandle
 * @param {string} postId
 * @returns {Promise<LikeData>}
 */
export const remove = async (userHandle, postId) => {
  return await Like.findOneAndDelete({ userHandle, postId }).catch(err => {
    console.error(err);
    return Promise.reject(err);
  });
};
