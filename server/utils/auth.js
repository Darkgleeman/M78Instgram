/**
 * This module contains authentication and session functions
 */

// import JWT
const jwt = require('jsonwebtoken');

// import the env variables
require('dotenv').config();

// import DB function
const { getUserById } = require('../db_api/user');

/**
 * Create a JWT containing the username
 * @param {*} userid
 * @returns the token
 */
const generateUserToken = (userid) => {
  try {
    const token = jwt.sign({ userId: userid }, process.env.KEY, {
      expiresIn: '10m',
    });
    // console.log('token1', token);
    return token;
  } catch (err) {
    // console.log('error', err.message);
    return err.message;
  }
};

/**
 * Verify a token. Check if the user is valid
 * @param {*} token
 * @returns true if the user is valid
 */
const verifyUserToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token || token === 'null' || token === 'undefined') {
      res.status(401).json({ error: 'No token provided' });
      res.send();
      return;
    }
    // console.log('before verify', token);
    const decoded = jwt.verify(token, process.env.KEY);
    const user = await getUserById(decoded.userId);
    // console.log('user', user);
    if (!user) {
      res.status(401).json({ error: 'Invalid token' });
      res.send();
      return;
    }

    next(); // Continue to the next middleware/route handler
  } catch (err) {
    let message = 'Invalid Token';
    if (err instanceof jwt.TokenExpiredError) {
      message = 'Token Expired';
    }
    res.status(401).json({ error: message });
    res.send();
  }
};

module.exports = { generateUserToken, verifyUserToken };
