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
} from './posts'; // Replace 'yourModule' with the correct path to your module
import { axiosInstance } from './axiosConfig';
// Mock axiosInstance
jest.mock('./axiosConfig', () => ({
  axiosInstance: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock getUserByID from './users'
jest.mock('./users', () => ({
  getUserByID: jest.fn(),
  updateUserByID: jest.fn(),
}));

describe('getPostByID', () => {
  it('should fetch a post by ID', async () => {
    // Mock successful response
    axiosInstance.get.mockResolvedValue({ data: { /* your post data here */ } });

    const result = await getPostByID('postId');

    expect(result).toEqual({ /* expected post data */ });
    expect(axiosInstance.get).toHaveBeenCalledWith('http://localhost:8080/api/Posts/postId');
  });

  it('should handle an error while fetching a post', async () => {
    // Mock an error response
    axiosInstance.get.mockRejectedValue(new Error('Failed to fetch post'));

    await expect(getPostByID('postId')).rejects.toThrow('Post not found');
  });
});

// Similar tests for other functions...
