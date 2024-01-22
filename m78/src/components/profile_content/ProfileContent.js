import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { POLLING_INTERVAL } from '../../constans';
import './ProfileContent.css';

import {
  getAllPostIDsByUserID,
  getAllLikesByUserID,
  getPostByID,
  getHiddenPostArrByUserID,
} from '../../api/posts';
import PostMedia from '../post/PostMedia';
import Post from '../post/Post';
import Loader from '../loader/Loader';

function ProfileContent({ userID }) {
  const [tabName, setTabName] = React.useState('post');
  const [postStats, setPostStats] = useState([]);

  const [open, setOpen] = useState(false);
  const [modalPost, setModalPost] = useState({});

  const openModal = (post) => {
    // alert(postID);
    setModalPost(post);
    setOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let ids;
        switch (tabName) {
          case 'post':
            ids = await getAllPostIDsByUserID(userID);
            break;
          case 'like':
            ids = await getAllLikesByUserID(userID);
            break;
          case 'hidden':
            ids = await getHiddenPostArrByUserID(userID);
            break;
          default:
            ids = await getAllPostIDsByUserID(userID);
            break;
        }
        // const ids = await getAllPostIDsByUserID(userID);
        ids.sort((a, b) => b - a); // sort by postID(create_timestamp)
        const stats = await Promise.all(
          ids.map(async (postID) => {
            const post = await getPostByID(postID);
            return {
              author_id: post.author_id,
              postID: post._id,
              mediaURL: post.media_url,
              mediaType: post.media_type,
            };
          }),
        );
        setPostStats(stats);
      } catch (e) {
        // handle error
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [tabName, userID]);

  if (!postStats) return <Loader />;

  return (
    <div className="tab-container">
      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="modal-content"
        overlayClassName="modal-overlay"
        ariaHideApp={false}
        shouldFocusAfterRender={false}
      >
      {modalPost.postID && modalPost.author_id && <Post
      postID={modalPost.postID} userID={modalPost.author_id} useVisiblity={false} />}

      </Modal>
      {/* Only render content for the 'post' tab */}
      <div className="tab-bar">
        <div
          className={`tab-bar-item ${tabName === 'post' ? 'active' : ''}`}
          onClick={() => setTabName('post')}
        >
          POST
          <GridOnOutlinedIcon />
        </div>
        <div
          className={`tab-bar-item ${tabName === 'like' ? 'active' : ''}`}
          onClick={() => setTabName('like')}
        >
          LIKE
          <FavoriteBorderOutlinedIcon />
        </div>
        <div
          className={`tab-bar-item ${tabName === 'hidden' ? 'active' : ''}`}
          onClick={() => setTabName('hidden')}
        >
          HIDDEN
          <FavoriteBorderOutlinedIcon />
        </div>
      </div>
      <div className="tab-content">
        {
          /* tabName === 'post' && */
          postStats.map((post) => (
            <div
              key={`post-${post.postID}`}
              className="tab-content-item"
              style={{ position: 'relative' }}
            >
              <PostMedia
                mediaURL={post.mediaURL}
                mediaType={post.mediaType}
                key={post._id}
              />
              <div
                onClick={() => openModal(post)}
                style={{
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                }}
              ></div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

ProfileContent.propTypes = {
  userID: PropTypes.string.isRequired,
};

export default ProfileContent;
