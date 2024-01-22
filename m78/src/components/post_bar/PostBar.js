import React, { useEffect, useState } from 'react';
import './PostBar.css';
import { PropTypes } from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from '../post/Post';
import ErrorPage from '../error_page/ErrorPage';
import { getFollowingsByUserID } from '../../api/follows';
import { getAllPostIDsByUserID, getSelectedFieldsForMultiplePosts, getHiddenPostArrByUserID } from '../../api/posts';
import Loader from '../loader/Loader';
import { POLLING_INTERVAL } from '../../constans';

function PostBar({ userID }) {
  const [userIDpostIDs, setUserIDpostIDs] = useState([]);
  const [error, setError] = useState(false);
  const [visiblePostCount, setVisiblePostCount] = useState(1); // Number of posts to show initially

  // Function to load more posts
  const fetchMoreData = () => {
    setTimeout(() => {
      setVisiblePostCount((prevCount) => prevCount + 1); // Load 10 more posts
    }, 800);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const currentUsrPosts = await getAllPostIDsByUserID(userID);
        let userIDPostPairs = [];

        if (currentUsrPosts.length !== 0) {
          // get create time for each post
          const postIDsString = currentUsrPosts.join('&');
          const postIDAndCreateTime = await getSelectedFieldsForMultiplePosts(postIDsString, ['_id', 'create_timestamp']);
          // get [(userID, postID, create_timestamp)...] array for current usr
          userIDPostPairs = postIDAndCreateTime.map((postObj) => (
            [userID, ...Object.values(postObj)]));
        }

        const followings = await getFollowingsByUserID(userID);
        // get [(userID, postID, create_timestamp)...] array for the following usr
        const followingsPosts = await Promise.all(
          followings.map(async (following) => {
            const posts = await getAllPostIDsByUserID(following._id);

            // fetch posts only if the following has posts
            if (posts.length !== 0) {
              const postsString = posts.join('&');
              const postIDsAndCreateTime = await getSelectedFieldsForMultiplePosts(postsString, ['_id', 'create_timestamp']);
              return postIDsAndCreateTime.map((postObj) => (
                [following._id, ...Object.values(postObj)]));
            }
            return [];
          }).flat(),
        );

        // Fetch hidden posts and filter them out

        let combinedPosts = userIDPostPairs.length === 0 ? followingsPosts.flat() : (
          userIDPostPairs.concat(...followingsPosts));

        const hiddenPosts = await getHiddenPostArrByUserID(userID);
        combinedPosts = combinedPosts.filter(
          (post) => !hiddenPosts.includes(post[1]),
        ); // Assuming post[1] is the postID

        // sort by create_timestamp DESC
        combinedPosts.sort((a, b) => new Date(b[2]) - new Date(a[2]));
        setUserIDpostIDs(combinedPosts);
        // setHasMore(false);
      } catch (e) {
        setError(true);
      }
    };

    fetchPosts();

    const intervalId = setInterval(fetchPosts, POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [userID]);

  if (error) return <ErrorPage />;

  return (
    <div className="postbar-posts">
      <InfiniteScroll
        dataLength={visiblePostCount} // This is important to ensure the call of fetchMoreData
        next={fetchMoreData}
        hasMore={visiblePostCount < userIDpostIDs.length}
        // loader={<h4>Loading...</h4>}
        loader={<Loader />}
        endMessage={
          <p style={{
            textAlign: 'center', paddingTop: '20px', fontWeight: '2px', opacity: 0.3,
          }}>
            <b>You have seen all posts</b>
          </p >
        }
      >
      {userIDpostIDs.slice(0, visiblePostCount).map((userIDpostID) => (
        <div key={userIDpostID[1]} className="homepage-posts-item">
          <Post postID={userIDpostID[1]} userID={userIDpostID[0]} />
        </div>
      ))}

    </InfiniteScroll>
    </div>
  );
}

PostBar.propTypes = {
  userID: PropTypes.string.isRequired,
};
export default PostBar;
