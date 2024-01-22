const commentApi = require('./comment');
const postApi = require('./post');
const setupApi = require('./setup');
const userApi = require('./user');

module.exports = {
  ...commentApi,
  ...postApi,
  ...setupApi,
  ...userApi,
};
