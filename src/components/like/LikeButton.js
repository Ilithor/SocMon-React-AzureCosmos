import React, { useRef } from 'react';

// Components
import { CustomButton } from '../../util/CustomButton';

// Icons
import * as Icon from '@material-ui/icons';

// Context
import { usePostData } from '../post/postContext';
import { useLikeData } from './likeContext';

/** View component for displaying an icon to like a post
 * @type {React.FunctionComponent}
 * @param {Object} props
 * @param {String} props.postId
 */
export const LikeButton = ({ postId }) => {
  const { refreshPostList } = usePostData();
  const { refreshLikeList, likePost } = useLikeData();
  const makeCall = useRef(false);
  const onClick = () => {
    if (makeCall.current) return;
    makeCall.current = true;
    likePost(postId).then(() => {
      Promise.all([refreshPostList(), refreshLikeList()]).then(() => {
        makeCall.current = false;
      });
    });
  };

  return (
    <CustomButton tip='Like' onClick={onClick} disabled={makeCall.current}>
      <Icon.FavoriteBorder color='primary' />
    </CustomButton>
  );
};

/**
 * @typedef ILikeButtonComponentProps
 * @param {string} postId
 */
