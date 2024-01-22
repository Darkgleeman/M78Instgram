import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFollowingsByUserID } from '../../api/follows';
import ProfileBar from '../profile_bar/ProfileBar';
import { POLLING_INTERVAL } from '../../constans';
import './Followings.css';

function Followings() {
  const { userID } = useParams();
  const [followings, setFollowings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFollowings() {
      try {
        const data = await getFollowingsByUserID(userID);
        setFollowings(data);
        setError(null);
      } catch (err) {
        setError('Sorry, this page is not available.');
      }
    }

    fetchFollowings();

    const intervalId = setInterval(fetchFollowings, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [userID]);

  return (
    <div className="followings-container">
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
        <div className="followings-list">
        <div className='title'><h2>Followings</h2></div>
          <div className="followings-item">
            {followings.map((following) => (
              <div key={following._id}>
                <ProfileBar userID={following._id} stats={following} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Followings;
