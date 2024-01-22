import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { PropTypes } from 'prop-types';
import PostBar from '../post_bar/PostBar';
import { getRecommendFollow } from '../../api/follows';
import ProfileBar from '../profile_bar/ProfileBar';
import { POLLING_INTERVAL } from '../../constans';

function HomePage({ userID }) {
  const [recommendFollow, setRecommendFollow] = useState([]);

  useEffect(() => {
    async function fetchRecommendFollow() {
      try {
        const data = await getRecommendFollow(userID);
        setRecommendFollow(data);
      } catch (error) {
        // do nothing now;
      }
    }

    fetchRecommendFollow();

    const intervalId = setInterval(fetchRecommendFollow, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="homepage">
      <PostBar userID={userID} />
      <div className="recommend-bar">
        {recommendFollow.map((recommend) => (
          <div className="recommend-bar-item" key={recommend._id}>
            <ProfileBar userID={recommend._id} stats={recommend} />
          </div>
        ))}
      </div>
    </div>
  );
}

HomePage.propTypes = {
  userID: PropTypes.string.isRequired,
};
export default HomePage;
