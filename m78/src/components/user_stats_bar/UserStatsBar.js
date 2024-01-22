import React from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import './UserStatsBar.css';

function UserStatsBar({
  fans, followings, posts, userID,
}) {
  return (
    <div className="usr-stats-container">
      <Link to={`/followers/${userID}`}>{` ${fans.length} Fans `} </Link>
      <Link to={`/followings/${userID}`}> {` ${followings.length} Followings` }</Link>
      <Link to="/posts"> { ` ${posts.length} Posts `}</Link>
    </div>
  );
}

UserStatsBar.propTypes = {
  fans: PropTypes.array.isRequired,
  followings: PropTypes.array.isRequired,
  posts: PropTypes.array.isRequired,
  userID: PropTypes.string.isRequired,
};
export default UserStatsBar;
