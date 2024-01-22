import { sendComment, getCommentListByPostID } from './comments';
import { axiosInstance } from './axiosConfig';

// Mock Axios instance
jest.mock('./axiosConfig');

describe('Comment functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendComment', () => {
    it('sends a comment successfully', async () => {
      // Mock Axios post method
      axiosInstance.post.mockResolvedValueOnce({ status: 201 });

      const formData = {
        content: 'Test content',
        writer: 'Test writer',
        postID: 1,
      };

      const status = await sendComment(formData);

      expect(status).toBe(201);
      expect(axiosInstance.post).toHaveBeenCalledWith('http://localhost:8080/api/Comments', {
        content: formData.content,
        writer: formData.writer,
        postID: formData.postID,
      });
    });

    it('handles sendComment failure', async () => {
      // Mock Axios post method to simulate an error
      axiosInstance.post.mockRejectedValueOnce(new Error('Some error'));

      const formData = {
        content: 'Test content',
        writer: 'Test writer',
        postID: 1,
      };

      await expect(sendComment(formData)).rejects.toThrowError('Comment send failed');
    });
  });

  describe('getCommentListByPostID', () => {
    it('fetches comment list by post ID successfully', async () => {
      const mockResponse = [
        { id: 1, content: 'Comment 1', postID: 1 },
        { id: 2, content: 'Comment 2', postID: 1 },
      ];

      // Mock Axios get method
      axiosInstance.get.mockResolvedValueOnce({ data: mockResponse });

      const postID = 1;
      const commentList = await getCommentListByPostID(postID);

      expect(commentList).toEqual(mockResponse);
      expect(axiosInstance.get).toHaveBeenCalledWith('http://localhost:8080/api/Comments');
    });

    it('handles getCommentListByPostID failure', async () => {
      // Mock Axios get method to simulate an error
      axiosInstance.get.mockRejectedValueOnce(new Error('Some error'));

      const postID = 1;
      await expect(getCommentListByPostID(postID)).rejects.toThrowError('Comment list not found');
    });
  });
});
