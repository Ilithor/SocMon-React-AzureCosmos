import _ from 'lodash';
import {
  getList,
  getLikeList,
  register,
  login,
  updateBio,
} from '../services/user.service';
import { generateUserToken } from './token';
import { dataUri } from '../util/multer';
import {
  findById,
  findUserAndUpdateImage,
  findLikeByHandle,
  findByHandle,
  findPostByHandle,
  findAndUpdatePostImage,
} from './find';

/** Retrieves the list of users
 * @type {RouteHandler}
 */
export const getUserList = (req, res, next) => {
  getList()
    // Retrieves a list of users, and
    // populates them in an array
    .then(data => {
      if (data.user) {
        return res.status(404).json({ error: data.user });
      }
      const userList = _.map(data, user => ({
        handle: user.handle,
        userImage: user.bio.image,
        createdAt: user.createdAt,
        aboutMe: user.bio.aboutMe,
        location: user.bio.location,
        website: user.bio.website,
      }));
      if (userList.length <= 0) {
        return res.json({ message: 'No users found' });
      } else {
        // Returns list of users in array
        return res.json(userList);
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

export const fetchLikeList = async (req, res) => {
  getLikeList()
    .then(data => {
      if (data.like) {
        return res.status(404).json({ error: data.like });
      }
      const likeList = _.map(data, like => ({
        userHandle: like.userHandle,
        postId: like.postId,
      }));
      if (likeList.length <= 0) {
        return res.json({ message: 'No likes found' });
      } else {
        // Returns list of likes in array
        return res.json(likeList);
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

/** Registers the user
 * @type {RouteHandler}
 */
export const registerUser = async (req, res, next) => {
  await register(req.body)
    .then(async data => {
      // If function returns object, user
      // failed validation checks
      if (!data.id) {
        return res.status(400).json({
          error: data,
        });
      } else {
        // If pass validation, generate user token
        const token = await generateUserToken(data).then(() => {
          if (token) {
            // Returns user token
            return res.status(201).json({
              token,
            });
          } else {
            res.json(500).json({ message: 'Failed to create token' });
          }
        });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        general: 'Something went wrong, please try again',
      });
    });
};

/** Logins the user
 * @type {RouteHandler}
 */
export const loginUser = async (req, res, next) => {
  await login(req.body)
    .then(data => {
      // If function does not return a string,
      // user failed validation checks
      if (typeof data.token !== 'string') {
        return res.status(403).json({
          error: data,
        });
      } else {
        const token = data.token;
        const handle = data.handle;
        // Returns user token
        if (token && handle) {
          return res.json({
            token,
            handle,
          });
        } else {
          return res.status(500).json({ message: 'Failed to login user' });
        }
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(403).json({
        general: 'Wrong credentials, please try again',
      });
    });
};

/** Get own user details
 * @type {RouteHandler}
 */
export const getAuthenticatedUser = async (req, res) => {
  const userData = {};
  userData.user = req.user;
  return await findLikeByHandle(userData._id)
    .then(arr => {
      if (arr.like) {
        return res.status(404).json({ error: arr.like });
      }
      userData.like = arr;
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

/** Retrieves any user details
 * @type {RouteHandler}
 */
export const getUserDetail = async (req, res) => {
  const { handle } = req.params; // this is called destructuring
  const userData = {};
  await findByHandle(handle).then(async user => {
    if (user.user) {
      //recursion check & block
      return res.status(500).json({ error: user.user });
    } else {
      userData.user = user;
      findLikeByHandle(handle)
        .then(async data => {
          userData.like = data;
          await findPostByHandle(handle).then(async post => {
            res.json(await pushPostIntoArray(post, userData));
          });
        })
        .catch(err => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        });
    }
  });
};

/** Pushes post docs into post array
 * @param {Document[]} post
 * @param {object} userData
 * @returns {userData[object]}
 */
const pushPostIntoArray = (post, userData) => {
  userData.post = [];
  _.map(post, doc => {
    userData.post.push({
      body: doc.body,
      createdAt: doc.createdAt,
      userHandle: doc.userHandle,
      userImage: doc.userImage,
      likeCount: doc.likeCount,
      commentCount: doc.commentCount,
      postId: doc._id,
    });
  });
  return userData;
};

/** Edits the current user's profile with the params provided by said user
 * @type {RouteHandler}
 */
export const addUserDetail = async (req, res, next) => {
  const userParam = req.body;
  const userId = req.user._id;

  if (!userParam.aboutMe && !userParam.website && !userParam.location) {
    return res
      .status(400)
      .json({ message: 'At least one valid input is needed' });
  }
  await updateBio(userParam, userId)
    .then(async success => {
      if (success === true) {
        return res.status(200).json({
          message: 'Profile updated successfully',
        });
      } else {
        return res.status(500).json({ message: 'Something went wrong' });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({
        error: err.code,
      });
    });
};

/** Converts the uploaded image to base64 and uploads it as a property in the User doc
 * @type {RouteHandler}
 */
export const imageUpload = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'No image provided',
    });
  }
  const _id = req.user._id;
  const base64 = (await dataUri(req)).content;
  await findUserAndUpdateImage(_id, base64)
    .then(async () => {
      await findById(_id).then(async doc => {
        if (doc.bio.image === base64) {
          return res
            .status(200)
            .json({ message: 'Image uploaded successfully' });
        }
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        error: err.code,
      });
    });
};
