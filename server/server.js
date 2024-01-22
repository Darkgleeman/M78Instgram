/* eslint-disable no-underscore-dangle */
/**
 * Express webserver / controller
 */

// import express
const express = require('express');

// import the cors -cross origin resource sharing- module
const cors = require('cors');

// create a new express app
const webapp = express();

const fs = require('fs');

const formidable = require('formidable');

const s3 = require('./s3Operations');

const { generateUserToken, verifyUserToken } = require('./utils/auth');

const { authenticateUser } = require('./db_api/user');

const { MAX_FILE_SIZE, ALLOWED_MEDIA_TYPES } = require('./constants');

// enable cors
webapp.use(cors());

// configure express to parse request bodies
webapp.use(express.urlencoded({ extended: true }));

// !!!!!! IMPORTANT !!!!!!
// If sending data in JSON format from the frontend, this line is needed to parse the json body
webapp.use(express.json());

// import the db function
const dbLib = require('./db_api');

// root endpoint route
// webapp.get('/', (req, resp) => {
//   resp.json({ message: 'Hello :)' });
// });

/**
 * Login endpoint
 * The name is used to log in
//  */
webapp.post('/api/login', async (req, resp) => {
  // check that the name was sent in the body
  if (
    !req.body.username
    || req.body.username === ''
    || !req.body.password
    || req.body.password === ''
  ) {
    resp.status(400).json({ error: 'Bad Request' });
    return;
  }
  // authenticate the user
  try {
    const result = await authenticateUser(req.body);
    if (result.status === 201) {
      result.appToken = generateUserToken(result._id.toString());
    }
    resp.status(result.status).json({ ...result });
  } catch (err) {
    if (err.code === 11000 || err.code === 409) {
      resp.status(409).json({ message: 'Username already exists' });
      // return;
    }
    resp.status(401).json({ error: 'Unauthorized' });
  }
});

/**
 * route implementation for registration POST /Users
 */
webapp.post('/api/Users', async (req, resp) => {
  if (!req.body.username || !req.body.password) {
    resp.status(404).json({ message: 'missing name or username in the body' });
    return;
  }
  try {
    // create the new student object
    const newUser = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      alias: req.body.alias,
      avatarURL: req.body.avatarURL,
    };
    const result = await dbLib.registerUser(newUser);
    resp.status(201).json({ data: { id: result } });
  } catch (err) {
    if (err.code === 11000 || err.code === 409) {
      resp.status(409).json({ message: 'Username already exists' });
      return;
    }
    resp.status(400).json({ message: 'There was an error' });
  }
});

