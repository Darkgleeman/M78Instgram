import { React } from 'react';
import PropTypes from 'prop-types';
import SingleComment from './SingleComment';

function Comments({ commentList }) {
  return (
    <div>
      {commentList.map((comment) => (
        <div key={comment._id}>
          <SingleComment comment={comment} />
        </div>
      ))}
    </div>
  );
}

Comments.propTypes = {
  commentList: PropTypes.array.isRequired,
};

export default Comments;
