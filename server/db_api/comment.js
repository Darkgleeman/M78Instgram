const { getDB } = require('./setup');

const getComments = async () => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('Comments').find({}).toArray();
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

const createComment = async (newComment) => {
  // get the db
  const db = await getDB();
  const result = await db.collection('Comments').insertOne(newComment);
  return result.insertedId;
};

module.exports = {
  getComments,
  createComment,
};
