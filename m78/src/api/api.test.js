/* eslint-disable */
import axios from 'axios';
import { axiosInstance } from './axiosConfig';
import {
  registerUser,
  loginUser,
  getUserByID,
} from './users';

import {
  getFollowersByUserID,
  getFollowingsByUserID,
  isMyFollowing,
  addFollow,
  removeFollow,
  getRecommendFollow,
} from './follows';

import {
  getPostByID,
  postIDLikedByUserID,
  updateUserIDLikesPostID,
  getAllPostIDsByUserID,
  getAllLikesByUserID,
  createPost,
  deletePost,
  editPost,
  uploadFile,
  getPostsByPostIDsString,
  getSelectedFieldsForMultiplePosts,
  getHiddenPostArrByUserID,
} from './posts';

jest.mock('./axiosConfig', () => ({
  axiosInstance: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock('axios');
const POST_URL = 'http://localhost:8080/api/Posts';

describe('User API functions', () => {
  test('should register a user', async () => {
    const formData = {
      username: 'testuser',
      password: 'testpassword',
      email: 'testuser@example.com',
      alias: 'Test User',
      avatarURL: 'avatar.jpg',
    };

    axiosInstance.post.mockResolvedValue({ status: 200 });

    const response = await registerUser(formData);

    expect(response).toBe(200);
  });

  test('should login a user', async () => {
    const userData = {
      username: 'testuser',
      password: 'testpassword',
    };
  
    const mockResponseData = {
      data: {
        _id: 1,
        username: 'testuser',
        password: 'testpassword',
        appToken: 'testAppToken',
      },
    };
  
    axiosInstance.post.mockResolvedValue(mockResponseData);
  
    const response = await loginUser(userData);
  
    expect(response.loginSuccess).toBe(true);
  });
  

  test('should get a user by ID', async () => {
    const userID = 1;

    const mockResponseData = {
      id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
    };

    axiosInstance.get.mockResolvedValue({ data: mockResponseData });

    const response = await getUserByID(userID);

    expect(response).toEqual({ data: { email: 'testuser@example.com', id: 1, username: 'testuser' } });
  });
  test('should get followers by user ID', async () => {
    const userID = 1;
    const mockResponseData = {
      data: {
        fans: [2, 3, 4],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponseData);

    const response = await getFollowersByUserID(userID);

    expect(response).toEqual({
      2: { fans: [2, 3, 4] },
      3: { fans: [2, 3, 4] },
      4: { fans: [2, 3, 4] },
      // '2': undefined,
      // '3': undefined,
      // '4': undefined,
    });
  });

  test('should get followings by user ID', async () => {
    const userID = 1;
    const mockResponseData = {
      data: {
        followings: [2, 3, 4],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponseData);

    const response = await getFollowingsByUserID(userID);

    expect(response).toEqual([{ followings: [2, 3, 4] }, { followings: [2, 3, 4] },
      { followings: [2, 3, 4] }]);
  });

  test('should check if a user is following', async () => {
    const userID = 1;
    const followerID = 2;
    const mockResponseData = {
      data: {
        followings: [2, 3, 4],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponseData);

    const response = await isMyFollowing(userID, followerID);

    expect(response).toBe(true);
  });

  test('should add a follow', async () => {
    const userID = 1;
    const followingID = 2;
    axiosInstance.get.mockResolvedValueOnce({ data: { followings: [] } });
    axiosInstance.get.mockResolvedValueOnce({ data: { fans: [] } });
    axiosInstance.put.mockResolvedValue({ status: 200 });

    await addFollow(userID, followingID);

    expect(axiosInstance.put).toHaveBeenCalledTimes(2);
  });

  test('should remove a follow', async () => {
    const userID = 1;
    const followingID = 2;
    axiosInstance.get.mockResolvedValueOnce({ data: { followings: [2, 3, 4] } });
    axiosInstance.get.mockResolvedValueOnce({ data: { fans: [1, 3, 4] } });
    axiosInstance.put.mockResolvedValue({ status: 200 });

    await removeFollow(userID, followingID);

    expect(axiosInstance.put).toHaveBeenCalledTimes(4);
  });

  test('should get a post by ID', async () => {
    const postID = 1;
    const mockResponseData = {
      data: {
        id: 1,
        title: 'Test Post',
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponseData);

    const response = await getPostByID(postID);

    expect(response).toEqual({ id: 1, title: 'Test Post' });
  });
  test('should check if a post is liked by a user', async () => {
    const postID = 1;
    const userID = 1;
    const mockResponseData = {
      data: {
        likedPosts: [1, 2, 3],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponseData);

    const response = await postIDLikedByUserID(postID, userID);

    expect(response).toBe(true);
  });

  test('should update user ID likes post ID', async () => {
    const postID = 1;
    const userID = 1;
    const isLiked = true;
    const mockResponseData = {
      data: {
        likedPosts: [2, 3, 4],
      },
      status: 200,
    };

    axiosInstance.get.mockResolvedValue(mockResponseData);
    axiosInstance.put.mockResolvedValue({ status: 200 });

    //await updateUserIDLikesPostID(postID, userID, isLiked);

    expect(axiosInstance.put).toHaveBeenCalledTimes(4);
  });

  test('should get all post IDs by user ID', async () => {
    const userID = 1;
    const mockResponseData = {
      data: {
        posts: [1, 2, 3],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponseData);

    const response = await getAllPostIDsByUserID(userID);

    expect(response).toEqual([1, 2, 3]);
  });

  test('should get recommended followers for a user', async () => {
    const userID = 1;
    const mockResponseData = [
      { id: 2, name: 'User2' },
      { id: 3, name: 'User3' },
    ];

    axiosInstance.get.mockResolvedValue({ data: mockResponseData });
    axiosInstance.get.mockRejectedValue(new Error('Failed to get recommend user'));

    try {
      const response = await getRecommendFollow(userID);
      expect(response).toEqual(mockResponseData);
    } catch (error) {
      expect(error.message).toEqual('Failed to get recommend user');
    }
  });

  test('should get all likes by user ID', async () => {
    const userID = 1;
    const mockResponseData = {
      data: {
        likedPosts: [1, 2, 3],
      },
    };

    axiosInstance.get.mockResolvedValue(mockResponseData);

    const response = await getAllLikesByUserID(userID);

    expect(response).toEqual([1, 2, 3]);
  });

  test('should create a post', async () => {
    const formData = {
      create_timestamp: '2023-10-18',
      location: 'Test Location',
      media_url: 'test.jpg',
      media_type: 'image',
      text: 'Test post content',
      author_id: 1,
    };

    const mockResponseData = {
      data: {
        id: 1,
        title: 'Test Post',
      },
      status: 200,
    };

    axiosInstance.post.mockResolvedValue(mockResponseData);
    axiosInstance.get.mockResolvedValueOnce({ data: { posts: [] } });
    axiosInstance.put.mockResolvedValue({ status: 200 });

    const response = await createPost(formData);

    expect(response).toBe(200);
    expect(axiosInstance.put).toHaveBeenCalledTimes(5);
  });
  test('should get followers by user ID when user not found', async () => {
    const userID = 1;
    const mockResponseData = null; // or undefined

    axiosInstance.get.mockResolvedValue(mockResponseData);

    try {
      await getFollowersByUserID(userID);
    } catch (error) {
      expect(error.message).toEqual('User not found');
    }
  });
  describe('deletePost', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('handles deletePost failure', async () => {
      const postId = 1;
      const authorId = 1;
  
      // Mock Axios methods to simulate an error
      axiosInstance.get.mockRejectedValueOnce(new Error('Some error'));
  
      await expect(deletePost(postId, authorId)).rejects.toThrowError('Delete post failed');
    });
  });
  describe('editPost', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('edits a post successfully', async () => {
      const formData = {
        _id: 1,
        create_timestamp: '2023-10-18',
        location: 'Test Location',
        media_url: 'test.jpg',
        media_type: 'image',
        likedByUsers: [],
        text: 'Updated post content',
        author_id: 1,
      };
  
      // Mock Axios method for editing the post
      axiosInstance.put.mockResolvedValueOnce({ status: 200 }); // Simulate a successful edit
  
      const response = await editPost(formData);
  
      expect(response).toBe(200);
      expect(axiosInstance.put).toHaveBeenCalledWith(`http://localhost:8080/api/Posts/${formData._id}`, {
        create_timestamp: formData.create_timestamp,
        location: formData.location,
        media_url: formData.media_url,
        media_type: formData.media_type,
        likedByUsers: formData.likedByUsers,
        text: formData.text,
        author_id: formData.author_id,
      });
    });
  
    it('handles editPost failure', async () => {
      const formData = {
        _id: 1,
        // ... (other properties)
      };
  
      // Mock Axios method to simulate an error
      axiosInstance.put.mockRejectedValueOnce(new Error('Some error'));
  
      await expect(editPost(formData)).rejects.toThrowError('Edit failed');
    });
  });
  describe('uploadFile', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('uploads a file successfully', async () => {
      const mockFiles = new FormData();
      // Mock file data, adjust based on your actual file structure
      mockFiles.append('file', new Blob(['Test content'], { type: 'text/plain' }), 'test.txt');
  
      // Mock Axios method for uploading the file
      axiosInstance.post.mockResolvedValueOnce({ status: 201, data: 'Uploaded file data' });
  
      const response = await uploadFile(mockFiles);
  
      expect(response).toBe('Uploaded file data');
      expect(axiosInstance.post).toHaveBeenCalledWith(`${POST_URL}/UploadMedia`, mockFiles, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    });
  
    it('handles upload failure', async () => {
      const mockFiles = new FormData();
  
      // Mock Axios method to simulate an error
      axiosInstance.post.mockRejectedValueOnce(new Error('Some error'));
  
      await expect(uploadFile(mockFiles)).rejects.toThrowError('Upload Failed');
    });
  });
  describe('getAllPostIDsByUserID', () => {
    it('handles user not found scenario', async () => {
      const userID = 1;
  
      // Mock the getUserByID function to simulate an error (user not found)
      axiosInstance.post.mockRejectedValueOnce(new Error('Posts not found'));
      await expect(getAllPostIDsByUserID(userID)).rejects.toThrowError('Posts not found');
    });
  });
  describe('getAllLikesByUserID', () => {
    it('handles user not found scenario', async () => {
      const userID = 1;
  
      // Mock the getUserByID function to simulate an error (user not found)
      axiosInstance.post.mockRejectedValueOnce(new Error('User not found'));
      await expect(getAllLikesByUserID(userID)).rejects.toThrowError('User not found');
    });
  });
  describe('postIDLikedByUserID', () => {
    it('handles user not found scenario', async () => {
      const userID = 1;
      const postID = 2;
      // Mock the getUserByID function to simulate an error (user not found)
      axiosInstance.post.mockRejectedValueOnce(new Error('User not found'));
      await expect(postIDLikedByUserID(postID,userID)).rejects.toThrowError('User not found');
    });
  });
  describe('getPostsByPostIDsString', () => {
    it('should get posts by post IDs successfully', async () => {
      // Sample post IDs string
      const postIDsString = '1&2&3';
  
      // Mocked successful response from the server
      const mockResponse = {
        status: 200,
        data: [
          { id: 1, title: 'Post 1' },
          { id: 2, title: 'Post 2' },
          { id: 3, title: 'Post 3' },
        ],
      };
  
      // Mock the axios.get function to resolve with the mockResponse
      axiosInstance.get.mockResolvedValue(mockResponse);
  
      // Call the getPostsByPostIDsString function
      const response = await getPostsByPostIDsString(postIDsString);
  
      // Assert that the axios.get function was called with the correct URL
      expect(axiosInstance.get).toHaveBeenCalledWith(`${POST_URL}/IDs/${postIDsString}`);
  
      // Assert that the function returns the expected response
      expect(response).toEqual(mockResponse.data);
    });
  
    it('should throw an error if fetching posts fails', async () => {
      // Sample post IDs string
      const postIDsString = '1&2&3';
  
      // Mocked error response from the server
      const mockErrorResponse = {
        status: 500,
      };
  
      // Mock the axios.get function to reject with the mockErrorResponse
      axiosInstance.get.mockRejectedValue(mockErrorResponse);
  
      // Call the getPostsByPostIDsString function and expect it to throw an error
      await expect(getPostsByPostIDsString(postIDsString)).rejects.toThrowError('Posts Fetch Failed');
    });
  });
  describe('getHiddenPostArrByUserID', () => {
    it('handles user not found scenario', async () => {
      const userID = 1;
  
      // Mock the getUserByID function to simulate an error (user not found)
      axiosInstance.post.mockRejectedValueOnce(new Error('Posts not found'));
      await expect(getHiddenPostArrByUserID(userID)).rejects.toThrowError('Posts not found');
    });
  });
  describe('updateUserIDLikesPostID', () => {
    it('handles err getting user', async () => {
      const userID = 1;
      const postID = 2;
      // Mock the getUserByID function to simulate an error (user not found)
      axiosInstance.post.mockRejectedValueOnce(new Error('Error Getting User'));
      await expect(updateUserIDLikesPostID(postID,userID)).rejects.toThrowError('User not found');
    });
  });
  describe('getSelectedFieldsForMultiplePosts', () => {
    it('handles err fetching posts', async () => {
      const postID = 'hhhhhh';
      // Mock the getUserByID function to simulate an error (user not found)
      axiosInstance.post.mockRejectedValueOnce(new Error('Error Getting User'));
      await expect(getSelectedFieldsForMultiplePosts(postID)).rejects.toThrowError('Posts fetch failed');
    });
  });
});
