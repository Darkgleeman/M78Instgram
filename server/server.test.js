/* eslint-disable */
// import supertest
const request = require('supertest');

// import our web app
const webapp = require('./server');

// Import database operations
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { getDB } = require('./db_api/setup');
const { getUserById } = require('./db_api/user');
const dbLib = require('./db_api');
const { generateUserToken } = require('./utils/auth');

// MongoDB URL
const url = 'mongodb+srv://m78:yyzytwxh@m78.hgw3cdw.mongodb.net/m78?retryWrites=true&w=majority';

beforeAll(async () => {
  webapp.listen();
  await dbLib.connect(url);
});

const cleanUp = async () => {
  try {
    const db = await getDB();
    await db.collection('Users').deleteOne({_id: new ObjectId(id)});
    await db.collection('Comments').deleteOne({_id: new ObjectId(commentid)});
  } catch (err) {
    throw new Error(err.message);
  }
}

afterAll(async () => {
  // Clean up code here
  await cleanUp();

  // Close the web app and disconnect from the database
  await dbLib.closeMongoDBConnection();
});

let id;
let postid;
let token;
let commentid;
describe('endpoint tests', () => {
  test('/Users POST endpoint status code and response 404', () => request(webapp).post('/api/Users')
    .send({ player: '', points: 3 }).expect(404)
    .then((response) => expect(JSON.parse(response.text).message).toBe('missing name or username in the body')));

  const newUser = {
    username: 'test',
    password: '123',
    email: '',
    alias: '',
    avatarURL: '',
  };
  test('status code 201 and response', async () => {
    const res = await request(webapp).post('/api/Users').send(newUser);
    id = JSON.parse(res.text).data.id;
    console.log(id);
    expect(res.status).toBe(201);
  });

  test('status code 409 and response', async () => {
    const res = await request(webapp).post('/api/Users').send(newUser);
    expect(res.status).toBe(409);
  });

  test('test login success', async () => {
    const res = await request(webapp).post('/api/login').send({ username: 'test', password: '123' });
    console.log(JSON.parse(res.text).appToken);
    token = JSON.parse(res.text).appToken;
    expect(res.status).toBe(201);
  });

  test('test login fail empty username', async () => {
    const res = await request(webapp).post('/api/login').send({ username: '', password: '123' });
    expect(res.status).toBe(400);
    expect(JSON.parse(res.text).error).toBe('Bad Request');
  })

  test('Get all users', async () => {
    const resp = await request(webapp).get('/api/Users').set('Authorization', `${token}`);
    expect(resp.status).toBe(200);
    expect(resp.type).toBe('application/json');
    const userArr = JSON.parse(resp.text);
    expect(userArr.length).toBeGreaterThan(0);
  });

  test('Invalid token upon request', async () => {
    const resp = await request(webapp).get('/api/Users').set('Authorization', 'Invalid Token');
    expect(resp.status).toBe(401);
  });

  test('Get a user by id', async () => {
    const resp = await request(webapp).get(`/api/Users/${id}`).set('Authorization', `${token}`);
    expect(resp.status).toBe(200);
    expect(resp.type).toBe('application/json');
    const user = JSON.parse(resp.text);
    expect(user.username).toBe('test');
  });

  test('Get a user by id 404', async () => {
    const resp = await request(webapp).get('/api/Users/654705e4').set('Authorization', `${token}`);
    expect(resp.status).toBe(404);
    expect(resp.type).toBe('application/json');
    const user = JSON.parse(resp.text);
    expect(user.message).toBe('there was error');
  });

  test('Put a user by id', async () => {
    const resp = await request(webapp).put(`/api/Users/${id}`).set('Authorization', `${token}`)
      .send({ alias: 'test' });
    expect(resp.status).toBe(200);
    expect(resp.type).toBe('application/json');
  });

  test('Put a user by id 404', async () => {
    const resp = await request(webapp).put('/api/Users/654705e4').set('Authorization', `${token}`)
      .send({ username: 'tong' });
    expect(resp.status).toBe(404);
    expect(resp.type).toBe('application/json');
    const user = JSON.parse(resp.text);
    expect(user.message).toBe('there was error');
  });

  test('/Posts POST endpoint status code and response 404', () => request(webapp).post('/api/Posts').set('Authorization', `${token}`)
    .send({ player: '', points: 3 }).expect(404)
    .then((response) => expect(JSON.parse(response.text).message).toBe('missing text, location in the body')));

  const newPost = {
    create_timestamp: '2023-11-05T03:03:24.287Z',
    location: 'Library',
    media_url: 'https://www.youtube.com/embed/ROIZoGM-y2o?si=Ot6wJmm_nmPD5_q2',
    media_type: 'video',
    likedByUsers: [],
    hiddenByUsers: [],
    text: 'test post',
    author_id: `${id}`,
  };
  // let postid;
  test('status code 201 and response', async () => {
    const res = await request(webapp).post('/api/Posts').send(newPost).set('Authorization', `${token}`);
    postid = JSON.parse(res.text)._id;
    expect(res.status).toBe(201);
  });

  test('Get all posts', async () => {
    const resp = await request(webapp).get('/api/Posts').set('Authorization', `${token}`);
    expect(resp.status).toBe(200);
    expect(resp.type).toBe('application/json');
    const userArr = JSON.parse(resp.text);
    expect(userArr.length).toBeGreaterThan(0);
  });

  test('Get /Posts/IDs/:ids', async () => {
    const resp = await request(webapp).get(`/api/Posts/IDs/${postid}`).set('Authorization', `${token}`);
    expect(resp.status).toBe(200);
    expect(resp.type).toBe('application/json');
    const user = JSON.parse(resp.text);
    expect(user.length).toBeGreaterThan(0);
  });

  test('Get /Posts/IDs/:ids', async () => {
    const resp = await request(webapp).get('/api/Posts/IDs/sasas').set('Authorization', `${token}`);
    expect(resp.status).toBe(500);
  });

  test('Get a post by id', async () => {
    const resp = await request(webapp).get(`/api/Posts/${postid}`).set('Authorization', `${token}`);
    expect(resp.status).toBe(200);
    expect(resp.type).toBe('application/json');
    const user = JSON.parse(resp.text);
    expect(user.text).toBe('test post');
  });

  test('Get a post by id 404', async () => {
    const resp = await request(webapp).get('/api/Posts/654705e4').set('Authorization', `${token}`);
    expect(resp.status).toBe(400);
    expect(resp.type).toBe('application/json');
    const user = JSON.parse(resp.text);
    expect(user.message).toBe('There was an error');
  });

  test('Put a post by id', async () => {
    const resp = await request(webapp).put(`/api/Posts/${postid}`).set('Authorization', `${token}`)
      .send({ location: 'WC' });
    expect(resp.status).toBe(200);
    expect(resp.type).toBe('application/json');
  });

  const newComment = {
    content: 'A good day',
    writer: `${id}`,
    postID: `${postid}`,
  };
  test('status code 201 and response', async () => {
    const res = await request(webapp).post('/api/Comments').send(newComment).set('Authorization', `${token}`);
    commentid = JSON.parse(res.text)._id;
    console.log(commentid);
    expect(res.status).toBe(201);
  });

  test('Get all comments', async () => {
    const resp = await request(webapp).get('/api/Comments').set('Authorization', `${token}`);
    expect(resp.status).toBe(200);
    expect(resp.type).toBe('application/json');
    const userArr = JSON.parse(resp.text);
    expect(userArr.length).toBeGreaterThan(0);
  });

  test('Delete Post by id', async () => {
    const resp = await request(webapp).delete(`/api/Posts/${postid}`).set('Authorization', `${token}`);
    expect(resp.status).toBe(200);
    expect(resp.type).toBe('application/json');
  });
  test('Delete post by id 404', async () => {
    const resp = await request(webapp).delete('/api/Posts/qqweqwd').set('Authorization', `${token}`);
    expect(resp.status).toBe(400);
    expect(resp.type).toBe('application/json');
    const user = JSON.parse(resp.text);
    expect(user.message).toBe('there was error');
  });

  test('Put a post by id 404', async () => {
    const resp = await request(webapp).put('/api/Posts/qqweqwd').set('Authorization', `${token}`)
      .send({ username: 'tong' });
    expect(resp.status).toBe(404);
    expect(resp.type).toBe('application/json');
    const user = JSON.parse(resp.text);
    expect(user.message).toBe('there was error');
  });
});
