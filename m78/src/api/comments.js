import { axiosInstance } from './axiosConfig';

const COMMENT_URL = 'http://localhost:8080/api/Comments';

async function sendComment(formData) {
  try {
    const response = await axiosInstance.post(`${COMMENT_URL}`, {
      content: formData.content,
      writer: formData.writer,
      postID: formData.postID,
    });

    return response.status;
  } catch (error) {
    throw Error('Comment send failed');
  }
}

async function getCommentListByPostID(postID) {
  try {
    const response = await axiosInstance.get(`${COMMENT_URL}`);
    const commentList = response.data.filter((comment) => comment.postID === postID);

    return commentList;
  } catch (error) {
    throw Error('Comment list not found');
  }
}

export {
  sendComment,
  getCommentListByPostID,
};