webapp.post('/api/Posts/UploadMedia', async (req, res) => {
  const form = new formidable.IncomingForm(); // { multiples: true });

  // Listen for when a file upload begins
  form.on('fileBegin', (formName, file) => {
    // Check if the file type is allowed
    if (!ALLOWED_MEDIA_TYPES.has(file.mimetype)) {
      // Emit an error if the file type is not allowed
      form.emit('error', new Error('File type not allowed'));
    }
  });

  // Set the max file size
  form.maxFileSize = MAX_FILE_SIZE;
  form.parse(req, (err, fields, files) => {
    if (err) {
      if (err.message.includes('maxFileSize exceeded')) {
        res.status(413).json({ error: 'File size exceeds the limit' });
      } else if (err.message.includes('File type not allowed')) {
        res.status(415).json({ error: 'Unsupported Media Type' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }
    // create a buffer to cache uploaded file
    let cacheBuffer = Buffer.alloc(0);

    // create a stream from the virtual path of the uploaded file
    // console.log('files:', files);
    const fStream = fs.createReadStream(files.file_id[0].filepath);

    fStream.on('data', (chunk) => {
      // fill the buffer with data from the uploaded file
      cacheBuffer = Buffer.concat([cacheBuffer, chunk]);
    });

    fStream.on('end', async () => {
      // send buffer to AWS - The url of the object is returned
      const s3URL = await s3.uploadFile(cacheBuffer, files.file_id[0].newFilename);
      // console.log('end', cacheBuffer.length);

      // You can store the URL in mongoDB along with the rest of the data
      // send a response to the client

      // res.status(201).json({ message: `files uploaded at ${s3URL}` });
      res.status(201).json(s3URL);
    });
  });
});

webapp.use(verifyUserToken);

/**
 * route implementation GET /user/:username
 */

webapp.get('/api/Users', async (req, resp) => {
  try {
    const users = await dbLib.getUsers();
    resp.status(200).json(users);
  } catch (err) {
    resp.status(400).json({ message: 'There was an eror' });
  }
});

/**
 * route implementation GET /student/:id
 */
webapp.get('/api/Users/:id', async (req, res) => {
  try {
    // get the data from the db
    const results = await dbLib.getUserById(req.params.id);
    if (results === undefined) {
      res.status(404).json({ error: 'unknown user' });
      return;
    }
    // send the response with the appropriate status code
    res.status(200).json(results);
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

/**
 * route implementation PUT /student/:id
 */
webapp.put('/api/Users/:id', async (req, res) => {
  // parse the body of the request
  // if (!req.body.major) {
  //   res.status(404).json({ message: 'missing major' });
  //   return;
  // }
  try {
    const result = await dbLib.updateUser(req.params.id, req.body);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    // console.log(err);
    res.status(404).json({ message: 'there was error' });
  }
});

// route implementation for Posts Collection

webapp.post('/api/Posts', async (req, resp) => {
  if (!req.body.location || !req.body.text) {
    resp.status(404).json({ message: 'missing text, location in the body' });
    return;
  }
  try {
    // create the new student object
    const newPost = {
      create_timestamp: req.body.create_timestamp,
      location: req.body.location,
      media_url: req.body.media_url,
      media_type: req.body.media_type,
      likedByUsers: [],
      hiddenByUsers: [],
      text: req.body.text,
      author_id: req.body.author_id,
    };
    const result = await dbLib.createPost(newPost);
    resp.status(201).json({ _id: result });
  } catch (err) {
    resp.status(400).json({ message: 'There was an error' });
  }
});

webapp.get('/api/Posts', async (req, resp) => {
  try {
    const posts = await dbLib.getPosts();
    resp.status(200).json(posts);
  } catch (err) {
    resp.status(400).json({ message: 'There was an eror' });
  }
});

webapp.get('/api/Posts/:id', async (req, resp) => {
  try {
    const result = await dbLib.getPostByID(req.params.id);
    if (result === undefined) {
      resp.status(404).json({ error: 'unknown post' });
      return;
    }
    resp.status(200).json(result);
  } catch (err) {
    resp.status(400).json({ message: 'There was an error' });
  }
});

webapp.get('/api/Posts/IDs/:ids', async (req, resp) => {
  try {
    const results = await dbLib.getPostsByPostIDs(req.params.ids);

    // If no posts are found, return a 404 response
    if (!results || results.length === 0) {
      resp.status(404).json({ error: 'No posts found' });
      return;
    }

    // Return the found posts in the response
    resp.status(200).json(results);
  } catch (err) {
    // console.log(err); // Log the error for server-side debugging
    resp.status(500).json({ message: 'There was an error processing your request' });
  }
});

webapp.delete('/api/Posts/:id', async (req, resp) => {
  try {
    const result = await dbLib.deletePost(req.params.id);
    if (result.deletedCount === 0) {
      resp.status(404).json({ error: 'post not in the system' });
      return;
    }
    // send the response with the appropriate status code
    resp.status(200).json({ message: result });
  } catch (err) {
    resp.status(400).json({ message: 'there was error' });
  }
});

webapp.put('/api/Posts/:id', async (req, res) => {
  // parse the body of the request
  // if (!req.body.major) {
  //   res.status(404).json({ message: 'missing major' });
  //   return;
  // }
  try {
    const result = await dbLib.updatePost(req.params.id, req.body);
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.get('/api/Comments', async (req, resp) => {
  try {
    const comments = await dbLib.getComments();
    resp.status(200).json(comments);
  } catch (err) {
    resp.status(400).json({ message: 'There was an eror' });
  }
});

webapp.post('/api/Comments', async (req, resp) => {
  try {
    // create the new student object
    const newComment = {
      content: req.body.content,
      writer: req.body.writer,
      postID: req.body.postID,
    };
    const result = await dbLib.createComment(newComment);
    resp.status(201).json({ _id: result });
  } catch (err) {
    resp.status(400).json({ message: 'There was an error' });
  }
});

// export the webapp
module.exports = webapp;
