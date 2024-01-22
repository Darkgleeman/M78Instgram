import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  getPostByID, postIDLikedByUserID,
  postIDHiddenByUserID,
  updateUserIDLikesPostID,
  updateUserIDHidesPostID,
} from '../../api/posts';
import { getCommentListByPostID } from '../../api/comments';
import { getUserByID } from '../../api/users';
import ErrorPage from '../error_page/ErrorPage';
import PostHeader from './PostHeader';
import PostMedia from './PostMedia';
import PostFooter from './PostFooter';
import Loader from '../loader/Loader';
import { POLLING_INTERVAL } from '../../constans';
import './Post.css';

// responsible for joining all the components and handling side effects
function Post({ postID, userID, useVisiblity = true }) {
  const currentUsrID = localStorage.getItem('userID');
  const [post, setPost] = useState(null);
  const [postAuthor, setPostAuthor] = useState(null);
  const [error, setError] = useState(false);
  const [likePost, setLikePost] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [wantHide, setWantHide] = useState(null);

  if (!userID) return <Loader />;

  // fetch post, author, and like status data
  useEffect(() => {
    const fetchCommentList = async () => {
      try {
        const response = await getCommentListByPostID(postID);

        setCommentList(response);
      } catch (e) {
        setError(true);
      }
    };

    const fetchPost = async () => {
      try {
        const response = await getPostByID(postID);

        setPost(response);
      } catch (e) {
        setError(true);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await getUserByID(userID);

        setPostAuthor(response.data);
      } catch (e) {
        setError(true);
      }
    };

    const checkWantHide = async () => {
      try {
        const response = await postIDHiddenByUserID(postID, currentUsrID);

        setWantHide(response);
      } catch (e) {
        setError(true);
      }
    };

    const checkLikeStatus = async () => {
      try {
        const response = await postIDLikedByUserID(postID, currentUsrID);

        setLikePost(response);
      } catch (e) {
        setError(true);
      }
    };

    fetchPost();
    fetchCommentList();
    fetchUser();
    checkLikeStatus();
    checkWantHide();

    // Then set up the interval for repeated execution.
    const intervalId = setInterval(() => {
      fetchPost();
      fetchCommentList();
      fetchUser();
      checkLikeStatus();
      checkWantHide();
    }, POLLING_INTERVAL);

    // Clear the interval on component unmount.
    return () => clearInterval(intervalId);
  }, [postID, userID]);

  // update like status
  useEffect(() => {
    // update only if likePost has been set
    if (likePost !== null) {
      const handleUpdateLiked = async () => {
        try {
          await updateUserIDLikesPostID(postID, currentUsrID, likePost);
        } catch (e) {
          setError(true);
        }
      };

      handleUpdateLiked(likePost);
    }
  }, [likePost, postID, userID]);

  // update post visibility for user
  // update hide status
  useEffect(() => {
    // update only if wantHide has been set
    if (wantHide !== null) {
      const handleUpdateHidePost = async () => {
        try {
          await updateUserIDHidesPostID(postID, currentUsrID, wantHide);
        } catch (e) {
          setError(true);
        }
      };

      handleUpdateHidePost(wantHide);
    }
  }, [wantHide, postID, userID]);
  // useEffect(() => {
  //   let isMounted = true; // flag to track the mounted status

  //   const fetchVisibility = async () => {
  //     if (!currentUsrID) return;

  //     try {
  //       const user = await getUserByID(currentUsrID);
  //       if (!isMounted) return; // exit if the component is unmounted

  //       let currentHiddenPosts = user.data.hiddenPosts;
  //       const updateHiddenPostsForUserID = async () => {
  //         if (visible && currentHiddenPosts.includes(postID)) {
  //           currentHiddenPosts = currentHiddenPosts.filter((id) => id !== postID);
  //         } else if (!visible && !currentHiddenPosts.includes(postID)) {
  //           currentHiddenPosts.push(postID);
  //         }

  //         const newData = { hiddenPosts: currentHiddenPosts };
  //         await updateUserByID(currentUsrID, newData);
  //       };

  //       await updateHiddenPostsForUserID();
  //     } catch (e) {
  //       if (!isMounted) return; // exit if the component is unmounted
  //       setError(true);
  //     }
  //   };

  //   // no need to poll as checkVisible() already does that
  //   fetchVisibility();

  //   // Cleanup function to set the flag when the component unmounts
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [visible, postID, currentUsrID]);

  const handleCommentListRequest = () => {
    const fetchCommentList = async () => {
      try {
        const response = await getCommentListByPostID(postID);

        setCommentList(response);
      } catch (e) {
        setError(true);
      }
    };

    // no need to poll as fetchCommentList() in useEffect already does that
    fetchCommentList();
  };

  if (error) return <ErrorPage />;
  if (!post || !postAuthor) return <Loader />;

  return (
    <>
    {/* !useVisiblity: display anyway */}
    {/* useVisiblity && wantHide: display only if wantHide */}
    {(((useVisiblity && !wantHide) || (!useVisiblity)) && (
        <div className="unhidden-post-container">
          <PostHeader
            avatarURL={postAuthor.avatarURL}
            username={postAuthor.username}
            timestamp={post.create_timestamp}
            location={post.location}
            userID={postAuthor._id}
            postID={postID}
            wantHide={wantHide}
            updateWantHide={setWantHide}
          />
          <div className="postmedia-container">
            <PostMedia mediaURL={post.media_url} mediaType={post.media_type} />
          </div>
          <PostFooter
            postID={postID}
            liked={likePost}
            updateLiked={setLikePost}
            username={postAuthor.username}
            postText={post.text}
            commentList={commentList}
            requestNewCommentList={handleCommentListRequest}
          />
        </div>
    )) || (
          <div className="hidden-post-container">
            <PostHeader
              avatarURL={postAuthor.avatarURL}
              username={postAuthor.username}
              timestamp={post.create_timestamp}
              location={post.location}
              userID={postAuthor._id}
              postID={postID}
              wantHide={wantHide}
              updateWantHide={setWantHide}
            />
          </div>
    )}

        {/* <div className="hidden-post-container">
          <PostHeader
            avatarURL={postAuthor.avatarURL}
            username={postAuthor.username}
            timestamp={post.create_timestamp}
            location={post.location}
            userID={postAuthor._id}
            postID={postID}
            visible={visible}
            updateVisible={setVisible}
          />
        </div> */}
    </>
  );
}

Post.propTypes = {
  postID: PropTypes.string.isRequired,
  userID: PropTypes.string.isRequired,
  useVisiblity: PropTypes.bool,
};

export default Post;
