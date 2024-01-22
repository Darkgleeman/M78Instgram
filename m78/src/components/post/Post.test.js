import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PropTypes from 'prop-types';
import Post from './Post';

jest.mock('../../api/posts', () => ({
  getPostByID: jest.fn().mockResolvedValue({}),
  postIDLikedByUserID: jest.fn().mockResolvedValue(false),
  updateUserIDLikesPostID: jest.fn(),
}));

jest.mock('../../api/users', () => ({
  getUserByID: jest.fn().mockResolvedValue({ data: { username: 'John Doe', avatarURL: 'avatar-url' } }),
}));

jest.mock('../error_page/ErrorPage', () => 'mocked-error-page');
jest.mock('../loader/Loader', () => 'mocked-loader');
jest.mock('./PostHeader', () => 'mocked-post-header');
jest.mock('./PostMedia', () => 'mocked-post-media');
jest.mock('./PostFooter', () => 'mocked-post-footer');

describe('Post Component', () => {
  const props = {
    postID: 1,
    userID: 2,
  };

  it('renders loader when userID is not present', () => {
    const { getByText } = render(<Post {...props} userID={null} />);
    expect(getByText('mocked-loader')).toBeInTheDocument();
  });

  it('renders loader when post or post author data is not present', async () => {
    const { getByText } = render(<Post {...props} />);
    expect(getByText('mocked-loader')).toBeInTheDocument();
    await waitFor(() => expect(getByText('mocked-loader')).not.toBeInTheDocument());
  });

  it('renders ErrorPage on error', () => {
    const { getByText } = render(<Post {...props} />);
    expect(getByText('mocked-error-page')).toBeInTheDocument();
  });

  it('has the correct prop types', () => {
    expect(Post.propTypes.postID).toBe(PropTypes.string.isRequired);
    expect(Post.propTypes.userID).toBe(PropTypes.string.isRequired);
  });
});
