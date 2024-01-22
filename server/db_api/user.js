/* eslint-disable no-underscore-dangle */
const { ObjectId } = require('mongodb');
const { getDB } = require('./setup');

const registerUser = async (newUser) => {
  // get the db
  const db = await getDB();
  const userToInsert = {
    ...newUser,
    posts: [],
    fans: [],
    followings: [],
    likedPosts: [],
    lockoutStartTime: new Date(),
    loginFailCount: 0,
    hiddenPosts: [],
  };
  let result;
  try {
    result = await db.collection('Users').insertOne(userToInsert);
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error('Username already exists');
      error.code = 409;
      throw error;
    }
    throw new Error(err.message);
  }
  return result.insertedId;
};

const getUsers = async () => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('Users').find({}).toArray();
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUserById = async (userID) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db
      .collection('Users')
      .findOne({ _id: new ObjectId(userID) });
    // print the result
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUserByUsername = async (username) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db
      .collection('Users')
      .findOne({ username });
    // print the result
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateUser = async (userID, newData) => {
  try {
    // get the db
    const db = await getDB();

    const result = await db
      .collection('Users')
      .updateOne({ _id: new ObjectId(userID) }, { $set: newData });
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

async function authenticateUser({ username, password }) {
  const result = {
    status: -1, _id: -1, waitTime: 0, message: '',
  };
  const LOCKOUT_WAIT = 600000;

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      result.status = 401;
      result.message = 'Invalid Username. Get an account first!';
      return result;
    }
    // fail more than 3 times and LOCKOUT_WAIT time has not passed
    if (
      user.loginFailCount >= 3
      && new Date(user.lockoutStartTime).getTime() + LOCKOUT_WAIT > Date.now()
    ) {
      result.status = 423;
      // calculate wait time in minutes
      const remainingTime = new Date(user.lockoutStartTime).getTime() + LOCKOUT_WAIT - Date.now();
      const remainingMinutes = Math.ceil(remainingTime / (1000 * 60));
      // Update the message with remaining time in whole minutes
      const scale = remainingMinutes > 1 ? 'minutes' : 'minute';
      result.message = `Lockout mode activated after 3 attempts! ${remainingMinutes} ${scale} of relaxation time starts now.`;
      return result;
    }

    // fail less than 3 times or LOCKOUT_WAIT time has passed
    // check password
    if (user.password === password) {
      // reset loginFailData
      await updateUser(user._id, {
        loginFailCount: 0,
        lockoutStartTime: null,
      });

      // prepare return data
      result.loginSuccess = true;
      result._id = user._id;
      result.status = 201;
      result.message = 'Login Success';
      return result;
    }

    // incorrect password
    // increment fail count
    await updateUser(user._id, {
      loginFailCount: user.loginFailCount + 1,
      lockoutStartTime: Date.now(),
    });

    result.status = 401;
    result.message = 'Incorrect Username or Password';
    return result;
  } catch (error) {
    throw Error('Login failed');
  }
}

module.exports = {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  getUserByUsername,
  authenticateUser,
};
