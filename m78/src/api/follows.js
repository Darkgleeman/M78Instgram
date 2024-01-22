import { getUserByID, updateUserByID, getAllUsers } from './users';

async function getFollowersByUserID(userID) {
  try {
    const response = await getUserByID(userID);

    if (!response.data) {
      throw new Error('User not found');
    }

    const followersPromise = response.data.fans.map((fan) => getUserByID(fan)
      .then((fanRsp) => ({ [fan]: fanRsp.data }))
      .catch(() => null)); // fail to fetch a follower

    let followers = await Promise.all(followersPromise);
    followers = Object.assign({}, ...followers.filter(Boolean));

    return followers;
  } catch (error) {
    throw Error('User not found');
  }
}

async function getFollowingsByUserID(userID) {
  try {
    const response = await getUserByID(userID);

    if (!response.data) {
      throw new Error('User not found');
    }

    const promises = response.data.followings.map((following) => getUserByID(following));

    const followingsData = await Promise.all(promises);
    const followings = followingsData.map((data) => data.data);

    return followings;
  } catch (error) {
    throw Error('User not found');
  }
}

async function isMyFollowing(userID, followerID) {
  try {
    const response = await getUserByID(userID);

    if (!response.data) {
      throw new Error('User not found');
    }

    return response.data.followings.includes(followerID);
  } catch (error) {
    throw Error('User not found');
  }
}

async function addFollow(userID, followingID) {
  try {
    // Step1: update userID's following list
    const response = await getUserByID(userID);

    if (!response.data) {
      throw new Error('User not found');
    }

    const followingList = [...response.data.followings, followingID];

    const updateResponse = await updateUserByID(userID, {
      followings: followingList, // updating the followings list
    });

    // Step2: update followingID's fan's list
    const response2 = await getUserByID(followingID);
    if (!response2.data) {
      throw new Error('User not found');
    }

    const fanList = [...response2.data.fans, userID];
    const updateResponse2 = await updateUserByID(followingID, {
      fans: fanList, // updating the fans list
    });

    // Check if update was successful, handle accordingly (this depends on how your API responds)
    if (updateResponse.status !== 200 || updateResponse2.status !== 200) {
      throw new Error('Failed to update followings');
    }
  } catch (error) {
    throw Error('Failed to update followings');
  }
}

async function removeFollow(userID, followingID) {
  try {
    // Step1: update userID's following list
    const response = await getUserByID(userID);

    if (!response.data) {
      throw new Error('User not found');
    }

    const followingList = response.data.followings.filter(
      (id) => id !== followingID,
    );

    const updateResponse = await updateUserByID(userID, {
      followings: followingList,
    });

    // Step2: update followingID's fan's list
    const response2 = await getUserByID(followingID);
    if (!response2.data) {
      throw new Error('User not found');
    }

    const fanList = response2.data.fans.filter((id) => id !== userID);
    const updateResponse2 = await updateUserByID(followingID, {
      fans: fanList,
    });

    if (updateResponse.status !== 200 || updateResponse2.status !== 200) {
      throw Error('Failed to update followings');
    }
  } catch (error) {
    throw Error('Failed to update followings');
  }
}

async function getRecommendFollow(userID) {
  try {
    const allUser = await getAllUsers();
    const hasFollowedUser = await getFollowingsByUserID(userID);
    const hasFollowedUserID = hasFollowedUser.map((user) => user._id);

    let recommendUser = allUser.data.filter((user) => !hasFollowedUserID.includes(user._id));
    recommendUser = recommendUser.filter((user) => user._id !== userID);

    return recommendUser;
  } catch (error) {
    throw Error('Failed to get recommend user');
  }
}

export {
  getFollowersByUserID,
  getFollowingsByUserID,
  isMyFollowing,
  addFollow,
  removeFollow,
  getRecommendFollow,
};
