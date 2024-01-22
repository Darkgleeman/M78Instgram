import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Profile.css';
import { getUserByID } from '../../api/users';
import ProfileBar from '../profile_bar/ProfileBar';
// import PostBar from '../post_bar/PostBar';
import ProfileContent from '../profile_content/ProfileContent';
import { POLLING_INTERVAL } from '../../constans';

function Profile() {
  const [error, setError] = useState(null);
  const { userID } = useParams();
  const [stats, setStats] = useState({
    username: '',
    posts: [],
    fans: [],
    followings: [],
    avatarURL: '',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getUserByID(userID);
        const { data } = response;

        setStats({
          username: data.username,
          posts: data.posts,
          fans: data.fans,
          followings: data.followings,
          avatarURL: data.avatarURL,
        });

        setError(null); // Clear any previous errors when data fetch is successful
      } catch (err) {
        setError('Sorry, this page is not available.');
      }
    };

    fetchStats();

    const intvervalId = setInterval(fetchStats, POLLING_INTERVAL);
    return () => clearInterval(intvervalId);
  }, [userID]);

  return (
    <>
      {error && (
        <div className="error-box">
          <p className="error-msg">{error}</p>
          <p>
            The link you followed may be broken, or the page may have been
            removed.
          </p>
        </div>
      )}
      {!error && (
        <div className="profile-container">
          <div className="profile-bar">
            <ProfileBar stats={stats} userID={userID} />
          </div>
          <ProfileContent userID={userID} />
        </div>
      )}
    </>
  );
}

export default Profile;
