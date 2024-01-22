import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PostBar from './PostBar';
import { getFollowingsByUserID } from '../../api/follows';
import { getAllPostIDsByUserID } from '../../api/posts';

// jest.mock('../../api/users', () => ({
//   getAllPostIDsByUserID: jest.fn(),
//   getFollowingsByUserID: jest.fn(),
// }));
jest.mock('../../api/follows');
jest.mock('../../api/posts');

describe('PostBar component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // test('renders without error', async () => {
  //   const userID = 1;
  //   getAllPostIDsByUserID.mockResolvedValue([1, 2, 3]);
  //   getFollowingsByUserID.mockResolvedValue([{ id: 2 }, { id: 3 }]);

  //   render(<PostBar userID={userID} />);

  //   await waitFor(() => {
  //     const postBarPosts = screen.queryAllByTestId('postbar-posts');
  //     expect(postBarPosts.length).toBe(0);
  //   });
  // test('renders without error', async () => {
  //   render(<PostBar userID={1} />);
  //   // const titleElement = screen.queryByText(/boss/i);
  //   // expect(titleElement).toBeTruthy();
  //   await waitFor(() => {
  //     const postBarPosts = screen.queryAllByTestId('postbar-posts');
  //     expect(postBarPosts.length).toBe(0);
  //   });
  // });

  test('renders error page when API call fails', async () => {
    const userID = 1;
    getAllPostIDsByUserID.mockRejectedValue(new Error('API error'));
    getFollowingsByUserID.mockResolvedValue([]);

    render(<PostBar userID={userID} />);

    await waitFor(() => {
      expect(screen.getByText('Sorry, this page is not available.')).toBeInTheDocument();
      expect(screen.getByText('The link you followed may be broken, or the page may have been removed.')).toBeInTheDocument();
    });
  });

  test('fetches posts and combines them correctly', async () => {
    const userID = 1;
    const mockPosts = [1, 2, 3];
    const mockFollowings = [{ id: 2 }, { id: 3 }];

    getAllPostIDsByUserID.mockResolvedValue(mockPosts);
    getFollowingsByUserID.mockResolvedValue(mockFollowings);

    render(<PostBar userID={userID} />);

    await waitFor(() => {
      expect(screen.queryByText('Sorry, this page is not available.')).not.toBeInTheDocument();
    });
  });
});
