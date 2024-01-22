import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFollowersByUserID } from '../../api/follows';
import ProfileBar from '../profile_bar/ProfileBar';
import { POLLING_INTERVAL } from '../../constans';
import './Followers.css';

function Followers() {
  const { userID } = useParams();
  const [followers, setFollowers] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFollowers() {
      try {
        const data = await getFollowersByUserID(userID);

        setFollowers(data);
        setError(null);
      } catch (err) {
        setError('Sorry, this page is not available.');
      }
    }

    fetchFollowers();

    const intervalId = setInterval(fetchFollowers, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [userID]);

  return (
    <div className="followers-container">
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
        <div className="followers-list">
          <div className='title'><h2>Followers</h2></div>
          <div className="followers-items">
            {Object.keys(followers).map((followerID) => (
              <div key={followerID}>
                <ProfileBar userID={followerID} stats={followers[followerID]} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Followers;
