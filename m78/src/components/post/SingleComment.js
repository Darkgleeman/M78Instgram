import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { PropTypes } from 'prop-types';
import { getUserByID } from '../../api/users';

function SingleComment({ comment }) {
  const [writer, setWriter] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserByID(comment.writer);
        setWriter(response.data);
      } catch (e) {
        throw Error(e.message);
      }
    };
    fetchUser();
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>

        <Link to={`/profile/${writer._id}`} style={{ marginRight: '10px' }}>
            <Avatar className='profilebar-avatar' alt={writer.username} src={writer.avatarURL} style={{ width: '20px', height: '20px', objectFit: 'cover' }} />
        </Link>
        <Link
            to={`/profile/${writer._id}`}
            style={{
              marginRight: '5px',
              textDecoration: 'none',
              color: 'black',
              fontWeight: '550',
              cursor: 'pointer',
              fontSize: '13px',
            }}>{writer.username}
        </Link>
        {/* <p>{comment.content}</p> */}
        <div>
            <p style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</p>
        </div>

    </div>
  );
}

SingleComment.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default SingleComment;
