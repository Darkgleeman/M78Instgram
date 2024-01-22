import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './PostFooter.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
// import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Comments from './Comments';
import { sendComment } from '../../api/comments';

function PostFooter({
  liked, updateLiked, username, postText, postID, commentList, requestNewCommentList,
}) {
  const currentUsrID = localStorage.getItem('userID');
  const [emoji1, setEmoji1] = useState('😀');
  const [emoji2, setEmoji2] = useState('🥹');
  const [comment, setComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    const { value } = e.target;
    setComment(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const variables = {
      content: comment,
      writer: currentUsrID,
      postID,
    };
    try {
      await sendComment(variables);
      // window.location.reload();
      setComment('');
      requestNewCommentList();
    } catch (error) {
      throw Error(error.message);
    }
  };

  const handleEmojiIconClick = (setter) => {
    const faceEmojiStart = 0x1f600; // 😀
    const faceEmojiEnd = 0x1f64f; // 🙏

    const randomEmojiCode = Math.floor(Math.random() * (faceEmojiEnd - faceEmojiStart + 1))
      + faceEmojiStart;

    setter(String.fromCodePoint(randomEmojiCode));
  };

  const handleLikeIconClick = () => {
    updateLiked(!liked);
  };

  return (
    <div className="post-footer-container">
      <div className="post-footer-icons">
        <div className="post-footer-icon">
          <button type="button" onClick={() => handleEmojiIconClick(setEmoji1)}>
            {emoji1}
          </button>
        </div>

        {liked !== null && (
          <div className="post-footer-icon">
            <button type="button" onClick={handleLikeIconClick}>
              {liked === false ? <FavoriteBorderIcon /> : <FavoriteIcon />}
            </button>
          </div>)
        }

        <div className="post-footer-icon">
          <button type="button" onClick={() => handleEmojiIconClick(setEmoji2)}>
            {emoji2}
          </button>
        </div>
      </div>

      <div className="post-footer-texts">
          <p className="post-footer-username">{`${username}`}</p>
          <p className="post-footer-text">
            <strong>{postText}</strong>
          </p>
      </div>

      <div className='post-footer-comment-container'>
        <div >
          {isExpanded && <Comments commentList={commentList}/>}
        </div>

        {(isExpanded && commentList.length > 0)
          && <p style={{ color: 'gray', cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)}>
          Hide all {commentList.length} comments
        </p>}

        {(!isExpanded && commentList.length > 0)
          && <p style={{ color: 'gray', cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)}>
          View all {commentList.length} comments
        </p>}

        <div style={{ display: 'flex' }}>
          <TextField
            fullWidth
            placeholder="Add a comment..."
            variant="standard"
            InputProps={{
              disableUnderline: true,
              classes: { input: 'placeholderStyle' },
            }}
            // style={{ marginTop: '5px', color: '#e0e0e0' }}
            value={comment}
            onChange={handleChange}
          />
          {comment !== ''
            && <Button onClick={handleSubmit}>
                <strong>Post</strong>
              </Button>}
        </div>
      </div>
    </div>
  );
}

PostFooter.propTypes = {
  liked: PropTypes.bool,
  updateLiked: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  postText: PropTypes.string.isRequired,
  postID: PropTypes.string.isRequired,
  commentList: PropTypes.array.isRequired,
  requestNewCommentList: PropTypes.func.isRequired,
};

export default PostFooter;
