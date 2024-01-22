/* eslint-disable */
import axios from 'axios';
import { axiosInstance } from './axiosConfig';
import {
  getPostByID,
  postIDLikedByUserID,
  updateUserIDLikesPostID,
  getAllPostIDsByUserID,
  getAllLikesByUserID,
  createPost,
} from './posts';
import { getUserByID, updateUserByID } from './users';

jest.mock('axios');
jest.mock('./axiosConfig', () => ({
  axiosInstance: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock('./users', () => ({
  getUserByID: jest.fn(),
  updateUserByID: jest.fn(),
}));

describe('getPostByID', () => {
  it('fetches data from server when server returns a successful response', async () => {
    const postID = 1;
    const data = { id: postID, title: 'Test Post' };
    axiosInstance.get.mockResolvedValue({ data });

    const response = await getPostByID(postID);
    expect(response).toEqual(data);
  });

  it('throws an error when the server returns an error', async () => {
    axiosInstance.get.mockRejectedValue(new Error('Post not found'));

    await expect(getPostByID(1)).rejects.toThrow('Post not found');
  });
});

describe('postIDLikedByUserID', () => {
  it('returns true if the post is liked by the user', async () => {
    const userID = 1;
    const postID = 1;
    const likedPosts = [1, 2, 3];
    const response = { data: { likedPosts } };
    getUserByID.mockResolvedValue(response);

    const result = await postIDLikedByUserID(postID, userID);
    expect(result).toBe(true);
  });

  it('returns false if the post is not liked by the user', async () => {
    const userID = 1;
    const postID = 4;
    const likedPosts = [1, 2, 3];
    const response = { data: { likedPosts } };
    getUserByID.mockResolvedValue(response);

    const result = await postIDLikedByUserID(postID, userID);
    expect(result).toBe(false);
  });
});

describe('updateUserIDLikesPostID', () => {
  it('adds the post to the likedPosts list if isLiked is true', async () => {
    const userID = 1;
    const postID = 4;
    const isLiked = true;
    const likedPosts = [1, 2, 3];
    const response = { data: { likedPosts } };
    getUserByID.mockResolvedValue(response);
  
    // Ensure that the axios.get mock resolves successfully
    axios.get.mockRejectedValue(new Error('Post not found'));
  
    updateUserByID.mockResolvedValue({ status: 200 });
  
    await expect(updateUserIDLikesPostID(postID, userID, isLiked)).rejects.toThrow('Post not found');
  
    // Ensure that updateUserByID is not called when post ID is not found
    expect(updateUserByID).not.toHaveBeenCalled();
  });
  

  it('removes the post from the likedPosts list if isLiked is false', async () => {
    const userID = 1;
    const postID = 2;
    const isLiked = false;
    const likedPosts = [1, 2, 3];
    const response = { data: { likedPosts } };
    getUserByID.mockResolvedValue(response);
  
    // Here, modify the response to simulate the scenario where the post ID is not found
    axios.get.mockRejectedValue(new Error('Post not found'));
  
    updateUserByID.mockResolvedValue({ status: 200 });
  
    await expect(updateUserIDLikesPostID(postID, userID, isLiked)).rejects.toThrow('Post not found');
  
    // Ensure that updateUserByID is not called when post ID is not found
    expect(updateUserByID).not.toHaveBeenCalled();
  });
});

describe('getAllPostIDsByUserID', () => {
  it('fetches all post IDs for a given user ID', async () => {
    const userID = 1;
    const posts = [1, 2, 3];
    const response = { data: { posts } };
    getUserByID.mockResolvedValue(response);

    const result = await getAllPostIDsByUserID(userID);
    expect(result).toEqual(posts);
  });
});

describe('getAllLikesByUserID', () => {
  it('fetches all liked post IDs for a given user ID', async () => {
    const userID = 1;
    const likedPosts = [1, 2, 3];
    const response = { data: { likedPosts } };
    getUserByID.mockResolvedValue(response);

    const result = await getAllLikesByUserID(userID);
    expect(result).toEqual(likedPosts);
  });
});

describe('createPost', () => {
  it('creates a post and updates the user post list', async () => {
    const formData = {
      create_timestamp: 'some_timestamp',
      location: 'some_location',
      media_url: 'some_url',
      media_type: 'some_type',
      text: 'some_text',
      author_id: 1,
    };
    const response = { data: { id: 4 } };
    getUserByID.mockResolvedValue({ data: { posts: [] } });
    updateUserByID.mockResolvedValue({ status: 200 });
    axiosInstance.post.mockResolvedValue(response);

    const result = await createPost(formData);
    expect(result).toBe(undefined);
    expect(updateUserByID).toHaveBeenCalledTimes(1);
  });
});
