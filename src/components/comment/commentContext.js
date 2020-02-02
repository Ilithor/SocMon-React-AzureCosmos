import React, { createContext, useContext, useState } from 'react';
import _ from 'lodash';

import * as fetchUtil from '../../util/fetch';

/** @type {React.Context<{commentList:Comment[],commentError:Error,getData:()=>void}} */
const commentContext = createContext();

/** This is a react component which you wrap your entire application
 * to provide a "context", meaning: data you can access anywhere in the app.
 *
 * @param {object} props
 * @param {React.ReactChild} props.children
 */
export const CommentProvider = ({ children }) => {
  const [commentError, setCommentError] = useState();
  const [lastRefreshCommentList, setLastRefreshCommentList] = useState();
  const [commentList, setCommentList] = useState();
  const [commentListOnPost, setCommentListOnPost] = useState();
  const [isLoadingCommentList, setIsLoadingCommentList] = useState(false);
  const [isLoadingCommentOnPost, setIsLoadingCommentOnPost] = useState(false);
  const [isLoadingDeleteComment, setIsLoadingDeleteComment] = useState(false);

  const refreshCommentList = () =>
    new Promise((resolve, reject) => {
      if (!isLoadingCommentList) {
        setIsLoadingCommentList(true);
        // Fetch list of comments
        fetchUtil.post
          .fetchCommentList()
          .then(res => {
            setCommentList(_.keyBy(res.data, 'commentId'));
          })
          .catch(err => {
            setCommentError(err);
            reject(err);
          })
          .finally(() => {
            setLastRefreshCommentList(Date.now);
            setIsLoadingCommentList(false);
            resolve();
          });
      }
    });

  const refreshCommentListOnPost = postId => {
    if (!isLoadingCommentList && commentList) {
      setIsLoadingCommentList(true);
      const commentData = _.filter(
        commentList,
        comment => comment?.postId === postId
      );
      setCommentListOnPost(commentData);
      setIsLoadingCommentList(false);
    }
  };

  const commentOnPost = (postId, commentData) =>
    new Promise((resolve, reject) => {
      if (postId && commentData && !isLoadingCommentOnPost) {
        setIsLoadingCommentOnPost(true);
        fetchUtil.post
          .commentOnPost(postId, commentData)
          .then(() => {
            refreshCommentList();
          })
          .catch(err => {
            setCommentError(err);
            reject(err);
          })
          .finally(() => {
            setIsLoadingCommentOnPost(false);
            resolve();
          });
      }
    });

  const deleteComment = commentId =>
    new Promise((resolve, reject) => {
      if (commentId && !isLoadingDeleteComment) {
        setIsLoadingDeleteComment(true);
        fetchUtil.post
          .deleteComment(commentId)
          .then(() => {
            refreshCommentList();
          })
          .catch(err => {
            setCommentError(err);
            reject(err);
          })
          .finally(() => {
            setIsLoadingDeleteComment(false);
            resolve();
          });
      }
    });

  // Passing state to value to be passed to provider
  const value = {
    commentError,
    commentList,
    isLoadingCommentOnPost,
    commentOnPost,
    refreshCommentList,
    lastRefreshCommentList,
    deleteComment,
    refreshCommentListOnPost,
    commentListOnPost,
  };
  return (
    <commentContext.Provider value={value}>{children}</commentContext.Provider>
  );
};

export const useCommentData = () => {
  const ctx = useContext(commentContext);

  if (ctx === undefined) {
    throw new Error('useCommentData must be used within a CommentProvider');
  }

  const { deleteComment, isLoadingDeleteComment } = ctx;

  return { deleteComment, isLoadingDeleteComment };
};

/** A hook for consuming our Comment context in a safe way
 *
 * @example //getting the comment list
 * import { useCommentListData } from 'commentContext'
 * const { commentList } = useCommentListData();
 * @returns {Comment[]}
 */
export const useCommentListData = () => {
  // Destructuring value from provider
  const ctx = useContext(commentContext);

  if (ctx === undefined) {
    throw new Error('useCommentListData must be used within a CommentProvider');
  }
  const {
    commentList,
    commentError,
    refreshCommentList,
    lastRefreshCommentList,
    isLoadingCommentList,
    refreshCommentListOnPost,
    commentListOnPost,
  } = ctx;

  if (
    !isLoadingCommentList &&
    (!lastRefreshCommentList || lastRefreshCommentList + 600 <= Date.now)
  ) {
    refreshCommentList();
  }

  // What we want this consumer hook to actually return
  return {
    commentList,
    commentError,
    refreshCommentList,
    refreshCommentListOnPost,
    commentListOnPost,
  };
};

export const useCommentOnPostData = () => {
  const ctx = useContext(commentContext);

  if (ctx === undefined) {
    throw new Error(
      'useCommentOnPostData must be used within a CommentProvider'
    );
  }
  const { commentError, commentOnPost, isLoadingCommentOnPost } = ctx;

  return { commentError, isLoadingCommentOnPost, commentOnPost };
};

/**
 * @typedef Comment
 * @property {string} _id
 * @property {string} userHandle
 * @property {string} postId
 * @property {string} body
 * @property {Date} createdAt
 */
