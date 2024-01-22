import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import './ProfileBar.css';
import UserStatsBar from '../user_stats_bar/UserStatsBar';
import {
  isMyFollowing, addFollow, removeFollow,
} from '../../api/follows';
import { POLLING_INTERVAL } from '../../constans';

function ProfileBar({ stats, userID }) {
  const currentUsrID = localStorage.getItem('userID');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    async function fetchIsFollowing() {
      try {
        const data = await isMyFollowing(currentUsrID, userID);
        setIsFollowing(data);
      } catch (err) {
        // No action needed
      }
    }

    fetchIsFollowing();

    const intervalId = setInterval(fetchIsFollowing, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [currentUsrID, userID, isFollowing]);

  const handleFollow = async () => {
    await addFollow(currentUsrID, userID);
    setIsFollowing(true);
  };

  const handleUnfollow = async () => {
    await removeFollow(currentUsrID, userID);
    setIsFollowing(false);
  };

  const renderProfileBarButton = () => {
    if (currentUsrID !== userID) {
      if (isFollowing) {
        return <button className="profile-btn follow-btn" onClick={handleUnfollow}>Unfollow</button>;
      }
      return <button className="profile-btn follow-btn" onClick={handleFollow}>Follow</button>;
    }

    return <button className="profile-btn">Edit Profile</button>;
  };

  return (
    <div className="profilebar-container">
      <div className="account-portrait">
        <Link to={`/profile/${userID}`}>
          <Avatar className='profilebar-avatar' alt={stats.username} src={stats.avatarURL} />
        </Link>
      </div>

      <div className="right-panel">
        <div className="usr-info">
          {stats.username}
          {renderProfileBarButton()}
        </div>
        <UserStatsBar
          fans={stats.fans}
          followings={stats.followings}
          posts={stats.posts}
          userID={userID}
        />
        <div className="bio"> This is Biography </div>
      </div>
    </div>
  );
}

ProfileBar.propTypes = {
  stats: PropTypes.object.isRequired,
  userID: PropTypes.string.isRequired,
};
export default ProfileBar;
