import React from 'react';
import PropTypes from 'prop-types';
import ErrorPage from '../error_page/ErrorPage';
import './PostMedia.css';

function PostMedia({ mediaURL, mediaType }) {
  const handleReturn = () => {
    if (mediaType === 'image') {
      return (
        <div className="post-media-img">
          <img className="imageSize" src={mediaURL} alt="post img" />
        </div>
      );
    }
    if (mediaType === 'video') {
      return (
        <div className="post-media-video">
          {/* <video src={mediaURL} alt="post video" /> */}
          <video controls>
            <source src={mediaURL} type="video/mp4" />
          </video>
        </div>
      );
    }
    return (
      <div className="post-media error">
        <ErrorPage />
      </div>
    );
  };
  return <div className="post-media-container">{handleReturn()}</div>;
}

PostMedia.propTypes = {
  mediaURL: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
};
export default PostMedia;
