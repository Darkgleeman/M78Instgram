import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './PostHeader.css';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { deletePost } from '../../api/posts';
import EditPost from '../edit_post/EditPost';

function PostHeader({
  avatarURL, username, timestamp, location, userID, postID, wantHide, updateWantHide,
}) {
  const calculateTimeDifference = () => {
    const currentTime = new Date();
    const postTime = new Date(timestamp);
    const diff = currentTime - postTime;

    const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hoursDiff = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutesDiff = Math.floor((diff / (1000 * 60)) % 60);

    if (daysDiff >= 1) {
      return `  •  ${daysDiff}d`;
    }
    if (hoursDiff >= 1) {
      return `  •  ${hoursDiff}h`;
    }
    return `  •  ${minutesDiff}m`;
  };
  const currentUsrID = localStorage.getItem('userID');
  const [wantToEdit, setwantToEdit] = useState(false);
  const [timeDiff, setTimeDiff] = useState(calculateTimeDifference());
  const updateEdit = (v) => {
    setwantToEdit(v);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeDiff(calculateTimeDifference());
    }, 60 * 1000); // Update every minute

    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <div className="post-header-container">
      <div className="post-header-avatar">
        <Link to={`/profile/${userID}`}>
          <Avatar alt={username} src={avatarURL} />
        </Link>
      </div>
      <div className="post-header-metadata">
        <div className="post-header-usernameNtime">
          <div className="post-header-username">{username}</div>
          <div className="post-header-time">{timeDiff}</div>
        </div>
        {location && <div className="post-header-location">{location}</div>}
      </div>
      {/* <div className="delete-icon-container" onClick={() => deletePost(postID, userID)}> */}
      <div className="delete-icon-container">
        {currentUsrID === userID && (
          <DeleteIcon onClick={() => deletePost(postID, userID)} />
        )}
      </div>

      {currentUsrID === userID && (
        <div
          className="edit-icon-container"
          onClick={() => {
            updateEdit(true);
          }}
        >
          <EditIcon />
        </div>
      )}
      <div className="hide-icon-container">
        {wantHide && currentUsrID !== userID && (
          <>
            <VisibilityOutlinedIcon onClick={() => updateWantHide(false)} />
          </>
        )}
        {!wantHide && currentUsrID !== userID && (
          <>
            <VisibilityOffOutlinedIcon onClick={() => updateWantHide(true)} />
          </>
        )}
      </div>

      {wantToEdit && (
        <EditPost
          postID={postID}
          wantToEdit={wantToEdit}
          updateEdit={updateEdit}
        />
      )}
    </div>
  );
}

PostHeader.propTypes = {
  avatarURL: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  userID: PropTypes.string.isRequired,
  postID: PropTypes.string.isRequired,
  wantHide: PropTypes.bool,
  updateWantHide: PropTypes.func.isRequired,
};

export default PostHeader;
