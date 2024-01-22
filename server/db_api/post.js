const { ObjectId } = require('mongodb');
const { getDB } = require('./setup');

const createPost = async (newPost) => {
  // get the db
  const db = await getDB();
  const result = await db.collection('Posts').insertOne(newPost);
  return result.insertedId;
};

const deletePost = async (postID) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db
      .collection('Posts')
      .deleteOne({ _id: new ObjectId(postID) });

    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updatePost = async (postID, newData) => {
  try {
    // get the db
    const db = await getDB();

    const result = await db
      .collection('Posts')
      .updateOne({ _id: new ObjectId(postID) }, { $set: newData });
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getPosts = async () => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('Posts').find({}).toArray();
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getPostsByPostIDs = async (postIDs) => {
  try {
    const db = await getDB();
    // Split the 'ids' param on & to get an array of IDs
    const idsArray = postIDs.split('&').map((id) => new ObjectId(id.trim()));
    const posts = await db
      .collection('Posts')
      .find({
        _id: { $in: idsArray },
      })
      .toArray();
    return posts;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getPostByID = async (postID) => {
  try {
    // get the db
    const db = await getDB();
    const result = await db
      .collection('Posts')
      .findOne({ _id: new ObjectId(postID) });

    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  createPost,
  deletePost,
  updatePost,
  getPosts,
  getPostByID,
  getPostsByPostIDs,
};
